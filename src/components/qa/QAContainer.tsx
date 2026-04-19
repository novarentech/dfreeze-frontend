import React, { useState, useEffect } from "react";
import { Search, User, Calendar, CornerDownRight, Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { getQuestions } from "@/lib/api/question";
import type { Question } from "@/types/question";
import { formatDate } from "@/lib/utils/utils";

export default function QAContainer() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch questions on mount and when search changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await getQuestions({ query: search, page: 1, pageSize: 5 });
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 h-full">
      {/* Search Bar */}
      <div className="relative group">
        <Search
          className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
          size={20}
        />
        <Input
          placeholder="Cari pertanyaan..."
          className="pl-12 md:pl-14 h-12 md:h-16 rounded-xl bg-white border-slate-200 shadow-sm focus:ring-primary focus:border-primary transition-all text-base md:text-lg placeholder:text-slate-400 border-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 className="animate-spin text-primary" size={20} />
          </div>
        )}
      </div>

      {/* Accordion List */}
      <div className="space-y-4 md:space-y-5">
        {isLoading && questions.length === 0 ? (
          // Skeleton/Loading State
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 md:h-32 bg-slate-50 animate-pulse rounded-xl border-2 border-slate-100"
              />
            ))}
          </div>
        ) : questions.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            className="w-full space-y-4 md:space-y-5 border-none"
          >
            {questions.map((item) => (
              <AccordionItem
                key={item.id}
                value={String(item.id)}
                className="bg-white border-2 border-slate-100 rounded-xl px-4 sm:px-6 md:px-8 py-2 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] hover:border-primary/20 transition-all overflow-hidden border-b-2"
              >
                <AccordionTrigger className="hover:no-underline text-left group">
                  <div className="space-y-3 w-full">
                    <h3 className="text-base md:text-xl font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                      {item.question}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 md:gap-6 gap-y-2 text-[10px] sm:text-xs md:text-sm text-slate-400 font-medium">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <User size={12} className="md:size-[14px]" />
                        </div>
                        <span>{item.author || "Admin DFreeze"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Calendar size={12} className="md:size-[14px]" />
                        <span>{formatDate(item.createdAt)}</span>
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
                    <p>{item.answer || "Belum ada jawaban."}</p>
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
            <p className="text-slate-600 text-base md:text-lg font-medium">
              Tidak ada pertanyaan yang sesuai dengan kata kunci Anda.
            </p>
            <p className="text-slate-600 text-xs md:text-sm mt-2">
              Coba gunakan kata kunci lain atau ajukan pertanyaan baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
