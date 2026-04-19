import React, { useState } from "react";
import { Search, User, Calendar, CornerDownRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    id: "item-1",
    question: "Apakah harus booking dulu sebelum datang ke klinik?",
    answer: "Sangat disarankan untuk melakukan booking terlebih dahulu agar Anda tidak perlu mengantre lama. Namun, kami juga melayani pasien walk-in sesuai ketersediaan kuota dokter pada hari tersebut.",
    author: "Sarah",
    date: "3 April 2026"
  },
  {
    id: "item-2",
    question: "Apa saja syarat untuk melakukan vaksinasi hewan?",
    answer: "Hewan harus dalam kondisi sehat, minimal usia 8 minggu, nafsu makan baik, dan tidak sedang demam. Sebaiknya hewan sudah diberikan obat cacing seminggu sebelumnya.",
    author: "Rian",
    date: "5 April 2026"
  },
  {
    id: "item-3",
    question: "Berapa biaya estimasi untuk sterilisasi kucing jantan?",
    answer: "Biaya sterilisasi bervariasi tergantung berat badan dan kondisi kesehatan. Estimasi berkisar antara Rp 350.000 - Rp 600.000. Silakan hubungi admin untuk janji temu dan cek kesehatan awal.",
    author: "Dewi",
    date: "2 April 2026"
  },
  {
    id: "item-4",
    question: "Kapan sebaiknya anak kucing diberikan vaksin pertama?",
    answer: "Vaksinasi pertama (Tricat) biasanya diberikan pada usia 8-10 minggu, diikuti oleh booster sebulan kemudian dan vaksin Rabies pada usia 4 bulan.",
    author: "Fajar",
    date: "7 April 2026"
  },
  {
    id: "item-5",
    question: "Apakah grooming di DFreeze termasuk potong kuku?",
    answer: "Ya, layanan grooming lengkap kami sudah termasuk pembersihan telinga, potong kuku, sikat gigi (opsional), dan mandi menggunakan sampo medis jika diperlukan.",
    author: "Anita",
    date: "1 April 2026"
  }
];

export default function QAContainer() {
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 md:space-y-8 h-full">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
        <Input
          placeholder="Cari pertanyaan..."
          className="pl-12 md:pl-14 h-12 md:h-16 rounded-xl bg-white border-slate-200 shadow-sm focus:ring-primary focus:border-primary transition-all text-base md:text-lg placeholder:text-slate-400 border-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-4 md:space-y-5">
        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4 md:space-y-5 border-none">
            {filteredFaqs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id} 
                className="bg-white border-2 border-slate-100 rounded-xl px-4 sm:px-6 md:px-8 py-2 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all overflow-hidden border-b-2"
              >
                <AccordionTrigger className="hover:no-underline text-left group">
                  <div className="space-y-3 w-full">
                    <h3 className="text-base md:text-xl font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                      {faq.question}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 md:gap-6 gap-y-2 text-[10px] sm:text-xs md:text-sm text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                           <User size={12} className="md:size-[14px]" />
                        </div>
                        <span>{faq.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Calendar size={12} className="md:size-[14px]" />
                        <span>{faq.date}</span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-sm md:text-lg leading-relaxed border-t pt-4 px-1">
                  <div className="flex items-center gap-2 mb-3 text-primary font-bold text-[10px] md:text-xs uppercase tracking-wider">
                    <CornerDownRight size={24} className="shrink-0" />
                    <span>Jawaban Dari Kami</span>
                  </div>
                  <div className="pl-6 border-primary/10 py-1">
                    <p>{faq.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-16 md:py-24 rounded-xl border-2 border-dashed border-slate-200 px-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
               <Search size={32} className="md:size-[40px]" />
            </div>
            <p className="text-slate-600 text-base md:text-lg font-medium">Tidak ada pertanyaan yang sesuai dengan kata kunci Anda.</p>
            <p className="text-slate-600 text-xs md:text-sm mt-2">Coba gunakan kata kunci lain atau ajukan pertanyaan baru.</p>
          </div>
        )}
      </div>
    </div>
  );
}
