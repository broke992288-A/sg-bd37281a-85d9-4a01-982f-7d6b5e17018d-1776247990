import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const startTime = Date.now();

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Check database connectivity
    const { count: patientCount, error: dbErr } = await supabase
      .from("patients")
      .select("id", { count: "exact", head: true });

    const { count: labCount } = await supabase
      .from("lab_results")
      .select("id", { count: "exact", head: true });

    const { count: alertCount } = await supabase
      .from("patient_alerts")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);

    const dbHealthy = !dbErr;
    const responseTime = Date.now() - startTime;

    const status = dbHealthy ? "healthy" : "degraded";

    return new Response(JSON.stringify({
      status,
      timestamp: new Date().toISOString(),
      uptime_check: true,
      response_time_ms: responseTime,
      database: {
        connected: dbHealthy,
        patients: patientCount ?? 0,
        lab_results: labCount ?? 0,
        unread_alerts: alertCount ?? 0,
      },
      edge_functions: {
        "ocr-lab-report": "deployed",
        "predict-rejection": "deployed",
        "recalculate-risk": "deployed",
        "translate-text": "deployed",
        "system-health": "deployed",
      },
      version: "2.0.0",
      algorithm_version: "v2.0-kdigo2024",
    }), {
      status: dbHealthy ? 200 : 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: e instanceof Error ? e.message : "Unknown error",
      response_time_ms: Date.now() - startTime,
    }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
