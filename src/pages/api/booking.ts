import type { APIContext } from 'astro';
import { z } from 'zod';
import { ENV_SERVER } from '@/config/env.server';

export const prerender = false;

// --- 1. Zod Body Validation Schema ---
const bookingSchema = z.object({
  namaPemilik: z.string().min(2, "Nama Pemilik minimal 2 karakter.").trim(),
  namaHewan: z.string().min(2, "Nama Hewan minimal 2 karakter.").trim(),
  tanggalBooking: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
});

// --- 2. In-Memory Rate Limiter ---
// Menyimpan riwayat akses IP dengan jumlah hit & reset time
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

  // Jika belum ada/sudah kadaluarsa, reset & perbolehkan
  if (!clientInfo || now > clientInfo.resetTime) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  // Jika kuota habis, tolak
  if (clientInfo.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  // Kuota masih ada, inkremen & perbolehkan
  clientInfo.count += 1;
  return true;
}

// --- 3. API Handler ---
export async function POST({ request, clientAddress }: APIContext) {
  try {
    // Implementasi Rate Limiter
    // Deteksi IP berdasarkan cloud proxy atau native astro address
    const ip = request.headers.get("x-forwarded-for") || clientAddress || "unknown_ip";
    
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Anda terlalu sering melakukan request (Rate Limit Exceeded). Harap tunggu 1 menit." 
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();

    // Implementasi Zod Parser
    const validatedData = bookingSchema.safeParse(body);

    if (!validatedData.success) {
      const errorMsg = validatedData.error.errors.map((e) => e.message).join(", ");
      return new Response(
        JSON.stringify({ success: false, message: errorMsg }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Menggunakan variabel global (ENV_SERVER) agar tidak membaca RAW config
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

    // Teruskan ke server eksternal (Strapi API)
    const backendRes = await fetch(`${apiUrl}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify(validatedData.data),
    });

    if (backendRes.ok) {
      return new Response(
        JSON.stringify({ success: true, message: "Booking berhasil dikirim." }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Tangani respons valid tapi statusnya error dari Strapi
    let errorMsg = "Terjadi kesalahan respon dari eksternal sistem.";
    try {
      const errorData = await backendRes.json();
      errorMsg = errorData.error?.message || errorData.message || errorMsg;
    } catch {
      // Abaikan jika tidak reformat JSON
    }

    return new Response(JSON.stringify({ success: false, message: errorMsg }), {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Booking API Error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Gagal memproses permintaan (Server Crash)." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
