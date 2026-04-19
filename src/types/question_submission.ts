import { z } from "zod";

export const questionSubmissionSchema = z.object({
  data: z.object({
    name: z.string().min(2, "Nama minimal 2 karakter.").trim(),
    phone: z.string().min(10, "Nomor WhatsApp minimal 10 karakter.").trim(),
    question: z.string().min(5, "Pertanyaan minimal 5 karakter.").trim(),
  }),
});

export type QuestionSubmissionValues = z.infer<typeof questionSubmissionSchema>["data"];
