import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export interface Medication {
  id: string;
  patient_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  prescribed_by: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MedicationChange {
  id: string;
  medication_id: string;
  patient_id: string;
  changed_by: string;
  old_dosage: string;
  new_dosage: string;
  old_frequency: string | null;
  new_frequency: string | null;
  reason: string | null;
  created_at: string;
}

export async function fetchPatientMedications(patientId: string) {
  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("patient_id", patientId)
    .order("is_active", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Medication[];
}

export async function insertMedication(med: TablesInsert<"medications">) {
  const { data, error } = await supabase
    .from("medications")
    .insert(med)
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function updateMedication(id: string, updates: TablesUpdate<"medications">) {
  const { error } = await supabase
    .from("medications")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteMedication(id: string) {
  const { error } = await supabase.from("medications").delete().eq("id", id);
  if (error) throw error;
}

export async function insertMedicationChange(change: TablesInsert<"medication_changes">) {
  const { error } = await supabase
    .from("medication_changes")
    .insert(change);
  if (error) throw error;
}

export async function fetchMedicationChanges(patientId: string) {
  const { data, error } = await supabase
    .from("medication_changes")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as MedicationChange[];
}
