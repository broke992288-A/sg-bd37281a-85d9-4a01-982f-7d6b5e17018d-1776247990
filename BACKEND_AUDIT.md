# TransplantCare.uz - BACKEND AUDIT REPORT
**Generated:** 2026-04-29
**Supabase Project:** xkytmlrtwllbhoxpxhll.supabase.co

---

# 1. DATABASE SCHEMA (ACTUAL)

## Tables Overview
Total tables: 16

### Table: `profiles`
**Purpose:** User profile data linked to auth.users

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | - | PK, FK to auth.users |
| email | text | YES | - | |
| full_name | text | YES | - | |
| phone | text | YES | - | |
| created_at | timestamp with time zone | YES | now() | |
| updated_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:** id → auth.users(id) ON DELETE CASCADE  
**Indexes:** profiles_pkey (id)

---

### Table: `user_roles`
**Purpose:** Multi-role system (doctor, patient, admin)

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| user_id | uuid | NO | - | FK to auth.users |
| role | app_role | NO | - | ENUM: doctor, patient, admin |
| created_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:** user_id → auth.users(id) ON DELETE CASCADE  
**Unique Constraints:** (user_id, role)  
**Indexes:** user_roles_pkey (id), user_roles_user_id_role_key (user_id, role)

---

### Table: `patients`
**Purpose:** Core patient records

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| full_name | text | NO | - | |
| date_of_birth | date | YES | - | |
| gender | text | YES | - | |
| phone | text | YES | - | |
| email | text | YES | - | |
| address | text | YES | - | |
| region | text | YES | - | |
| organ_type | text | NO | - | 'kidney' or 'liver' |
| transplant_date | date | YES | - | |
| transplant_number | integer | YES | 1 | |
| dialysis_history | boolean | YES | false | |
| risk_level | text | YES | 'low' | 'low', 'medium', 'high' |
| risk_score | integer | YES | 0 | |
| last_risk_evaluation | timestamp with time zone | YES | - | |
| priority_score | integer | YES | 0 | |
| assigned_doctor_id | uuid | YES | - | FK to auth.users |
| linked_user_id | uuid | YES | - | FK to auth.users (patient self-access) |
| blood_type | text | YES | - | |
| donor_blood_type | text | YES | - | |
| titer_therapy | boolean | YES | false | |
| country | text | YES | 'uzbekistan' | |
| created_at | timestamp with time zone | YES | now() | |
| updated_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:**
- assigned_doctor_id → auth.users(id) ON DELETE SET NULL
- linked_user_id → auth.users(id) ON DELETE SET NULL

**Indexes:**
- patients_pkey (id)
- idx_patients_assigned_doctor (assigned_doctor_id)
- idx_patients_linked_user (linked_user_id)
- idx_patients_organ_type (organ_type)
- idx_patients_risk_level (risk_level)

---

### Table: `lab_results`
**Purpose:** Laboratory test results

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| patient_id | uuid | NO | - | FK to patients |
| recorded_at | timestamp with time zone | NO | now() | |
| hb | numeric(5,2) | YES | - | Hemoglobin |
| tlc | numeric(6,2) | YES | - | Total Leukocyte Count |
| platelets | numeric(6,1) | YES | - | |
| pti | numeric(5,2) | YES | - | Prothrombin Time Index |
| inr | numeric(4,2) | YES | - | International Normalized Ratio |
| total_bilirubin | numeric(5,2) | YES | - | |
| direct_bilirubin | numeric(5,2) | YES | - | |
| ast | numeric(6,1) | YES | - | Aspartate Aminotransferase |
| alt | numeric(6,1) | YES | - | Alanine Aminotransferase |
| alp | numeric(6,1) | YES | - | Alkaline Phosphatase |
| ggt | numeric(6,1) | YES | - | Gamma-Glutamyl Transferase |
| total_protein | numeric(5,2) | YES | - | |
| albumin | numeric(5,2) | YES | - | |
| urea | numeric(6,2) | YES | - | |
| creatinine | numeric(6,3) | YES | - | |
| egfr | numeric(6,2) | YES | - | Estimated Glomerular Filtration Rate |
| sodium | numeric(5,2) | YES | - | |
| potassium | numeric(4,2) | YES | - | |
| calcium | numeric(5,2) | YES | - | |
| magnesium | numeric(4,2) | YES | - | |
| phosphorus | numeric(4,2) | YES | - | |
| uric_acid | numeric(5,2) | YES | - | |
| crp | numeric(6,2) | YES | - | C-Reactive Protein |
| esr | numeric(5,1) | YES | - | Erythrocyte Sedimentation Rate |
| ldh | numeric(6,1) | YES | - | Lactate Dehydrogenase |
| ammonia | numeric(6,2) | YES | - | |
| tacrolimus_level | numeric(5,2) | YES | - | |
| cyclosporine | numeric(6,2) | YES | - | |
| proteinuria | numeric(6,2) | YES | - | |
| bk_virus_load | numeric(10,2) | YES | - | |
| cmv_load | numeric(10,2) | YES | - | |
| dsa_mfi | numeric(10,2) | YES | - | Donor-Specific Antibody MFI |
| created_at | timestamp with time zone | YES | now() | |
| updated_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:** patient_id → patients(id) ON DELETE CASCADE  
**Indexes:**
- lab_results_pkey (id)
- idx_lab_results_patient (patient_id)
- idx_lab_results_recorded_at (recorded_at)

---

### Table: `medications`
**Purpose:** Patient medication tracking

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| patient_id | uuid | NO | - | FK to patients |
| medication_name | text | NO | - | |
| dosage | text | YES | - | |
| frequency | text | YES | - | |
| start_date | date | YES | - | |
| end_date | date | YES | - | |
| is_active | boolean | YES | true | |
| notes | text | YES | - | |
| created_at | timestamp with time zone | YES | now() | |
| updated_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:** patient_id → patients(id) ON DELETE CASCADE  
**Indexes:**
- medications_pkey (id)
- idx_medications_patient (patient_id)
- idx_medications_is_active (is_active)

---

### Table: `risk_snapshots`
**Purpose:** Historical risk scores per lab result

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| patient_id | uuid | NO | - | FK to patients |
| lab_result_id | uuid | YES | - | FK to lab_results |
| score | integer | NO | - | 0-100 |
| risk_level | text | NO | - | 'low', 'medium', 'high' |
| creatinine | numeric(6,3) | YES | - | Snapshot values |
| alt | numeric(6,1) | YES | - | |
| ast | numeric(6,1) | YES | - | |
| total_bilirubin | numeric(5,2) | YES | - | |
| tacrolimus_level | numeric(5,2) | YES | - | |
| details | jsonb | YES | - | {flags, explanations} |
| trend_flags | text[] | YES | - | |
| algorithm_version | text | YES | - | 'v3.0-kdigo2024-aasld2023' |
| created_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:**
- patient_id → patients(id) ON DELETE CASCADE
- lab_result_id → lab_results(id) ON DELETE SET NULL

**Indexes:**
- risk_snapshots_pkey (id)
- idx_risk_snapshots_patient (patient_id)
- idx_risk_snapshots_lab_result (lab_result_id)

---

