import type { APIContext } from 'astro';
import { ENV_SERVER } from '@/config/env.server';
import { questionSubmissionSchema } from '@/types/question_submission';

export const prerender = false;

// --- 1. In-Memory Rate Limiter ---
interface RateLimitInfo {
  count: number;
  resetTime: number;
}
const rateLimitCache = new Map<string, RateLimitInfo>();

const RATE_LIMIT_MAX_REQUESTS = 3; // Maks 3 requests
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // Selama 60 detik (1 menit)

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientInfo = rateLimitCache.get(ip);

  if (!clientInfo || now > clientInfo.resetTime) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (clientInfo.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  clientInfo.count += 1;
  return true;
}

// --- 2. API Handler ---
export async function POST({ request, clientAddress }: APIContext) {
  try {
    const ip = request.headers.get("x-forwarded-for") || clientAddress || "unknown_ip";
    
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Anda terlalu sering mengirim pertanyaan. Harap tunggu 1 menit." 
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();

    // Validation
    const validatedData = questionSubmissionSchema.safeParse(body);

    if (!validatedData.success) {
      const errorMsg = validatedData.error.issues.map((e) => e.message).join(", ");
      return new Response(
        JSON.stringify({ success: false, message: errorMsg }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { API_BACKEND_URL: apiUrl, API_SECRET_KEY: apiKey } = ENV_SERVER;

    if (!apiUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Konfigurasi API backend tidak ditemukan.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Forward to Strapi
    const backendRes = await fetch(`${apiUrl}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(validatedData.data),
    });

    if (backendRes.ok) {
      return new Response(
        JSON.stringify({ success: true, message: "Pertanyaan berhasil dikirim." }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    let errorMsg = "Terjadi kesalahan respon dari eksternal sistem.";
    try {
      const errorData = await backendRes.json();
      errorMsg = errorData.error?.message || errorData.message || errorMsg;
    } catch {
      // ignore
    }

    return new Response(JSON.stringify({ success: false, message: errorMsg }), {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Questions API Error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Gagal memproses permintaan (Server Crash)." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export async function GET({ url }: APIContext) {
  try {
    const query = url.searchParams.get("query");
    const page = url.searchParams.get("page") || "1";
    const pageSize = url.searchParams.get("pageSize") || "5";

    const params = new URLSearchParams();
    
    if (query) {
      params.append("filters[question][$containsi]", query);
    }
    
    params.append("pagination[page]", page);
    params.append("pagination[pageSize]", pageSize);
    

    const { API_BACKEND_URL: apiUrl, API_SECRET_KEY: apiKey } = ENV_SERVER;

    const res = await fetch(`${apiUrl}/questions?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: false, message: "Gagal mengambil data pertanyaan." }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET Questions API Error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Terjadi kesalahan server internal." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
