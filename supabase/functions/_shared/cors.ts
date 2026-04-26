export function getCorsHeaders(req: Request, methods = "GET, POST, OPTIONS") {
  const origin = req.headers.get("origin") ?? "*";
  
  // Allow Vercel preview domains explicitly
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000", 
    "https://transplantcare.uz",
    "https://sg-0ec15666-4b40-4a28-9a69-6f86d5a2.vercel.app"
  ];
  
  const isAllowed = allowedOrigins.some(allowed => origin.startsWith(allowed)) || 
                    origin.includes("vercel.app") ||
                    origin === "*";
  
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : allowedOrigins[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
}