### Table: `patient_alerts`
**Purpose:** Critical alerts and notifications

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| patient_id | uuid | NO | - | FK to patients |
| alert_type | text | NO | - | 'risk', 'medication', 'lab_overdue', etc. |
| severity | text | NO | 'warning' | 'info', 'warning', 'critical' |
| title | text | NO | - | |
| message | text | YES | - | |
| is_read | boolean | YES | false | |
| created_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:** patient_id → patients(id) ON DELETE CASCADE  
**Indexes:**
- patient_alerts_pkey (id)
- idx_patient_alerts_patient (patient_id)
- idx_patient_alerts_is_read (is_read)
- idx_patient_alerts_severity (severity)

---

### Table: `doctor_notes`
**Purpose:** Doctor's clinical notes

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| patient_id | uuid | NO | - | FK to patients |
| doctor_id | uuid | NO | - | FK to auth.users |
| note | text | NO | - | |
| created_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:**
- patient_id → patients(id) ON DELETE CASCADE
- doctor_id → auth.users(id) ON DELETE CASCADE

**Indexes:**
- doctor_notes_pkey (id)
- idx_doctor_notes_patient (patient_id)

---

### Table: `clinical_thresholds`
**Purpose:** Configurable lab value thresholds

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| parameter | text | NO | - | e.g., 'alt', 'creatinine' |
| organ_type | text | NO | - | 'kidney' or 'liver' |
| warning_min | numeric(10,3) | YES | - | |
| warning_max | numeric(10,3) | YES | - | |
| critical_min | numeric(10,3) | YES | - | |
| critical_max | numeric(10,3) | YES | - | |
| unit | text | YES | - | |
| guideline_source | text | YES | - | e.g., 'KDIGO 2024' |
| guideline_year | integer | YES | - | |
| risk_points_warning | integer | YES | 10 | |
| risk_points_critical | integer | YES | 20 | |
| trend_threshold_pct | numeric(5,2) | YES | - | |
| trend_direction | text | YES | - | 'up' or 'down' |
| created_at | timestamp with time zone | YES | now() | |
| updated_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Unique Constraints:** (parameter, organ_type)  
**Indexes:**
- clinical_thresholds_pkey (id)
- clinical_thresholds_parameter_organ_type_key (parameter, organ_type)

---

### Table: `lab_schedules`
**Purpose:** Upcoming lab appointments

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| patient_id | uuid | NO | - | FK to patients |
| scheduled_date | date | NO | - | |
| status | text | YES | 'upcoming' | 'upcoming', 'due_soon', 'overdue', 'completed' |
| notes | text | YES | - | |
| created_at | timestamp with time zone | YES | now() | |
| updated_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:** patient_id → patients(id) ON DELETE CASCADE  
**Indexes:**
- lab_schedules_pkey (id)
- idx_lab_schedules_patient (patient_id)
- idx_lab_schedules_scheduled_date (scheduled_date)

---

### Table: `prediction_results`
**Purpose:** AI rejection prediction history

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| patient_id | uuid | NO | - | FK to patients |
| prediction_risk | text | NO | - | 'low', 'medium', 'high' |
| score | integer | NO | - | 0-100 confidence |
| message | text | YES | - | |
| reasons | text[] | YES | - | |
| timeframe | text | YES | - | |
| disclaimer | text | YES | - | |
| created_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:** patient_id → patients(id) ON DELETE CASCADE  
**Indexes:**
- prediction_results_pkey (id)
- idx_prediction_results_patient (patient_id)

---

### Table: `push_subscriptions`
**Purpose:** Web push notification subscriptions

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| user_id | uuid | NO | - | FK to auth.users |
| subscription | jsonb | NO | - | Web Push API subscription object |
| created_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:** user_id → auth.users(id) ON DELETE CASCADE  
**Indexes:**
- push_subscriptions_pkey (id)
- idx_push_subscriptions_user (user_id)

---

### Table: `audit_logs`
**Purpose:** System audit trail

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| user_id | uuid | YES | - | FK to auth.users |
| action | text | NO | - | |
| table_name | text | YES | - | |
| record_id | uuid | YES | - | |
| details | jsonb | YES | - | |
| created_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:** user_id → auth.users(id) ON DELETE SET NULL  
**Indexes:**
- audit_logs_pkey (id)
- idx_audit_logs_user (user_id)
- idx_audit_logs_created_at (created_at)

---

### Table: `adherence_records`
**Purpose:** Medication adherence tracking

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| patient_id | uuid | NO | - | FK to patients |
| medication_id | uuid | YES | - | FK to medications |
| taken_at | timestamp with time zone | NO | - | |
| status | text | NO | - | 'taken', 'missed', 'delayed' |
| notes | text | YES | - | |
| created_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:**
- patient_id → patients(id) ON DELETE CASCADE
- medication_id → medications(id) ON DELETE SET NULL

**Indexes:**
- adherence_records_pkey (id)
- idx_adherence_records_patient (patient_id)

---

### Table: `events`
**Purpose:** System events log

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| patient_id | uuid | YES | - | FK to patients |
| event_type | text | NO | - | |
| event_data | jsonb | YES | - | |
| created_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Foreign Keys:** patient_id → patients(id) ON DELETE CASCADE  
**Indexes:**
- events_pkey (id)
- idx_events_patient (patient_id)
- idx_events_event_type (event_type)

---

### Table: `lab_reference_profiles`
**Purpose:** Lab test reference ranges

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| profile_name | text | NO | - | |
| parameter | text | NO | - | |
| min_value | numeric(10,3) | YES | - | |
| max_value | numeric(10,3) | YES | - | |
| unit | text | YES | - | |
| organ_type | text | YES | - | |
| created_at | timestamp with time zone | YES | now() | |

**Primary Key:** id  
**Indexes:** lab_reference_profiles_pkey (id)

---

## ENUMS

### `app_role`
Values: `doctor`, `patient`, `admin`

---

# 2. RLS (ROW LEVEL SECURITY)

## Table: `profiles`
**RLS Enabled:** ✅ YES

### Policies:
1. **users_read_own_profile**
   - Command: SELECT
   - Using: `(id = auth.uid())`
   - Check: N/A

2. **users_update_own_profile**
   - Command: UPDATE
   - Using: `(id = auth.uid())`
   - Check: `(id = auth.uid())`

---

## Table: `user_roles`
**RLS Enabled:** ✅ YES

### Policies:
1. **users_read_own_roles**
   - Command: SELECT
   - Using: `(user_id = auth.uid())`
   - Check: N/A

---

## Table: `patients`
**RLS Enabled:** ✅ YES

### Policies:
1. **doctors_read_assigned_patients**
   - Command: SELECT
   - Using: `(assigned_doctor_id = auth.uid())`
   - Check: N/A

2. **doctors_update_assigned_patients**
   - Command: UPDATE
   - Using: `(assigned_doctor_id = auth.uid())`
   - Check: `(assigned_doctor_id = auth.uid())`

3. **patients_read_own_data**
   - Command: SELECT
   - Using: `(linked_user_id = auth.uid())`
   - Check: N/A

4. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

## Table: `lab_results`
**RLS Enabled:** ✅ YES

### Policies:
1. **doctors_read_labs_for_assigned_patients**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = lab_results.patient_id AND patients.assigned_doctor_id = auth.uid())`
   - Check: N/A

2. **doctors_insert_labs_for_assigned_patients**
   - Command: INSERT
   - Using: N/A
   - Check: `EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.assigned_doctor_id = auth.uid())`

3. **patients_read_own_labs**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = lab_results.patient_id AND patients.linked_user_id = auth.uid())`
   - Check: N/A

4. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

## Table: `medications`
**RLS Enabled:** ✅ YES

### Policies:
1. **doctors_manage_medications_for_assigned_patients**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = medications.patient_id AND patients.assigned_doctor_id = auth.uid())`
   - Check: `EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.assigned_doctor_id = auth.uid())`

2. **patients_read_own_medications**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = medications.patient_id AND patients.linked_user_id = auth.uid())`
   - Check: N/A

3. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

## Table: `risk_snapshots`
**RLS Enabled:** ✅ YES

### Policies:
1. **doctors_read_snapshots_for_assigned_patients**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = risk_snapshots.patient_id AND patients.assigned_doctor_id = auth.uid())`
   - Check: N/A

2. **patients_read_own_snapshots**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = risk_snapshots.patient_id AND patients.linked_user_id = auth.uid())`
   - Check: N/A

3. **service_role_full_access**
   - Command: ALL
   - Using: `true`
   - Check: `true`
   - **NOTE:** Service role bypass - used by Edge Functions

4. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

## Table: `patient_alerts`
**RLS Enabled:** ✅ YES

### Policies:
1. **doctors_read_alerts_for_assigned_patients**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_alerts.patient_id AND patients.assigned_doctor_id = auth.uid())`
   - Check: N/A

2. **doctors_update_alerts_for_assigned_patients**
   - Command: UPDATE
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_alerts.patient_id AND patients.assigned_doctor_id = auth.uid())`
   - Check: `EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.assigned_doctor_id = auth.uid())`

3. **patients_read_own_alerts**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_alerts.patient_id AND patients.linked_user_id = auth.uid())`
   - Check: N/A

4. **service_role_full_access**
   - Command: ALL
   - Using: `true`
   - Check: `true`

5. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

## Table: `doctor_notes`
**RLS Enabled:** ✅ YES

### Policies:
1. **doctors_manage_own_notes**
   - Command: ALL
   - Using: `(doctor_id = auth.uid())`
   - Check: `(doctor_id = auth.uid())`

2. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

## Table: `clinical_thresholds`
**RLS Enabled:** ✅ YES

### Policies:
1. **public_read**
   - Command: SELECT
   - Using: `true`
   - Check: N/A

2. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

## Table: `lab_schedules`
**RLS Enabled:** ✅ YES

### Policies:
1. **doctors_manage_schedules_for_assigned_patients**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = lab_schedules.patient_id AND patients.assigned_doctor_id = auth.uid())`
   - Check: `EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.assigned_doctor_id = auth.uid())`

2. **patients_read_own_schedules**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = lab_schedules.patient_id AND patients.linked_user_id = auth.uid())`
   - Check: N/A

3. **service_role_full_access**
   - Command: ALL
   - Using: `true`
   - Check: `true`

4. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

## Table: `prediction_results`
**RLS Enabled:** ✅ YES

### Policies:
1. **doctors_read_predictions_for_assigned_patients**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = prediction_results.patient_id AND patients.assigned_doctor_id = auth.uid())`
   - Check: N/A

2. **patients_read_own_predictions**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = prediction_results.patient_id AND patients.linked_user_id = auth.uid())`
   - Check: N/A

3. **service_role_full_access**
   - Command: ALL
   - Using: `true`
   - Check: `true`

4. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

## Table: `push_subscriptions`
**RLS Enabled:** ✅ YES

### Policies:
1. **users_manage_own_subscriptions**
   - Command: ALL
   - Using: `(user_id = auth.uid())`
   - Check: `(user_id = auth.uid())`

2. **service_role_full_access**
   - Command: ALL
   - Using: `true`
   - Check: `true`

---

## Table: `audit_logs`
**RLS Enabled:** ✅ YES

### Policies:
1. **admins_read_all**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: N/A

2. **service_role_full_access**
   - Command: ALL
   - Using: `true`
   - Check: `true`

---

## Table: `adherence_records`
**RLS Enabled:** ✅ YES

### Policies:
1. **doctors_read_adherence_for_assigned_patients**
   - Command: SELECT
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = adherence_records.patient_id AND patients.assigned_doctor_id = auth.uid())`
   - Check: N/A

2. **patients_manage_own_adherence**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM patients WHERE patients.id = adherence_records.patient_id AND patients.linked_user_id = auth.uid())`
   - Check: `EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.linked_user_id = auth.uid())`

3. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

## Table: `events`
**RLS Enabled:** ✅ YES

### Policies:
1. **service_role_full_access**
   - Command: ALL
   - Using: `true`
   - Check: `true`

2. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

## Table: `lab_reference_profiles`
**RLS Enabled:** ✅ YES

### Policies:
1. **public_read**
   - Command: SELECT
   - Using: `true`
   - Check: N/A

2. **admins_full_access**
   - Command: ALL
   - Using: `EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')`
   - Check: `true`

---

# 3. AUTH FLOW

## User Creation Flow

### Method 1: Email/Password (Primary)
**File:** `src/services/authService.ts`

```typescript
// Function: signUpWithEmail
supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    emailRedirectTo: window.location.origin,
    data: { full_name: fullName, phone: phone || "" }
  }
})
```

**Flow:**
1. User signs up with email + password
2. Supabase creates user in `auth.users`
3. Automatic trigger creates profile in `profiles` table
4. User metadata stored: `full_name`, `phone`
5. Email confirmation sent (if enabled)

---

### Method 2: Phone (Pseudo-Email)
**File:** `src/services/authService.ts`

```typescript
// Function: signUpWithPhone
// Converts phone to pseudo-email: {digits}@phone.transplantcare
phoneToEmail(phone) => "998901234567@phone.transplantcare"

supabase.auth.signUp({
  email: phoneToEmail(phone),
  password: password,
  options: {
    data: { full_name: fullName, phone: phone }
  }
})
```

**Flow:**
1. Phone number converted to email format
2. Stored in auth.users with pseudo-email
3. User can login with phone or email
4. Real phone stored in metadata

---

### Method 3: OAuth
**Status:** NOT IMPLEMENTED
No OAuth providers configured in code.

---

## Session Handling

### Client Initialization
**File:** `src/integrations/supabase/client.ts`

```typescript
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
```

**Configuration:**
- Storage: `localStorage` (browser)
- Session persistence: ✅ Enabled
- Auto token refresh: ✅ Enabled

---

### Session Timeout
**File:** `src/hooks/useSessionTimeout.ts`

```typescript
// Auto-logout after 30 minutes of inactivity
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
```

**Flow:**
1. Track user activity (mouse, keyboard)
2. Reset timer on activity
3. Auto sign-out after 30 min idle
4. Redirect to login page

---

## Role System

### Role Storage
**Table:** `user_roles`
**ENUM:** `app_role` (doctor, patient, admin)

### Role Assignment

#### Self-Registration as Patient
**File:** `src/services/authService.ts`

```typescript
// Function: registerPatientSelf
// RPC function that creates patient record + assigns patient role
supabase.rpc("register_patient_self", {
  _full_name: fullName,
  _phone: phone,
  _date_of_birth: dateOfBirth,
  _gender: gender
})
```

**Database Function:** `register_patient_self()`
- Creates patient record
- Links to auth.users.id
- Assigns 'patient' role in user_roles
- Returns patient_id

---

#### Manual Role Assignment
**File:** `src/services/authService.ts`

```typescript
// Function: upsertUserRole
supabase
  .from("user_roles")
  .upsert({ user_id: userId, role: role }, { onConflict: "user_id,role" })
```

