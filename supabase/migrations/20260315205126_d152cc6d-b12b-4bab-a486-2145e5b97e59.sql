-- Fix Storage RLS: Replace overly permissive policies with path-based access control

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view lab reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload lab reports" ON storage.objects;

-- SELECT: Users can only view their own files OR files of their assigned patients
CREATE POLICY "Secure lab report read access"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'lab_reports'
  AND (
    -- File owner (path starts with user's ID)
    (storage.foldername(name))[1] = auth.uid()::text
    -- Doctor viewing assigned patient's files
    OR EXISTS (
      SELECT 1 FROM public.patients p
      WHERE (storage.foldername(name))[1] = p.linked_user_id::text
        AND (p.assigned_doctor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
    -- Support role (read-only)
    OR public.has_role(auth.uid(), 'support')
  )
);

-- INSERT: Users can only upload to their own folder
CREATE POLICY "Secure lab report upload access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lab_reports'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.has_role(auth.uid(), 'doctor')
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- DELETE: Only file owner, assigned doctor, or admin
CREATE POLICY "Secure lab report delete access"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'lab_reports'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.has_role(auth.uid(), 'doctor')
    OR public.has_role(auth.uid(), 'admin')
  )
);