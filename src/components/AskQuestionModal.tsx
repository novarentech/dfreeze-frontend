import React, { useState } from "react";
import { HelpCircle, Send } from "lucide-react";
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

export default function AskQuestionModal({ variant = "default" }: { variant?: "default" | "cta" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    contact: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Question Submitted:", form);
      toast.success("Pertanyaan Terkirim!", {
        description: "Tim medis kami akan segera menghubungi Anda melalui kontak yang diberikan.",
        position: "top-right"
      });
      setIsLoading(false);
      setIsOpen(false);
      setForm({ name: "", contact: "", message: "" });
    }, 1000);
  };

  return (
    <>
      {variant === "default" ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-full gap-2 px-6 shadow-md transition-all active:scale-95"
        >
          <HelpCircle size={18} />
          Tanya Kami
        </Button>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="xl"
          className="rounded-full px-8 py-6 font-semibold border-white/40 text-white hover:bg-white/10 backdrop-blur-sm transition-all bg-transparent hover:text-white/80 w-full md:w-auto overflow-hidden group"
        >
          <HelpCircle size={20} className="mr-2 group-hover:scale-110 transition-transform" />
          Ajukan Pertanyaan
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="overflow-y-auto max-h-[95vh]">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-lg font-bold text-slate-800">Ajukan Pertanyaan</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Isi formulir di bawah ini untuk mengirimkan pertanyaan kepada tim medis kami.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-bold">Nama Lengkap <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Masukkan Nama Lengkap" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-slate-700 font-bold">WhatsApp / Email <span className="text-red-500">*</span></Label>
                <Input 
                  id="contact" 
                  name="contact" 
                  placeholder="08XXXXXXXXXX atau email@anda.com" 
                  value={form.contact} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700 font-bold">Pertanyaan Anda <span className="text-red-500">*</span></Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  placeholder="Jelaskan pertanyaan atau konsultasi Anda di sini..." 
                  value={form.message} 
                  onChange={handleChange} 
                  className="min-h-[140px]"
                  required 
                />
              </div>
            </div>

            <DialogFooter className="px-0">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-12 flex gap-2"
              >
                {isLoading ? (
                   "Mengirim..."
                ) : (
                  <>
                    <span>Kirim Pertanyaan</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