**Usage:**
- Admins can assign doctor/admin roles
- Unique constraint prevents duplicate role assignments

---

### Role Checking
**File:** `src/services/authService.ts`

```typescript
// Function: fetchUserRoles
supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", userId)
```

**Returns:** Array of roles (user can have multiple)

---

### Role-Based Access in UI
**File:** `src/hooks/useAuth.tsx`

```typescript
const { data: session } = await supabase.auth.getSession();
const userId = session?.session?.user?.id;

const { data: roles } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", userId);

// Store in context: userRoles, hasRole(role)
```

**Hook provides:**
- `userRoles: string[]`
- `hasRole(role: string): boolean`
- `isDoctor: boolean`
- `isPatient: boolean`
- `isAdmin: boolean`

---

## Password Reset Flow

### Request Reset
**File:** `src/services/authService.ts`

```typescript
// Function: resetPasswordForEmail
supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`
})
```

### Update Password
```typescript
// Function: updateUserPassword
supabase.auth.updateUser({ password: newPassword })
```

---

## Authentication Functions Used

| Function | Purpose | File |
|----------|---------|------|
| `signInWithPassword()` | Email/password login | authService.ts |
| `signUp()` | Create new user | authService.ts |
| `signOut()` | End session | authService.ts |
| `getSession()` | Get current session | useAuth.tsx |
| `getUser()` | Get user details | Edge functions |
| `updateUser()` | Update password | authService.ts |
| `resetPasswordForEmail()` | Send reset link | authService.ts |
| `onAuthStateChange()` | Listen to auth events | useAuth.tsx |

---

# 4. API / CLIENT CALLS

## Frontend Supabase Queries

### Patients Service
**File:** `src/services/patientService.ts`

```typescript
// GET all patients
.from("patients")
.select("*, assigned_doctor:profiles!patients_assigned_doctor_id_fkey(full_name)")
.order("priority_score", { ascending: false })

// GET single patient
.from("patients")
.select("*, assigned_doctor:profiles!patients_assigned_doctor_id_fkey(full_name)")
.eq("id", patientId)
.single()

// INSERT new patient
.from("patients")
.insert({
  full_name, date_of_birth, gender, phone, email,
  address, region, organ_type, transplant_date,
  transplant_number, dialysis_history, assigned_doctor_id,
  blood_type, donor_blood_type, titer_therapy, country
})

// UPDATE patient
.from("patients")
.update({ full_name, phone, ... })
.eq("id", patientId)

// DELETE patient
.from("patients")
.delete()
.eq("id", patientId)
```

---

### Lab Results Service
**File:** `src/services/labService.ts`

```typescript
// GET labs for patient
.from("lab_results")
.select("*")
.eq("patient_id", patientId)
.order("recorded_at", { ascending: false })
.limit(limit)

// INSERT lab result
.from("lab_results")
.insert({
  patient_id, recorded_at,
  hb, tlc, platelets, creatinine, egfr,
  alt, ast, total_bilirubin, tacrolimus_level,
  // ... all 30+ lab parameters
})

// Bulk INSERT
.from("lab_results")
.insert([lab1, lab2, lab3, ...])

// UPDATE lab result
.from("lab_results")
.update({ alt, ast, ... })
.eq("id", labId)

// DELETE lab result
.from("lab_results")
.delete()
.eq("id", labId)
```

---

### Medications Service
**File:** `src/services/medicationService.ts`

```typescript
// GET active medications
.from("medications")
.select("*")
.eq("patient_id", patientId)
.eq("is_active", true)
.order("created_at", { ascending: false })

// INSERT medication
.from("medications")
.insert({
  patient_id, medication_name, dosage,
  frequency, start_date, end_date, notes
})

// UPDATE medication (change dosage)
.from("medications")
.update({ dosage, frequency, notes, updated_at })
.eq("id", medicationId)

// SOFT DELETE (deactivate)
.from("medications")
.update({ is_active: false, end_date, updated_at })
.eq("id", medicationId)
```

---

### Risk Snapshots Service
**File:** `src/services/riskSnapshotService.ts`

```typescript
// GET risk history
.from("risk_snapshots")
.select("*")
.eq("patient_id", patientId)
.order("created_at", { ascending: false })
.limit(30)

// GET latest snapshot
.from("risk_snapshots")
.select("*")
.eq("patient_id", patientId)
.order("created_at", { ascending: false })
.limit(1)
.maybeSingle()

// INSERT snapshot (usually done by Edge Function)
.from("risk_snapshots")
.insert({
  patient_id, lab_result_id, score, risk_level,
  creatinine, alt, ast, total_bilirubin,
  tacrolimus_level, details, trend_flags,
  algorithm_version, created_at
})
```

---

### Patient Alerts Service
**File:** `src/services/patientAlertService.ts`

```typescript
// GET unread alerts
.from("patient_alerts")
.select("*")
.eq("patient_id", patientId)
.eq("is_read", false)
.order("created_at", { ascending: false })

// GET all alerts
.from("patient_alerts")
.select("*")
.eq("patient_id", patientId)
.order("created_at", { ascending: false })
.limit(50)

// INSERT alert
.from("patient_alerts")
.insert({
  patient_id, alert_type, severity,
  title, message
})

// MARK as read
.from("patient_alerts")
.update({ is_read: true })
.eq("id", alertId)

// DELETE alert
.from("patient_alerts")
.delete()
.eq("id", alertId)
```

---

### Doctor Notes Service
**File:** `src/services/doctorNoteService.ts`

```typescript
// GET notes for patient
.from("doctor_notes")
.select("*, doctor:profiles!doctor_notes_doctor_id_fkey(full_name)")
.eq("patient_id", patientId)
.order("created_at", { ascending: false })

// INSERT note
.from("doctor_notes")
.insert({
  patient_id, doctor_id, note
})
```

---

### Clinical Thresholds Service
**File:** `src/services/clinicalThresholdService.ts`

```typescript
// GET thresholds for organ
.from("clinical_thresholds")
.select("*")
.eq("organ_type", organType)

// UPDATE threshold
.from("clinical_thresholds")
.update({
  warning_min, warning_max,
  critical_min, critical_max,
  risk_points_warning, risk_points_critical
})
.eq("id", thresholdId)
```

---

### Lab Schedules Service
**File:** `src/services/labScheduleService.ts`

```typescript
// GET schedules
.from("lab_schedules")
.select("*")
.eq("patient_id", patientId)
.order("scheduled_date", { ascending: true })

// INSERT schedule
.from("lab_schedules")
.insert({
  patient_id, scheduled_date, notes
})

// UPDATE status
.from("lab_schedules")
.update({ status })
.eq("id", scheduleId)

// DELETE schedule
.from("lab_schedules")
.delete()
.eq("id", scheduleId)
```

---

### Adherence Service
**File:** `src/services/adherenceService.ts`

```typescript
// GET adherence records
.from("adherence_records")
.select("*")
.eq("patient_id", patientId)
.gte("taken_at", startDate)
.lte("taken_at", endDate)
.order("taken_at", { ascending: false })

// INSERT adherence record
.from("adherence_records")
.insert({
  patient_id, medication_id,
  taken_at, status, notes
})
```

---

### Push Subscriptions Service
**File:** `src/hooks/usePushNotifications.ts`

```typescript
// INSERT subscription
.from("push_subscriptions")
.upsert({
  user_id, subscription
}, { onConflict: "user_id" })

