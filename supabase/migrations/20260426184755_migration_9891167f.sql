-- Create RLS policies for the 10 tables that now have RLS enabled but no policies

-- 1. timeline_events - doctors can see their patients' timeline events
CREATE POLICY "doctors_view_patient_timeline" ON public.timeline_events
    FOR SELECT
    USING (
        patient_id IN (
            SELECT patient_id 
            FROM public.doctor_patients 
            WHERE doctor_id = (SELECT auth.uid())
        )
    );

-- 2. risk_snapshots - doctors can see their patients' risk snapshots
CREATE POLICY "doctors_view_patient_risk_snapshots" ON public.risk_snapshots
    FOR SELECT
    USING (
        patient_id IN (
            SELECT patient_id 
            FROM public.doctor_patients 
            WHERE doctor_id = (SELECT auth.uid())
        )
    );

-- 3. ai_insights - doctors can see their patients' AI insights
CREATE POLICY "doctors_view_patient_ai_insights" ON public.ai_insights
    FOR SELECT
    USING (
        patient_id IN (
            SELECT patient_id 
            FROM public.doctor_patients 
            WHERE doctor_id = (SELECT auth.uid())
        )
    );

-- 4. analyses - doctors can see their patients' analyses
CREATE POLICY "doctors_view_patient_analyses" ON public.analyses
    FOR SELECT
    USING (
        patient_id IN (
            SELECT patient_id 
            FROM public.doctor_patients 
            WHERE doctor_id = (SELECT auth.uid())
        )
    );

-- 5. clinical_rules - all authenticated users can view clinical rules
CREATE POLICY "authenticated_view_clinical_rules" ON public.clinical_rules
    FOR SELECT
    USING ((SELECT auth.uid()) IS NOT NULL);

-- 6. audit_logs - users can view their own audit logs
CREATE POLICY "users_view_own_audit_logs" ON public.audit_logs
    FOR SELECT
    USING (user_id = (SELECT auth.uid()));

-- 7. alerts - doctors can see their patients' alerts
CREATE POLICY "doctors_view_patient_alerts" ON public.alerts
    FOR SELECT
    USING (
        patient_id IN (
            SELECT patient_id 
            FROM public.doctor_patients 
            WHERE doctor_id = (SELECT auth.uid())
        )
    );

-- 8. advice - doctors can see advice for their patients' analyses
CREATE POLICY "doctors_view_patient_advice" ON public.advice
    FOR SELECT
    USING (
        analysis_id IN (
            SELECT a.id 
            FROM public.analyses a
            WHERE a.patient_id IN (
                SELECT patient_id 
                FROM public.doctor_patients 
                WHERE doctor_id = (SELECT auth.uid())
            )
        )
    );

-- 9. patient_alerts - doctors can see their patients' alerts
CREATE POLICY "doctors_view_patients_alerts" ON public.patient_alerts
    FOR SELECT
    USING (
        patient_id IN (
            SELECT patient_id 
            FROM public.doctor_patients 
            WHERE doctor_id = (SELECT auth.uid())
        )
    );

-- 10. drug_changes - doctors can see drug changes for their patients' advice
CREATE POLICY "doctors_view_patient_drug_changes" ON public.drug_changes
    FOR SELECT
    USING (
        advice_id IN (
            SELECT adv.id 
            FROM public.advice adv
            JOIN public.analyses a ON a.id = adv.analysis_id
            WHERE a.patient_id IN (
                SELECT patient_id 
                FROM public.doctor_patients 
                WHERE doctor_id = (SELECT auth.uid())
            )
        )
    );