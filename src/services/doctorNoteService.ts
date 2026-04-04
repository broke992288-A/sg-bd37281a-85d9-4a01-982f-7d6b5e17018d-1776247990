import { supabase } from "@/integrations/supabase/client";

export interface DoctorNote {
  id: string;
  patient_id: string;
  doctor_id: string;
  assessment: string | null;
  plan: string | null;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchDoctorNotes(patientId: string, limit?: number): Promise<DoctorNote[]> {
  let query = supabase
    .from("doctor_notes")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as DoctorNote[];
}

export async function insertDoctorNote(note: {
  patient_id: string;
  doctor_id: string;
  assessment?: string;
  plan?: string;
  follow_up_date?: string | null;
}): Promise<DoctorNote> {
  const { data, error } = await supabase
    .from("doctor_notes")
    .insert(note)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as DoctorNote;
}

export async function deleteDoctorNote(noteId: string): Promise<void> {
  const { error } = await supabase
    .from("doctor_notes")
    .delete()
    .eq("id", noteId);
  if (error) throw error;
}