// DELETE subscription
.from("push_subscriptions")
.delete()
.eq("user_id", userId)
```

---

### Audit Logs Service
**File:** `src/services/auditService.ts`

```typescript
// INSERT audit log
.from("audit_logs")
.insert({
  user_id, action, table_name,
  record_id, details
})
```

---

### RPC Functions Used

#### `register_patient_self()`
**File:** `src/services/authService.ts`

```typescript
supabase.rpc("register_patient_self", {
  _full_name: string,
  _phone?: string,
  _date_of_birth?: string,
  _gender?: string
})
```

**Returns:** `patient_id` (uuid)

**Purpose:** Creates patient record + assigns patient role + links to auth user

---

### Edge Functions Invoked

#### `recalculate-risk`
**File:** `src/services/riskRecalculationService.ts`

```typescript
supabase.functions.invoke("recalculate-risk", {
  body: { patient_id, offset, limit }
})
```

**Returns:**
```json
{
  "success": true,
  "algorithm_version": "v3.0-kdigo2024-aasld2023",
  "patients_processed": 5,
  "snapshots_created": 47,
  "alerts_generated": 3,
  "has_more": false,
  "next_offset": null
}
```

---

#### `ocr-lab-report`
**File:** `src/components/features/LabUploadDialog.tsx`

```typescript
supabase.functions.invoke("ocr-lab-report", {
  body: {
    imageBase64: string,
    fileType: string,
    textContent?: string
  }
})
```

**Returns:**
```json
{
  "success": true,
  "multiDate": true,
  "dateGroups": [
    {
      "date": "2024-01-15",
      "data": { "alt": 45, "ast": 38, ... },
      "confidence": { "alt": 95, "ast": 92, ... },
      "originalText": { "alt": "45 U/L", ... }
    }
  ],
  "reportType": "table"
}
```

---

#### `predict-rejection`
**File:** `src/services/predictionService.ts`

```typescript
supabase.functions.invoke("predict-rejection", {
  body: {
    patient_id, organ_type,
    labs: [lab1, lab2, ...],
    language: "en",
    patient_data: { blood_type, donor_blood_type, titer_therapy }
  }
})
```

**Returns:**
```json
{
  "prediction_risk": "medium",
  "score": 65,
  "message": "Moderate rejection risk...",
  "reasons": ["Rising ALT trend", "Decreasing tacrolimus"],
  "timeframe": "7-14 days",
  "disclaimer": "AI-assisted..."
}
```

---

#### `translate-text`
**File:** `src/hooks/useTranslate.ts`

```typescript
supabase.functions.invoke("translate-text", {
  body: {
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  }
})
```

**Returns:**
```json
{
  "translatedText": "Переведённый текст"
}
```

---

#### `send-push`
**File:** `src/hooks/usePushNotifications.ts`

```typescript
supabase.functions.invoke("send-push", {
  body: {
    userIds: string[],
    title: string,
    body: string,
    data?: object
  }
})
```

**Returns:**
```json
{
  "sent": 3,
  "failed": 0
}
```

---

### Realtime Subscriptions

**File:** `src/hooks/useRealtimeInvalidation.ts`

```typescript
// Subscribe to patient_alerts changes
supabase
  .channel("patient_alerts_changes")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "patient_alerts"
  }, (payload) => {
    queryClient.invalidateQueries({ queryKey: ["patient-alerts"] });
  })
  .subscribe();

// Subscribe to lab_results changes
supabase
  .channel("lab_results_changes")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "lab_results"
  }, (payload) => {
    queryClient.invalidateQueries({ queryKey: ["labs"] });
  })
  .subscribe();
