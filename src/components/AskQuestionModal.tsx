import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { createQuestion } from "@/lib/api/question";
import type { QuestionSubmissionValues } from "@/types/question_submission";

export default function AskQuestionModal({
  variant = "default",
}: {
  variant?: "default" | "cta";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionSubmissionValues>({
    defaultValues: {
      name: "",
      phone: "",
      question: "",
    },
  });

  const onSubmit = async (data: QuestionSubmissionValues) => {
    setIsLoading(true);
    try {
      await createQuestion(data);
      
      toast.success("Pertanyaan Terkirim!", {
        description: "Tim medis kami akan segera menghubungi Anda melalui kontak yang diberikan.",
        position: "top-right",
      });
      
      reset();
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Gagal mengirim pertanyaan", {
        description: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {variant === "default" ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full gap-2 px-12 py-4 shadow-md transition-all active:scale-95"
        >
          Ajukan Pertanyaan
        </Button>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="xl"
          className="rounded-full px-8 py-6 font-semibold border-white/40 text-white hover:bg-white/10 backdrop-blur-sm transition-all bg-transparent hover:text-white/80 w-full md:w-auto overflow-hidden group"
        >
          <HelpCircle
            size={20}
            className="mr-2 group-hover:scale-110 transition-transform"
          />
          Ajukan Pertanyaan
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="overflow-y-auto max-h-[95vh]">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-lg font-bold text-slate-800">
              Ajukan Pertanyaan
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Isi formulir di bawah ini untuk mengirimkan pertanyaan kepada tim
              medis kami.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-bold">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Masukkan Nama Lengkap"
                  className={errors.name ? "border-red-500" : ""}
                  {...register("name", { 
                    required: "Nama wajib diisi",
                    minLength: { value: 2, message: "Nama minimal 2 karakter" }
                  })}
                  required
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-bold">
                  No. WhatsApp <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="08XXXXXXXXXX"
                  className={errors.phone ? "border-red-500" : ""}
                  {...register("phone", { 
                    required: "Nomor WhatsApp wajib diisi",
                    minLength: { value: 10, message: "Nomor minimal 10 digit" }
                  })}
                  required
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="question" className="text-slate-700 font-bold">
                  Pertanyaan Anda <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="question"
                  placeholder="Jelaskan pertanyaan atau konsultasi Anda di sini..."
                  className={`min-h-[140px] ${errors.question ? "border-red-500" : ""}`}
                  {...register("question", { 
                    required: "Pertanyaan wajib diisi",
                    minLength: { value: 5, message: "Pertanyaan minimal 5 karakter" }
                  })}
                  required
                />
                {errors.question && (
                  <p className="text-xs text-red-500 mt-1">{errors.question.message}</p>
                )}
              </div>
            </div>

            <DialogFooter className="px-0">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12 flex gap-2"
              >
                {isLoading ? "Mengirim..." : "Kirim Pertanyaan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
