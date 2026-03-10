
-- Helper function to normalize phone numbers (remove everything except digits, then prepend +)
CREATE OR REPLACE FUNCTION public.normalize_phone(_phone text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN _phone IS NULL OR trim(_phone) = '' THEN NULL
    ELSE '+' || regexp_replace(trim(_phone), '[^0-9]', '', 'g')
  END;
$$;

-- Update register_patient_self to use normalized phone matching
CREATE OR REPLACE FUNCTION public.register_patient_self(
  _full_name text, 
  _phone text DEFAULT NULL, 
  _date_of_birth date DEFAULT NULL, 
  _gender text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _patient_id uuid;
  _normalized_phone text;
BEGIN
  -- Check if user already has a linked patient record
  SELECT id INTO _patient_id FROM public.patients WHERE linked_user_id = auth.uid();
  IF _patient_id IS NOT NULL THEN
    RETURN _patient_id;
  END IF;

  -- Normalize the incoming phone
  _normalized_phone := public.normalize_phone(_phone);

  -- Check if there's a patient with matching phone (doctor pre-created)
  IF _normalized_phone IS NOT NULL THEN
    SELECT id INTO _patient_id 
    FROM public.patients 
    WHERE public.normalize_phone(phone) = _normalized_phone 
      AND linked_user_id IS NULL 
    LIMIT 1;
    
    IF _patient_id IS NOT NULL THEN
      UPDATE public.patients 
      SET linked_user_id = auth.uid(), 
          full_name = _full_name,
          phone = _normalized_phone
      WHERE id = _patient_id;
      RETURN _patient_id;
    END IF;
  END IF;

  -- Create new patient record
  INSERT INTO public.patients (full_name, phone, date_of_birth, gender, linked_user_id, organ_type, risk_level)
  VALUES (_full_name, _normalized_phone, _date_of_birth, _gender, auth.uid(), 'kidney', 'low')
  RETURNING id INTO _patient_id;

  RETURN _patient_id;
END;
$$;

-- Also normalize phone when doctors insert/update patients
CREATE OR REPLACE FUNCTION public.normalize_patient_phone()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.phone := public.normalize_phone(NEW.phone);
  RETURN NEW;
END;
$$;

-- Create trigger to auto-normalize phone on insert/update
DROP TRIGGER IF EXISTS trg_normalize_patient_phone ON public.patients;
CREATE TRIGGER trg_normalize_patient_phone
  BEFORE INSERT OR UPDATE OF phone ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_patient_phone();