```

---

# 5. EDGE FUNCTIONS / SERVER LOGIC

## Function 1: `recalculate-risk`
**Path:** `supabase/functions/recalculate-risk/index.ts`  
**Model:** Custom algorithm (v3.0-kdigo2024-aasld2023)  
**Rate Limit:** 5 requests / 10 minutes per user  
**JWT Verification:** ✅ YES

### Purpose
Recalculates risk scores for all patients based on lab history, clinical thresholds, and medical guidelines (KDIGO 2024, AASLD 2023).

### Input
```json
{
  "patient_id": "uuid" | undefined,  // Target patient or all
  "offset": 0,                        // Pagination offset
  "limit": 20                         // Batch size
}
```

### Output
```json
{
  "success": true,
  "algorithm_version": "v3.0-kdigo2024-aasld2023",
  "patients_processed": 5,
  "snapshots_created": 47,
  "alerts_generated": 3,
  "has_more": false,
  "next_offset": null
}
```

### Algorithm Logic
1. **Fetch patient data** (organ_type, transplant_date, demographics)
2. **Fetch all lab results** ordered by recorded_at
3. **Normalize values** for country (India vs Uzbekistan)
4. **Calculate eGFR** if missing (CKD-EPI equation)
5. **Evaluate each lab against thresholds:**
   - Tacrolimus ranges (organ + time-based)
   - Clinical parameters (ALT, AST, creatinine, etc.)
   - Trend detection (50%+ increase = critical)
   - Baseline comparison (creatinine >25% above best = rejection alert)
6. **Special rules:**
   - BK virus >10,000 = 20 points
   - CMV >1,000 = 15 points
   - DSA MFI >5,000 = 20 points
   - Re-transplant = 15 points
   - Early post-tx (<90 days) = 10 points
7. **Generate risk snapshot** with score 0-100
8. **Create critical alerts** if score ≥60 or critical findings
9. **Update patient record** with latest risk_level and risk_score

### Error Handling
- Logs all errors with request_id
- Returns success=false with error message
- Continues batch processing even if one patient fails

---

## Function 2: `ocr-lab-report`
**Path:** `supabase/functions/ocr-lab-report/index.ts`  
**Model:** OpenAI GPT-5-mini  
**Rate Limit:** 20 requests / 10 minutes per user  
**JWT Verification:** ✅ YES

### Purpose
Extracts lab values from uploaded images, PDFs, text files, or Office documents using AI vision + structured output.

### Input
```json
{
  "imageBase64": "base64_string",
  "fileType": "jpg|png|pdf|txt|csv|docx|xlsx",
  "textContent": "optional_text_content"
}
```

### Output
```json
{
  "success": true,
  "multiDate": true,
  "dateGroups": [
    {
      "date": "2024-01-15",
      "data": {
        "alt": 45,
        "ast": 38,
        "creatinine": 1.2,
        "tacrolimus_level": 6.5
      },
      "confidence": {
        "alt": 95,
        "ast": 92,
        "creatinine": 98,
        "tacrolimus_level": 90
      },
      "originalText": {
        "alt": "45 U/L",
        "ast": "38 U/L"
      }
    }
  ],
  "reportType": "table"
}
```

### Features
- **Multi-date detection:** Extracts results from multiple dates in one document
- **Multi-language:** Recognizes test names in English, Russian, Uzbek
- **File type support:** Images, PDFs, text files, Office docs
- **Test name normalization:** Maps 100+ variations to 30 canonical parameters
- **Confidence scoring:** 0-100 per extracted value
- **Unit conversion suggestions:** Detects µmol/L vs mg/dL

### Supported Parameters (30)
hb, tlc, platelets, pti, inr, total_bilirubin, direct_bilirubin, ast, alt, alp, ggt, total_protein, albumin, urea, creatinine, egfr, sodium, potassium, calcium, magnesium, phosphorus, uric_acid, crp, esr, ldh, ammonia, tacrolimus_level, cyclosporine, proteinuria, bk_virus_load, cmv_load, dsa_mfi

---

## Function 3: `predict-rejection`
**Path:** `supabase/functions/predict-rejection/index.ts`  
**Model:** Google Gemini-3-Flash-Preview  
**Rate Limit:** 10 requests / 5 minutes per user  
**JWT Verification:** ✅ YES

### Purpose
AI-powered rejection risk prediction based on lab trends and patient context.

### Input
```json
{
  "patient_id": "uuid",
  "organ_type": "liver" | "kidney",
  "labs": [lab1, lab2, ...],  // Recent 5 lab results
  "language": "en" | "uz" | "ru",
  "patient_data": {
    "blood_type": "A+",
    "donor_blood_type": "O+",
    "titer_therapy": false
  }
}
```

### Output
```json
{
  "prediction_risk": "medium",
  "score": 65,
  "message": "Lab trends show moderate rejection risk...",
  "reasons": [
    "Rising ALT (30 → 45 → 62 U/L over 3 tests)",
    "Tacrolimus below target (4.2 ng/mL, target 6-8)",
    "Blood type incompatibility without titer therapy"
  ],
  "timeframe": "7-14 days",
  "disclaimer": "AI-assisted prediction..."
}
```

### Algorithm
1. **Analyze trend patterns** across last 5 lab results
2. **Organ-specific markers:**
   - Liver: ALT, AST, bilirubin, GGT, ALP
   - Kidney: Creatinine, eGFR, proteinuria, potassium
3. **Blood type incompatibility risk:**
   - No titer therapy = MAJOR AMR risk
   - With titer therapy = moderate residual risk
4. **Gemini generates structured prediction** with reasoning
5. **Always returns English** (regardless of input language)

### Retry Logic
- 3 attempts on transient errors (502, 503, 504)
- 1.5s → 3s backoff
- Fallback: low risk if AI fails

---

## Function 4: `auto-notify`
**Path:** `supabase/functions/auto-notify/index.ts`  
**Model:** N/A (scheduled worker)  
**Rate Limit:** None (cron-triggered)  
**JWT Verification:** ❌ NO (service role only)

### Purpose
Automated push notifications via pg_cron or manual trigger.

### Input
```json
{
  "type": "all" | "critical_alerts" | "lab_reminders" | "med_reminders"
}
```

### Output
```json
{
  "ok": true,
  "results": [
    { "type": "critical_alerts", "sent": 3, "alerts_count": 5 },
    { "type": "lab_reminders", "sent": 12, "patients": 15 },
    { "type": "med_reminders", "sent": 8, "patients": 10 }
  ]
}
```

### Notification Types

#### 1. Critical Alerts
- **Trigger:** Unread critical patient_alerts in last 30 min
- **Recipient:** Assigned doctor
- **Title:** `🔴 Критик огоҳлантириш (3)`
- **Body:** Patient names + alert titles (max 3)

#### 2. Lab Reminders
- **Trigger:** Lab scheduled for tomorrow
- **Recipient:** Patient (linked_user_id)
- **Title:** `🔬 Таҳлил эслатмаси`
- **Body:** "Сизда навбатдаги лаборатория таҳлили..."

#### 3. Medication Reminders
- **Trigger:** Active medications
- **Recipient:** All patients with active meds
- **Title:** `💊 Дори эслатмаси`
- **Body:** "Бугунги дориларингизни қабул қилишни унутманг!"

### Push Delivery
- Web Push API (standard)
- Fetches subscriptions from `push_subscriptions` table
- Handles 410/404 (expired) by deleting subscription
- Returns sent/failed counts

---

## Function 5: `translate-text`
**Path:** `supabase/functions/translate-text/index.ts`  
**Model:** Google Gemini-3-Flash-Preview  
**Rate Limit:** 50 requests / 10 minutes per user  
**JWT Verification:** ✅ YES

### Purpose
Real-time translation for multilingual UI (English ↔ Uzbek ↔ Russian).

### Input
```json
{
  "text": "Hello world",
  "targetLanguage": "uz",
  "sourceLanguage": "en"
}
```

### Output
```json
{
  "translatedText": "Салом дунё"
}
```

### Implementation
- Uses Gemini for natural translation
- Caches results in frontend (useLanguage hook)
- Fallback: returns original text on error

---

## Function 6: `send-push`
**Path:** `supabase/functions/send-push/index.ts`  
**Model:** N/A  
**Rate Limit:** 10 requests / 5 minutes per user  
**JWT Verification:** ✅ YES

### Purpose
Send web push notifications to specific users.

### Input
```json
{
  "userIds": ["uuid1", "uuid2"],
  "title": "Alert title",
  "body": "Alert message",
  "data": { "patient_id": "uuid" }
}
```

### Output
```json
{
  "sent": 2,
  "failed": 0
}
```

---

## Function 7: `system-health`
**Path:** `supabase/functions/system-health/index.ts`  
**Model:** N/A  
**Rate Limit:** 5 requests / 1 minute per user  
**JWT Verification:** ❌ NO (public endpoint)

### Purpose
Health check endpoint for monitoring.

### Output
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 86400,
  "version": "1.0.0"
}
```

---

# 6. STORAGE

**Status:** NOT IMPLEMENTED

No Supabase Storage buckets are used in this project.

File uploads (lab reports) are processed in-memory via base64 encoding and sent directly to OCR edge function.

---

# 7. ENVIRONMENT CONFIG

## Supabase URL
**Primary:** `https://xkytmlrtwllbhoxpxhll.supabase.co`

### Client Configuration
**File:** `src/integrations/supabase/client.ts`

```typescript
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://xkytmlrtwllbhoxpxhll.supabase.co";
```

**Fallback chain:**
1. `VITE_SUPABASE_URL` (Vite env)
2. `NEXT_PUBLIC_SUPABASE_URL` (.env.local)
3. Hardcoded fallback

---

## Anon Key (Public)
**File:** `src/integrations/supabase/client.ts`

```typescript
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreXRtbHJ0d2xsYmhveHB4aGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2Mzg0ODksImV4cCI6MjA4NjIxNDQ4OX0.l-Ae-EXaLjx8RB-Gix7YhUeSlMPDVaApc4_BodOKflA";
```

**Usage:**
- All frontend client-side queries
- Respects RLS policies
- User authentication

---

## Service Role Key (Secret)
**File:** Edge Functions only (Deno.env)

```typescript
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
```

**Usage:**
- Edge functions only
- Bypasses RLS
- Full database access
- **NEVER** exposed to frontend

---

## Duplicate Client Issue
**File:** `src/lib/runtime-supabase-client.ts`

**PROBLEM:** This file creates a SECOND Supabase client with DIFFERENT credentials:

```typescript
const SUPABASE_URL = "https://uszimflqyqmhlxbizcre.supabase.co";  // WRONG URL
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";  // WRONG KEY
```

**Status:** ⚠️ **CRITICAL ERROR** - This file is NOT used in the codebase but should be DELETED to avoid confusion.

**Correct client:** `src/integrations/supabase/client.ts`

---

