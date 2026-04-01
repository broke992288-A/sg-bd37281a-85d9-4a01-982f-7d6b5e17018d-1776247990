
-- ============================================
-- 1. lab_reference_profiles table
-- ============================================
CREATE TABLE public.lab_reference_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  organ_type text NOT NULL,
  test_name text NOT NULL,
  min_value numeric,
  max_value numeric,
  unit text NOT NULL,
  version text NOT NULL DEFAULT 'v1.0',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lab_reference_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read lab reference profiles"
  ON public.lab_reference_profiles FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage lab reference profiles"
  ON public.lab_reference_profiles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Unique constraint to prevent duplicates
CREATE UNIQUE INDEX idx_lab_ref_unique
  ON public.lab_reference_profiles (country, organ_type, test_name, version);

-- ============================================
-- 2. normalize_lab_value SQL function
-- ============================================
CREATE OR REPLACE FUNCTION public.normalize_lab_value(
  _test_name text,
  _value numeric,
  _unit text
) RETURNS numeric
LANGUAGE sql IMMUTABLE
AS $$
  SELECT CASE
    -- Bilirubin: µmol/L → mg/dL (÷ 17.1)
    WHEN _test_name IN ('total_bilirubin', 'direct_bilirubin')
         AND _unit = 'µmol/L'
    THEN ROUND(_value / 17.1, 2)

    -- Creatinine: µmol/L → mg/dL (÷ 88.4)
    WHEN _test_name = 'creatinine'
         AND _unit = 'µmol/L'
    THEN ROUND(_value / 88.4, 2)

    -- Urea: mmol/L → mg/dL (× 6)
    WHEN _test_name = 'urea'
         AND _unit = 'mmol/L'
    THEN ROUND(_value * 6, 2)

    -- Hemoglobin: g/L → g/dL (÷ 10)
    WHEN _test_name = 'hb'
         AND _unit = 'g/L'
    THEN ROUND(_value / 10, 2)

    -- Already in standard units
    ELSE _value
  END
$$;

-- ============================================
-- 3. calculate_risk_score_sql function
-- ============================================
CREATE OR REPLACE FUNCTION public.calculate_risk_score_sql(
  _organ_type text,
  _patient_id uuid
) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _score integer := 0;
  _level text;
  _lab RECORD;
  _patient RECORD;
  _days_since_tx integer;
