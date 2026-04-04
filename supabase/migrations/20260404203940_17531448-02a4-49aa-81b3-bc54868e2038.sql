
-- Create doctor_notes table
CREATE TABLE public.doctor_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL,
  assessment TEXT,
  plan TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctor_notes ENABLE ROW LEVEL SECURITY;

-- SELECT: doctor sees own notes + notes for assigned patients; patient sees own; admin/support see all
CREATE POLICY "doctor_notes_select"
ON public.doctor_notes FOR SELECT
TO authenticated
USING (
  doctor_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.patients p
    WHERE p.id = doctor_notes.patient_id
      AND (p.assigned_doctor_id = auth.uid() OR p.linked_user_id = auth.uid())
  )
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'support')
);

-- INSERT: doctors and admins
CREATE POLICY "doctor_notes_insert"
ON public.doctor_notes FOR INSERT
TO authenticated
WITH CHECK (
  doctor_id = auth.uid()
  AND (public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'admin'))
);

-- UPDATE: only the author or admin
CREATE POLICY "doctor_notes_update"
ON public.doctor_notes FOR UPDATE
TO authenticated
USING (doctor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (doctor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- DELETE: only the author or admin
CREATE POLICY "doctor_notes_delete"
ON public.doctor_notes FOR DELETE
TO authenticated
USING (doctor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_doctor_notes_updated_at
BEFORE UPDATE ON public.doctor_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast lookups
CREATE INDEX idx_doctor_notes_patient_id ON public.doctor_notes(patient_id);
CREATE INDEX idx_doctor_notes_doctor_id ON public.doctor_notes(doctor_id);
