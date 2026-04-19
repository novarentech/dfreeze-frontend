import type { BookingValues } from "@/types/booking";

/**
 * Sends a booking request to the internal API endpoint.
 * The internal endpoint handles rate limiting and forwarding to the backend.
 */
export async function createBooking(data: BookingValues) {
  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData.message || "Gagal melakukan booking");
  }

  return responseData;
}
