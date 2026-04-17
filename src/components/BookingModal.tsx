import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import Stepper, { Step } from "./ui/Stepper";
import { toast } from "sonner";

export default function BookingModal({ variant = "default" }: { variant?: "default" | "cta" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    deskripsiKeluhan: "",
    namaPemilik: "",
    alamatPemilik: "",
    nomorTelepon: "",
    namaHewan: "",
    jenisHewan: "",
    jenisKelamin: "jantan",
    umurHewan: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRadioChange = (value: string) => {
    setForm((prev) => ({ ...prev, jenisKelamin: value }));
  };

  async function handleSubmit() {
    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Booking Berhasil!", {
          description: "Tim kami akan segera menghubungi Anda untuk konfirmasi.",
          position: "top-right"
        });
        setForm({
            deskripsiKeluhan: "",
            namaPemilik: "",
            alamatPemilik: "",
            nomorTelepon: "",
            namaHewan: "",
            jenisHewan: "",
            jenisKelamin: "",
            umurHewan: "",
        });
        setIsOpen(false);
      } else {
        toast.error("Gagal melakukan booking", {
          description: data.message || "Terjadi kesalahan. Silakan coba lagi.",
          position: "top-right"
        });
        setIsOpen(false);
      }
    } catch {
      toast.error("Masalah Koneksi", {
        description: "Gagal terhubung ke server. Periksa koneksi Anda.",
        position: "top-right"
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {variant === "default" ? (
        <Button
          id="booking-trigger"
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Booking Sekarang
        </Button>
      ) : (
        <Button
          id="booking-trigger-cta"
          onClick={() => setIsOpen(true)}
          size="xl"
          className="rounded-full px-8 py-6 font-semibold shadow-lg shadow-black/10 hover:shadow-black/20 hover:text-primary transition-all hover:bg-white bg-white text-primary group w-full md:w-auto"
        >
          Buat Janji Sekarang
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowRight size={24} />
          </div>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={(val) => {
          setIsOpen(val);
          if (!val) {
            setStatus("idle");
          }
      }}>
        <DialogContent className="overflow-y-auto max-h-[95vh]">
          <DialogHeader className="mb-6 ">
              <DialogTitle className="text-lg font-bold text-slate-800">Buat Janji Temu</DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
              Isi formulir di bawah untuk membuat janji temu.
              </DialogDescription>
          </DialogHeader>
          <Stepper 
              onFinalStepCompleted={handleSubmit}
                    backButtonText="Kembali"
                    nextButtonText={isLoading ? "Loading..." : "Selanjutnya"}
                    onStepChange={() => setErrorMessage("")}
                    stepCircleContainerClassName="shadow-none border-none p-0 max-w-full"
                    stepContainerClassName="p-0 mb-10"
                    contentClassName="px-0"
                    footerClassName="px-0"
                >
                    <Step>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-800">Keluhan Kesehatan Hewan</h3>
                                <p className="text-xs text-slate-500">Jelaskan gejala atau masalah kesehatan yang dialami hewan peliharaan Anda</p>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="deskripsiKeluhan" className="text-slate-700 font-bold">Deskripsi Keluhan <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="deskripsiKeluhan"
                                    name="deskripsiKeluhan"
                                    placeholder="Contoh: Kucing saya tidak mau makan sejak 2 hari yang lalu, terlihat lemas, dan sering bersembunyi..."
                                    value={form.deskripsiKeluhan}
                                    onChange={handleChange}
                                    className="min-h-[140px] placeholder:text-slate-400 placeholder:text-xs focus:bg-white transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </Step>

                    <Step>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-800">Data Diri Pemilik</h3>
                                <p className="text-xs text-slate-500">Informasi kontak untuk komunikasi dan administrasi</p>
                            </div>
                            <div className="grid gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="namaPemilik" className="text-slate-700 font-bold">Nama Lengkap <span className="text-red-500">*</span></Label>
                                    <Input id="namaPemilik" name="namaPemilik" placeholder="Masukkan Nama Lengkap" value={form.namaPemilik} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="alamatPemilik" className="text-slate-700 font-bold">Alamat Lengkap <span className="text-red-500">*</span></Label>
                                    <Textarea id="alamatPemilik" name="alamatPemilik" placeholder="Contoh: Jl. Pandega Bhakti No 28" value={form.alamatPemilik} onChange={handleChange} className="min-h-[80px]" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nomorTelepon" className="text-slate-700 font-bold">Nomor Telepon <span className="text-red-500">*</span></Label>
                                    <Input id="nomorTelepon" name="nomorTelepon" placeholder="08XXXXXXXXXX" value={form.nomorTelepon} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>
                    </Step>

                    <Step>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-800">Data Hewan Peliharaan</h3>
                                <p className="text-xs text-slate-500">Informasi detail tentang hewan peliharaan Anda</p>
                            </div>
                            <div className="grid gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="namaHewan" className="text-slate-700 font-bold">Nama Hewan <span className="text-red-500">*</span></Label>
                                    <Input id="namaHewan" name="namaHewan" placeholder="Masukkan Nama Hewan Peliharaan Anda" value={form.namaHewan} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jenisHewan" className="text-slate-700 font-bold">Jenis Hewan <span className="text-red-500">*</span></Label>
                                    <Input id="jenisHewan" name="jenisHewan" placeholder="Contoh: Kucing" value={form.jenisHewan} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="umurHewan" className="text-slate-700 font-bold">Umur <span className="text-red-500">*</span></Label>
                                    <Input id="umurHewan" name="umurHewan" placeholder="Contoh: 2 Tahun" value={form.umurHewan} onChange={handleChange} required />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-slate-700 font-bold">Jenis Kelamin <span className="text-red-500">*</span></Label>
                                    <RadioGroup value={form.jenisKelamin} onValueChange={handleRadioChange} className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="jantan" id="jantan" className="border-primary text-primary" />
                                            <Label htmlFor="jantan" className="font-normal cursor-pointer text-sm">Jantan</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="betina" id="betina" className="border-primary text-primary" />
                                            <Label htmlFor="betina" className="font-normal cursor-pointer text-sm">Betina</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>
                    </Step>

                    <Step>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-800">Review Booking Anda</h3>
                                <p className="text-xs text-slate-500">Pastikan semua informasi sudah benar sebelum mengirim</p>
                            </div>
                            
                            <div className="bg-sky-50/50 rounded-2xl p-6 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end border-b border-sky-200/50 pb-1">
                                        <h4 className="text-primary font-bold text-sm tracking-wide uppercase">Keluhan</h4>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">{form.deskripsiKeluhan}</p>
                                </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end border-b border-sky-200/50 pb-1">
                                            <h4 className="text-primary font-bold text-sm tracking-wide uppercase">Data Pemilik</h4>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1.5 text-xs text-slate-600">
                                            <span className="font-medium">Nama</span><span>: {form.namaPemilik}</span>
                                            <span className="font-medium">Alamat</span><span>: {form.alamatPemilik}</span>
                                            <span className="font-medium">Telepon</span><span>: {form.nomorTelepon}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end border-b border-sky-200/50 pb-1">
                                            <h4 className="text-primary font-bold text-sm tracking-wide uppercase">Data Hewan</h4>
                                        </div>
                                        <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1.5 text-xs text-slate-600">
                                            <span className="font-medium">Nama</span><span>: {form.namaHewan}</span>
                                            <span className="font-medium">Jenis</span><span>: {form.jenisHewan}</span>
                                            <span className="font-medium">Kelamin</span><span>: {form.jenisKelamin}</span>
                                            <span className="font-medium">Umur</span><span>: {form.umurHewan}</span>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </Step>
                </Stepper>
          </DialogContent>
        </Dialog>
      </>
    );
  }
