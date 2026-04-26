-- Fix Security Definer Views: Recreate with SECURITY INVOKER (default safe mode)
DROP VIEW IF EXISTS public.high_risk_patients CASCADE;
DROP VIEW IF EXISTS public.doctor_dashboard CASCADE;

-- Recreate high_risk_patients view with SECURITY INVOKER (safe default)
CREATE VIEW public.high_risk_patients 
WITH (security_invoker = true) AS
SELECT 
    id,
    organ_type,
    alt,
    ast,
    risk_status,
    created_at
FROM lab_results lr
WHERE risk_status = 'HIGH'
ORDER BY created_at DESC;

-- Recreate doctor_dashboard view with SECURITY INVOKER (safe default)
CREATE VIEW public.doctor_dashboard 
WITH (security_invoker = true) AS
SELECT 
    p.full_name,
    l.organ_type,
    l.alt,
    l.ast,
    l.risk_status,
    l.ai_message,
    l.created_at
FROM lab_results l
JOIN patients p ON l.patient_id = p.id
ORDER BY l.created_at DESC;

-- Grant appropriate permissions
GRANT SELECT ON public.high_risk_patients TO authenticated;
GRANT SELECT ON public.doctor_dashboard TO authenticated;