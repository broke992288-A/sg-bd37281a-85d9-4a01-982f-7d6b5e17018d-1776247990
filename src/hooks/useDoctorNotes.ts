import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDoctorNotes, insertDoctorNote, deleteDoctorNote } from "@/services/doctorNoteService";

export function useDoctorNotes(patientId: string | undefined, limit?: number) {
  return useQuery({
    queryKey: ["doctor-notes", patientId, limit],
    queryFn: () => fetchDoctorNotes(patientId!, limit),
    enabled: !!patientId,
  });
}

export function useAddDoctorNote(patientId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: insertDoctorNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-notes", patientId] });
    },
  });
}

export function useDeleteDoctorNote(patientId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDoctorNote,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-notes", patientId] });
    },
  });
}
