import { z } from "zod";

export const bookingSchema = z.object({
  data: z.object({
    description: z.string().optional().or(z.literal("")),
    name: z.string().min(2, "Nama minimal 2 karakter.").trim(),
    address: z.string().min(3, "Alamat minimal 3 karakter.").trim(),
    phone: z.string().min(10, "Nomor telepon minimal 10 karakter.").trim(),
    pet_name: z.string().min(1, "Nama hewan harus diisi.").trim(),
    pet_type: z.string().min(1, "Jenis hewan harus diisi.").trim(),
    pet_gender: z.string().min(1, "Jenis kelamin hewan harus diisi.").trim(),
    pet_age: z.string().min(1, "Usia hewan harus diisi.").trim(),
  }),
});

export type BookingValues = z.infer<typeof bookingSchema>["data"];
