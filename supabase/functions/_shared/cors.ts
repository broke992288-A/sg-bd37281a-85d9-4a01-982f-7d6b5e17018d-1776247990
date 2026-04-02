const FALLBACK_ORIGIN = "https://lovable.app";

const ALLOWED_EXACT_ORIGINS = new Set([
  "https://lovable.app",
  "https://transplantcare.uz",
  "https://www.transplantcare.uz",
]);

const ALLOWED_HOST_SUFFIXES = [".lovable.app", ".lovableproject.com"];
const ALLOWED_DEV_HOSTS = new Set(["localhost", "127.0.0.1"]);

function isAllowedOrigin(origin: string) {
  if (!origin) return false;

  try {
    const url = new URL(origin);

    if (ALLOWED_EXACT_ORIGINS.has(origin)) {
      return true;
    }

    if (ALLOWED_HOST_SUFFIXES.some((suffix) => url.hostname.endsWith(suffix))) {
      return true;
    }

    if (url.protocol === "http:" && ALLOWED_DEV_HOSTS.has(url.hostname)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export function getCorsHeaders(req: Request, methods = "GET, POST, OPTIONS") {
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = isAllowedOrigin(origin) ? origin : FALLBACK_ORIGIN;

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Allow-Methods": methods,
    "Vary": "Origin",
  };
}