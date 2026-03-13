import { supabase } from "@/integrations/supabase/client";

export interface RecalculationResult {
  success: boolean;
  algorithm_version?: string;
  patients_processed?: number;
  snapshots_created?: number;
  alerts_generated?: number;
  has_more?: boolean;
  next_offset?: number | null;
  error?: string;
}

/**
 * Trigger historical risk recalculation for a single patient or a batch.
 * For all patients, uses pagination (batch_size=20) to prevent timeouts.
 */
export async function triggerRiskRecalculation(
  patientId?: string,
  offset?: number,
  limit?: number
): Promise<RecalculationResult> {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const { data: { session } } = await supabase.auth.getSession();

  const body: Record<string, any> = {};
  if (patientId) body.patient_id = patientId;
  if (offset != null) body.offset = offset;
  if (limit != null) body.limit = limit;

  const res = await fetch(
    `https://${projectId}.supabase.co/functions/v1/recalculate-risk`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token ?? anonKey}`,
        apikey: anonKey,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Recalculation failed: ${text}`);
  }

  return res.json();
}

/**
 * Recalculate all patients in batches of 20.
 * Calls recalculate-risk repeatedly until all patients are processed.
 */
export async function triggerFullRecalculation(
  onProgress?: (processed: number, total: number) => void
): Promise<{ totalProcessed: number; totalSnapshots: number; totalAlerts: number }> {
  let offset = 0;
  const batchSize = 20;
  let totalProcessed = 0;
  let totalSnapshots = 0;
  let totalAlerts = 0;
  let hasMore = true;

  while (hasMore) {
    const result = await triggerRiskRecalculation(undefined, offset, batchSize);
    totalProcessed += result.patients_processed ?? 0;
    totalSnapshots += result.snapshots_created ?? 0;
    totalAlerts += result.alerts_generated ?? 0;
    hasMore = result.has_more ?? false;
    offset = result.next_offset ?? offset + batchSize;

    onProgress?.(totalProcessed, totalProcessed + (hasMore ? batchSize : 0));
  }

  return { totalProcessed, totalSnapshots, totalAlerts };
}
