import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import type { BookingValues } from "@/types/booking";
import { createBooking } from "@/lib/api/bookings";

export default function BookingModal({ variant = "default" }: { variant?: "default" | "cta" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingValues>({
    defaultValues: {
      description: "",
      name: "",
      address: "",
      phone: "",
      pet_name: "",
      pet_type: "",
      pet_gender: "",
      pet_age: "",
    },
  });

  const validateStep = async (step: number) => {
    let fields: (keyof BookingValues)[] = [];
    if (step === 1) {
      fields = ["description"];
    } else if (step === 2) {
      fields = ["name", "address", "phone"];
    } else if (step === 3) {
      fields = ["pet_name", "pet_type", "pet_age", "pet_gender"];
    }

    const isValid = await trigger(fields);
    
    if (!isValid) {
      // Show first error message from current step fields
      const firstError = fields.find((f) => errors[f]);
      if (firstError && errors[firstError]) {
        toast.error(errors[firstError].message || "Mohon lengkapi data", {
          position: "top-right",
        });
      }
      return false;
    }
    return true;
  };

  const onSubmit = async (data: BookingValues) => {
    setIsLoading(true);

    try {
      await createBooking(data);

      toast.success("Booking Berhasil!", {
        description: "Tim kami akan segera menghubungi Anda untuk konfirmasi.",
        position: "top-right",
      });
      reset();
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Gagal melakukan booking", {
        description: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Watch for review step
  const watchedValues = watch();

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

      <Dialog
        open={isOpen}
        onOpenChange={(val) => {
          setIsOpen(val);
          if (!val) {
            // Optional: reset form when closing?
          }
        }}
      >
        <DialogContent className="overflow-y-auto max-h-[95vh]">
          <DialogHeader className="mb-6 ">
            <DialogTitle className="text-lg font-bold text-slate-800">
              Buat Janji Temu
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Isi formulir di bawah untuk membuat janji temu.
            </DialogDescription>
          </DialogHeader>

          <Stepper
            onFinalStepCompleted={handleSubmit(onSubmit)}
            onBeforeNext={validateStep}
            backButtonText="Kembali"
            nextButtonText={isLoading ? "Loading..." : "Selanjutnya"}
            stepCircleContainerClassName="shadow-none border-none p-0 max-w-full"
            stepContainerClassName="p-0 mb-10"
            contentClassName="px-0"
            footerClassName="px-0"
          >
            {/* STEP 1: KELUHAN */}
            <Step>
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800">
                    Keluhan Kesehatan Hewan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Jelaskan gejala atau masalah kesehatan yang dialami hewan
                    peliharaan Anda
                  </p>
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="description"
                    className="text-slate-700 font-bold"
                  >
                    Deskripsi Keluhan <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Contoh: Kucing saya tidak mau makan sejak 2 hari yang lalu, terlihat lemas, dan sering bersembunyi..."
                    className={`min-h-[140px] placeholder:text-slate-400 placeholder:text-xs focus:bg-white transition-colors ${
                      errors.description ? "border-red-500" : ""
                    }`}
                    {...register("description", {
                      required: "Deskripsi keluhan wajib diisi",
                    })}
                  />
                </div>
              </div>
            </Step>

            {/* STEP 2: DATA PEMILIK */}
            <Step>
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800">
                    Data Diri Pemilik
                  </h3>
                  <p className="text-xs text-slate-500">
                    Informasi kontak untuk komunikasi dan administrasi
                  </p>
                </div>
                <div className="grid gap-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-slate-700 font-bold"
                    >
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Masukkan Nama Lengkap"
                      className={errors.name ? "border-red-500" : ""}
                      {...register("name", {
                        required: "Nama pemilik wajib diisi",
                        minLength: {
                          value: 2,
                          message: "Nama minimal 2 karakter",
                        },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-slate-700 font-bold"
                    >
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      placeholder="Contoh: Jl. Pandega Bhakti No 28"
                      className={`min-h-[80px] ${
                        errors.address ? "border-red-500" : ""
                      }`}
                      {...register("address", {
                        required: "Alamat wajib diisi",
                        minLength: {
                          value: 3,
                          message: "Alamat minimal 3 karakter",
                        },
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-slate-700 font-bold"
                    >
                      Nomor Telepon <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="08XXXXXXXXXX"
                      className={errors.phone ? "border-red-500" : ""}
                      {...register("phone", {
                        required: "Nomor telepon wajib diisi",
                        minLength: {
                          value: 10,
                          message: "Nomor telepon minimal 10 digit",
                        },
                      })}
                    />
                  </div>
                </div>
              </div>
            </Step>

            {/* STEP 3: DATA HEWAN */}
            <Step>
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800">
                    Data Hewan Peliharaan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Informasi detail tentang hewan peliharaan Anda
                  </p>
                </div>
                <div className="grid gap-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="pet_name"
                      className="text-slate-700 font-bold"
                    >
                      Nama Hewan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pet_name"
                      placeholder="Masukkan Nama Hewan Peliharaan Anda"
                      className={errors.pet_name ? "border-red-500" : ""}
                      {...register("pet_name", {
                        required: "Nama hewan wajib diisi",
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="pet_type"
                      className="text-slate-700 font-bold"
                    >
                      Jenis Hewan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pet_type"
                      placeholder="Contoh: Kucing"
                      className={errors.pet_type ? "border-red-500" : ""}
                      {...register("pet_type", {
                        required: "Jenis hewan wajib diisi",
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="pet_age"
                      className="text-slate-700 font-bold"
                    >
                      Umur <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pet_age"
                      placeholder="Contoh: 2 Tahun"
                      className={errors.pet_age ? "border-red-500" : ""}
                      {...register("pet_age", {
                        required: "Usia hewan wajib diisi",
                      })}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-bold">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="pet_gender"
                      control={control}
                      rules={{ required: "Jenis kelamin wajib dipilih" }}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="jantan"
                              id="jantan"
                              className="border-primary text-primary"
                            />
                            <Label
                              htmlFor="jantan"
                              className="font-normal cursor-pointer text-sm"
                            >
                              Jantan
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="betina"
                              id="betina"
                              className="border-primary text-primary"
                            />
                            <Label
                              htmlFor="betina"
                              className="font-normal cursor-pointer text-sm"
                            >
                              Betina
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Step>

            {/* STEP 4: REVIEW */}
            <Step>
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800">
                    Review Booking Anda
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pastikan semua informasi sudah benar sebelum mengirim
                  </p>
                </div>

                <div className="bg-sky-50/50 rounded-2xl p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end border-b border-sky-200/50 pb-1">
                      <h4 className="text-primary font-bold text-sm tracking-wide uppercase">
                        Keluhan
                      </h4>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {watchedValues.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end border-b border-sky-200/50 pb-1">
                      <h4 className="text-primary font-bold text-sm tracking-wide uppercase">
                        Data Pemilik
                      </h4>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1.5 text-xs text-slate-600">
                      <span className="font-medium">Nama</span>
                      <span>: {watchedValues.name}</span>
                      <span className="font-medium">Alamat</span>
                      <span>: {watchedValues.address}</span>
                      <span className="font-medium">Telepon</span>
                      <span>: {watchedValues.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end border-b border-sky-200/50 pb-1">
                      <h4 className="text-primary font-bold text-sm tracking-wide uppercase">
                        Data Hewan
                      </h4>
                    </div>
                    <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1.5 text-xs text-slate-600">
                      <span className="font-medium">Nama</span>
                      <span>: {watchedValues.pet_name}</span>
                      <span className="font-medium">Jenis</span>
                      <span>: {watchedValues.pet_type}</span>
                      <span className="font-medium">Kelamin</span>
                      <span>: {watchedValues.pet_gender}</span>
                      <span className="font-medium">Umur</span>
                      <span>: {watchedValues.pet_age}</span>
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