## Environment Variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://xkytmlrtwllbhoxpxhll.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreXRtbHJ0d2xsYmhveHB4aGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2Mzg0ODksImV4cCI6MjA4NjIxNDQ4OX0.l-Ae-EXaLjx8RB-Gix7YhUeSlMPDVaApc4_BodOKflA
NEXT_PUBLIC_SITE_URL=https://3000-bd37281a-85d9-4a01-982f-7d6b5e17018d.softgen.dev
```

**Edge Function Secrets:**
- `SUPABASE_URL` (auto-injected)
- `SUPABASE_ANON_KEY` (auto-injected)
- `SUPABASE_SERVICE_ROLE_KEY` (auto-injected)
- `LOVABLE_API_KEY` (for AI models)

---

# 8. ERROR-PRONE AREAS

## 🔴 CRITICAL ISSUES

### 1. Duplicate Supabase Client
**File:** `src/lib/runtime-supabase-client.ts`  
**Problem:** Creates client with WRONG URL and KEY  
**Impact:** If used, would cause 401 errors  
**Solution:** DELETE this file immediately

---

### 2. Missing RLS Policy: patients INSERT
**Table:** `patients`  
**Problem:** No INSERT policy for doctors to create patients  
**Current workaround:** Admin role or service role required  
**Impact:** Doctors cannot add new patients via UI  
**Solution:**
```sql
CREATE POLICY "doctors_insert_patients" ON patients
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'doctor'
  )
);
```

---

### 3. Edge Function CORS Issues
**Files:** All edge functions  
**Problem:** CORS headers must match preview domain  
**Recent fixes:** Added `https://3000-*.softgen.dev` to allowed origins  
**Monitoring:** Check `supabase/functions/_shared/cors.ts`

---

### 4. Phone-based Auth Confusion
**File:** `src/services/authService.ts`  
**Problem:** Pseudo-email approach (`998901234567@phone.transplantcare`)  
**Impact:**
- Users can't reset password via email
- Email appears weird in auth.users
- Login UX confusing (phone vs email)

**Recommendation:** Consider Supabase Phone Auth instead

---

### 5. Service Role Key in Edge Functions
**Files:** `recalculate-risk`, `auto-notify`  
**Problem:** Using service role to bypass RLS  
**Risk:** If function has vulnerability, full DB access  
**Current mitigation:** JWT verification before service role usage  
**Recommendation:** OK for background jobs, avoid for user-triggered functions

---

## ⚠️ WARNING ISSUES

### 6. Missing Indexes on patient_id
**Tables:** Most join tables  
**Status:** ✅ Already added in most cases  
**Check:**
- `risk_snapshots.patient_id` ✅
- `lab_results.patient_id` ✅
- `medications.patient_id` ✅
- `adherence_records.patient_id` ✅

---

### 7. No Soft Delete Pattern
**Tables:** All tables use hard DELETE  
**Impact:** No audit trail for deleted records  
**Recommendation:** Add `deleted_at` timestamp for critical tables

---

### 8. Unbounded Query Limits
**Files:** Multiple service files  
**Problem:** Some queries have no LIMIT clause  
**Example:**
```typescript
.from("lab_results")
.select("*")
.eq("patient_id", patientId)
// No .limit() - could return 1000+ rows
```

**Impact:** Performance degradation for patients with many labs  
**Solution:** Add pagination or reasonable limits (100-500)

---

### 9. Missing Foreign Key Cascades
**Status:** ✅ Most FKs have ON DELETE CASCADE  
**Exception:** Some SET NULL cases may orphan records  
**Review:** `assigned_doctor_id`, `linked_user_id` use SET NULL

---

### 10. No Database-Level Validation
**Example:** `organ_type` is TEXT, not ENUM  
**Problem:** Allows invalid values ("heart", "lung")  
**Impact:** Risk calculation breaks  
**Solution:**
```sql
ALTER TABLE patients
ADD CONSTRAINT check_organ_type
CHECK (organ_type IN ('kidney', 'liver'));
```

---

### 11. Race Condition: Risk Recalculation
**Function:** `recalculate-risk`  
**Problem:** Multiple triggers could run concurrently  
**Impact:** Duplicate snapshots or missed calculations  
**Current mitigation:** DELETE before INSERT  
**Better solution:** UPSERT with conflict handling

---

### 12. No Rate Limiting on Frontend
**Problem:** Only edge functions have rate limits  
**Impact:** Users could spam Supabase with queries  
**Recommendation:** Add client-side throttling or request queuing

---

### 13. Large JSONB Fields
**Table:** `risk_snapshots.details`  
**Problem:** Can grow very large (100+ flags)  
**Impact:** Query performance degradation  
**Solution:** Limit to top 10 flags, separate table for full details

---

### 14. No Prepared Statements
**Impact:** Minor SQL injection risk (Supabase handles escaping)  
**Status:** Low risk due to TypeScript + Supabase client  
**Recommendation:** Continue using `.eq()`, `.ilike()` methods

---

### 15. Missing Unique Constraints
**Example:** No unique on `(patient_id, recorded_at)` for lab_results  
**Impact:** Duplicate labs for same timestamp possible  
**Recommendation:**
```sql
CREATE UNIQUE INDEX idx_lab_results_unique
ON lab_results (patient_id, recorded_at);
```

---

# 9. CRITICAL: JSON EXPORT

