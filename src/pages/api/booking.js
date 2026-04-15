export const prerender = false;

export async function POST({ request }) {
  try {
    const body = await request.json();

    const { namaPemilik, namaHewan, tanggalBooking } = body;

    // Validasi field wajib
    if (!namaPemilik || !namaHewan || !tanggalBooking) {
      return new Response(
        JSON.stringify({ success: false, message: "Semua field wajib diisi." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const apiUrl = process.env.PUBLIC_API_BACKEND_URL;
    const apiKey = process.env.API_SECRET_KEY;

    if (!apiUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Konfigurasi server tidak lengkap.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Forward ke backend eksternal dengan Authorization header
    const backendRes = await fetch(`${apiUrl}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({ namaPemilik, namaHewan, tanggalBooking }),
    });

    if (backendRes.ok) {
      return new Response(
        JSON.stringify({ success: true, message: "Booking berhasil dikirim." }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    // Handle error dari backend
    let errorMsg = "Terjadi kesalahan pada server. Silakan coba lagi.";
    try {
      const errorData = await backendRes.json();
      errorMsg = errorData.message ?? errorMsg;
    } catch {
      // ignore parse error
    }

    return new Response(JSON.stringify({ success: false, message: errorMsg }), {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: "Permintaan tidak valid." }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
}
