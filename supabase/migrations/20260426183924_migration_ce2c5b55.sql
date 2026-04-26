-- 1. Fix Errors: Enable RLS on all exposed tables
ALTER TABLE IF EXISTS public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.risk_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.clinical_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.patient_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.drug_changes ENABLE ROW LEVEL SECURITY;

-- 2. Fix Warnings: Remove duplicate RLS policies on patients table
DROP POLICY IF EXISTS "Doctors can view their patients" ON public.patients;
DROP POLICY IF EXISTS "doctor access" ON public.patients;

-- 3. Fix Info: Remove duplicate indexes
DROP INDEX IF EXISTS public.idx_doctor_patient;
DROP INDEX IF EXISTS public.idx_transplant_patient;
DROP INDEX IF EXISTS public.idx_event_patient;
DROP INDEX IF EXISTS public.idx_risk_patient;
DROP INDEX IF EXISTS public.idx_alert_patient;

-- 4. Investigate: Find views causing Security Definer warning
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';