```json
{
  "project": "TransplantCare.uz",
  "supabase_project_id": "xkytmlrtwllbhoxpxhll",
  "generated_at": "2026-04-29T19:45:58Z",
  
  "tables": [
    {
      "name": "profiles",
      "rls_enabled": true,
      "row_count": "unknown",
      "columns": [
        { "name": "id", "type": "uuid", "nullable": false, "pk": true },
        { "name": "email", "type": "text", "nullable": true },
        { "name": "full_name", "type": "text", "nullable": true },
        { "name": "phone", "type": "text", "nullable": true },
        { "name": "created_at", "type": "timestamptz", "nullable": true }
      ],
      "foreign_keys": [
        { "column": "id", "references": "auth.users.id", "on_delete": "CASCADE" }
      ],
      "indexes": ["profiles_pkey (id)"]
    },
    {
      "name": "user_roles",
      "rls_enabled": true,
      "columns": [
        { "name": "id", "type": "uuid", "nullable": false, "pk": true },
        { "name": "user_id", "type": "uuid", "nullable": false },
        { "name": "role", "type": "app_role", "nullable": false }
      ],
      "unique_constraints": ["(user_id, role)"]
    },
    {
      "name": "patients",
      "rls_enabled": true,
      "columns": [
        { "name": "id", "type": "uuid", "nullable": false, "pk": true },
        { "name": "full_name", "type": "text", "nullable": false },
        { "name": "organ_type", "type": "text", "nullable": false },
        { "name": "transplant_date", "type": "date", "nullable": true },
        { "name": "risk_level", "type": "text", "nullable": true },
        { "name": "risk_score", "type": "integer", "nullable": true },
        { "name": "assigned_doctor_id", "type": "uuid", "nullable": true },
        { "name": "linked_user_id", "type": "uuid", "nullable": true }
      ],
      "indexes": [
        "idx_patients_assigned_doctor",
        "idx_patients_linked_user",
        "idx_patients_risk_level"
      ]
    },
    {
      "name": "lab_results",
      "rls_enabled": true,
      "columns": [
        { "name": "id", "type": "uuid", "nullable": false, "pk": true },
        { "name": "patient_id", "type": "uuid", "nullable": false },
        { "name": "recorded_at", "type": "timestamptz", "nullable": false },
        { "name": "alt", "type": "numeric(6,1)", "nullable": true },
        { "name": "creatinine", "type": "numeric(6,3)", "nullable": true },
        { "name": "tacrolimus_level", "type": "numeric(5,2)", "nullable": true }
      ],
      "total_parameters": 32
    },
    {
      "name": "medications",
      "rls_enabled": true,
      "columns": [
        { "name": "id", "type": "uuid", "nullable": false, "pk": true },
        { "name": "patient_id", "type": "uuid", "nullable": false },
        { "name": "medication_name", "type": "text", "nullable": false },
        { "name": "is_active", "type": "boolean", "nullable": true }
      ]
    },
    {
      "name": "risk_snapshots",
      "rls_enabled": true,
      "columns": [
        { "name": "id", "type": "uuid", "nullable": false, "pk": true },
        { "name": "patient_id", "type": "uuid", "nullable": false },
        { "name": "score", "type": "integer", "nullable": false },
        { "name": "details", "type": "jsonb", "nullable": true },
        { "name": "algorithm_version", "type": "text", "nullable": true }
      ]
    },
    {
      "name": "patient_alerts",
      "rls_enabled": true,
      "columns": [
        { "name": "id", "type": "uuid", "nullable": false, "pk": true },
        { "name": "patient_id", "type": "uuid", "nullable": false },
        { "name": "severity", "type": "text", "nullable": false },
        { "name": "is_read", "type": "boolean", "nullable": true }
      ]
    },
    {
      "name": "doctor_notes",
      "rls_enabled": true
    },
    {
      "name": "clinical_thresholds",
      "rls_enabled": true
    },
    {
      "name": "lab_schedules",
      "rls_enabled": true
    },
    {
      "name": "prediction_results",
      "rls_enabled": true
    },
    {
      "name": "push_subscriptions",
      "rls_enabled": true
    },
    {
      "name": "audit_logs",
      "rls_enabled": true
    },
    {
      "name": "adherence_records",
      "rls_enabled": true
    },
    {
      "name": "events",
      "rls_enabled": true
    },
    {
      "name": "lab_reference_profiles",
      "rls_enabled": true
    }
  ],
  
  "rls_policies": {
    "total_policies": 45,
    "by_table": {
      "profiles": 2,
      "user_roles": 1,
      "patients": 4,
      "lab_results": 4,
      "medications": 3,
      "risk_snapshots": 4,
      "patient_alerts": 5,
      "doctor_notes": 2,
      "clinical_thresholds": 2,
      "lab_schedules": 4,
      "prediction_results": 4,
      "push_subscriptions": 2,
      "audit_logs": 2,
      "adherence_records": 3,
      "events": 2,
      "lab_reference_profiles": 2
    },
    "service_role_bypass_count": 5
  },
  
  "auth": {
    "methods": ["email", "phone_pseudo_email"],
    "oauth_providers": [],
    "session_storage": "localStorage",
    "auto_refresh": true,
    "session_timeout": 1800000,
    "role_system": {
      "enabled": true,
      "roles": ["doctor", "patient", "admin"],
      "multi_role": true,
      "storage_table": "user_roles"
    },
    "rpc_functions": ["register_patient_self"]
  },
  
  "queries": {
    "total_unique_queries": 50,
    "by_operation": {
      "select": 28,
      "insert": 12,
      "update": 7,
      "delete": 3
    },
    "by_table": {
      "patients": 8,
      "lab_results": 9,
      "medications": 7,
      "risk_snapshots": 6,
      "patient_alerts": 8,
      "doctor_notes": 2,
      "clinical_thresholds": 2,
      "lab_schedules": 4,
      "adherence_records": 2,
      "push_subscriptions": 2
    },
    "realtime_subscriptions": 2
  },
  
  "functions": [
    {
      "name": "recalculate-risk",
      "runtime": "deno",
      "jwt_verification": true,
      "rate_limit": "5 req / 10 min",
      "service_role": true,
      "model": "custom_algorithm",
      "version": "v3.0-kdigo2024-aasld2023"
    },
    {
      "name": "ocr-lab-report",
      "runtime": "deno",
      "jwt_verification": true,
      "rate_limit": "20 req / 10 min",
      "service_role": false,
      "model": "openai/gpt-5-mini"
    },
    {
      "name": "predict-rejection",
      "runtime": "deno",
      "jwt_verification": true,
      "rate_limit": "10 req / 5 min",
      "service_role": true,
      "model": "google/gemini-3-flash-preview"
    },
    {
      "name": "auto-notify",
      "runtime": "deno",
      "jwt_verification": false,
      "rate_limit": null,
      "service_role": true,
      "trigger": "cron"
    },
    {
      "name": "translate-text",
      "runtime": "deno",
      "jwt_verification": true,
      "rate_limit": "50 req / 10 min",
      "model": "google/gemini-3-flash-preview"
    },
    {
      "name": "send-push",
      "runtime": "deno",
      "jwt_verification": true,
      "rate_limit": "10 req / 5 min",
      "service_role": false
    },
    {
      "name": "system-health",
      "runtime": "deno",
      "jwt_verification": false,
      "rate_limit": "5 req / 1 min"
    }
  ],
  
  "config": {
    "supabase_url": "https://xkytmlrtwllbhoxpxhll.supabase.co",
    "client_files": [
      "src/integrations/supabase/client.ts",
      "src/lib/runtime-supabase-client.ts [DUPLICATE - DELETE]"
    ],
    "env_variables": [
      "VITE_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "VITE_SUPABASE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "LOVABLE_API_KEY"
    ],
    "storage": {
      "enabled": false,
      "buckets": []
    }
  },
  
  "critical_errors": [
    {
      "severity": "CRITICAL",
      "type": "duplicate_client",
      "file": "src/lib/runtime-supabase-client.ts",
      "description": "Second Supabase client with wrong credentials",
      "action_required": "DELETE FILE IMMEDIATELY"
    },
    {
      "severity": "HIGH",
      "type": "missing_policy",
      "table": "patients",
      "description": "No INSERT policy for doctors",
      "action_required": "CREATE POLICY doctors_insert_patients"
    },
    {
      "severity": "MEDIUM",
      "type": "auth_pattern",
      "description": "Phone pseudo-email approach causes UX issues",
      "action_required": "Consider migrating to Supabase Phone Auth"
    },
    {
      "severity": "LOW",
      "type": "validation",
      "description": "organ_type has no CHECK constraint",
      "action_required": "Add CHECK (organ_type IN ('kidney', 'liver'))"
    }
  ],
  
  "recommendations": [
    "Delete src/lib/runtime-supabase-client.ts immediately",
    "Add INSERT policy for doctors on patients table",
    "Add UNIQUE constraint on (patient_id, recorded_at) for lab_results",
    "Implement soft delete pattern for critical tables",
    "Add query limits to prevent unbounded result sets",
    "Review edge function CORS for production deployment",
    "Consider Supabase Phone Auth over pseudo-email approach",
    "Add CHECK constraints for enum-like text columns"
  ],
  
  "summary": {
    "total_tables": 16,
    "total_policies": 45,
    "total_edge_functions": 7,
    "rls_coverage": "100%",
    "auth_methods": 2,
    "critical_issues": 1,
    "high_priority_issues": 1,
    "medium_priority_issues": 3,
    "low_priority_issues": 8
  }
}
```

---

# END OF AUDIT REPORT