BEGIN
  -- Get patient info
  SELECT * INTO _patient FROM public.patients WHERE id = _patient_id;
  IF _patient IS NULL THEN
    RETURN jsonb_build_object('error', 'Patient not found');
  END IF;

  -- Get latest lab
  SELECT * INTO _lab FROM public.lab_results
    WHERE patient_id = _patient_id
    ORDER BY recorded_at DESC LIMIT 1;

  IF _lab IS NULL THEN
    RETURN jsonb_build_object('score', 0, 'level', 'low', 'details', 'No lab data');
  END IF;

  -- Blood type mismatch
  IF _patient.blood_type IS NOT NULL
     AND _patient.donor_blood_type IS NOT NULL
     AND _patient.blood_type <> _patient.donor_blood_type THEN
    IF COALESCE(_patient.titer_therapy, false) THEN
      _score := _score + 10;
    ELSE
      _score := _score + 25;
    END IF;
  END IF;

  -- Early post-transplant (<90 days)
  IF _patient.transplant_date IS NOT NULL THEN
    _days_since_tx := (CURRENT_DATE - _patient.transplant_date);
    IF _days_since_tx >= 0 AND _days_since_tx < 90 THEN
      _score := _score + 10;
    END IF;
  END IF;

  -- Re-transplant
  IF COALESCE(_patient.transplant_number, 1) >= 2 THEN
    _score := _score + 15;
  END IF;

  -- Organ-specific scoring
  IF _organ_type = 'liver' THEN
    -- ALT (severe thresholds)
    IF COALESCE(_lab.alt, 0) > 800 THEN _score := _score + 40;
    ELSIF COALESCE(_lab.alt, 0) > 500 THEN _score := _score + 30;
    ELSIF COALESCE(_lab.alt, 0) > 120 THEN _score := _score + 25;
    ELSIF COALESCE(_lab.alt, 0) > 60 THEN _score := _score + 10;
    END IF;

    -- AST
    IF COALESCE(_lab.ast, 0) > 500 THEN _score := _score + 25;
    ELSIF COALESCE(_lab.ast, 0) > 120 THEN _score := _score + 20;
    ELSIF COALESCE(_lab.ast, 0) > 60 THEN _score := _score + 8;
    END IF;

    -- Total Bilirubin (mg/dL)
    IF COALESCE(_lab.total_bilirubin, 0) > 10.0 THEN _score := _score + 30;
    ELSIF COALESCE(_lab.total_bilirubin, 0) > 3.0 THEN _score := _score + 20;
    ELSIF COALESCE(_lab.total_bilirubin, 0) > 1.5 THEN _score := _score + 10;
    END IF;

    -- Direct Bilirubin
    IF COALESCE(_lab.direct_bilirubin, 0) > 1.5 THEN _score := _score + 10;
    ELSIF COALESCE(_lab.direct_bilirubin, 0) > 0.5 THEN _score := _score + 5;
    END IF;

    -- GGT
    IF COALESCE(_lab.ggt, 0) > 500 THEN _score := _score + 20;
    ELSIF COALESCE(_lab.ggt, 0) > 200 THEN _score := _score + 15;
    ELSIF COALESCE(_lab.ggt, 0) > 60 THEN _score := _score + 8;
    END IF;

    -- ALP
    IF COALESCE(_lab.alp, 0) > 300 THEN _score := _score + 15;
    ELSIF COALESCE(_lab.alp, 0) > 120 THEN _score := _score + 8;
    END IF;

    -- Tacrolimus
    IF COALESCE(_lab.tacrolimus_level, 0) > 0 THEN
      IF _lab.tacrolimus_level < 5 THEN _score := _score + 25;
      ELSIF _lab.tacrolimus_level > 15 THEN _score := _score + 15;
      END IF;
    END IF;

  ELSE -- kidney
    -- Creatinine (mg/dL)
    IF COALESCE(_lab.creatinine, 0) > 4.0 THEN _score := _score + 35;
    ELSIF COALESCE(_lab.creatinine, 0) > 2.5 THEN _score := _score + 30;
    ELSIF COALESCE(_lab.creatinine, 0) > 1.5 THEN _score := _score + 12;
    END IF;

    -- eGFR
    IF COALESCE(_lab.egfr, 999) < 15 THEN _score := _score + 30;
    ELSIF COALESCE(_lab.egfr, 999) < 30 THEN _score := _score + 25;
    ELSIF COALESCE(_lab.egfr, 999) < 45 THEN _score := _score + 12;
    END IF;

    -- Proteinuria
    IF COALESCE(_lab.proteinuria, 0) > 3.0 THEN _score := _score + 20;
    ELSIF COALESCE(_lab.proteinuria, 0) > 1.0 THEN _score := _score + 15;
    ELSIF COALESCE(_lab.proteinuria, 0) > 0.3 THEN _score := _score + 8;
    END IF;

    -- Potassium
    IF COALESCE(_lab.potassium, 0) > 6.0 THEN _score := _score + 15;
    ELSIF COALESCE(_lab.potassium, 0) > 5.5 THEN _score := _score + 8;
    ELSIF COALESCE(_lab.potassium, 0) > 0 AND _lab.potassium < 3.5 THEN _score := _score + 8;
    END IF;

    -- Tacrolimus
    IF COALESCE(_lab.tacrolimus_level, 0) > 0 THEN
      IF _lab.tacrolimus_level < 5 THEN _score := _score + 20;
      ELSIF _lab.tacrolimus_level > 15 THEN _score := _score + 12;
      END IF;
    END IF;

    -- Dialysis history
    IF COALESCE(_patient.dialysis_history, false) THEN
      _score := _score + 20;
    END IF;
  END IF;

  -- Cap at 100
  _score := LEAST(_score, 100);

  -- Determine level
  IF _score >= 60 THEN _level := 'high';
  ELSIF _score >= 30 THEN _level := 'medium';
  ELSE _level := 'low';
  END IF;

  RETURN jsonb_build_object(
    'score', _score,
    'level', _level,
    'organ_type', _organ_type,
    'patient_id', _patient_id
  );
END;
$$;
