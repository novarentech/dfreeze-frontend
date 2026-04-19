import React, { useState, useEffect } from "react";
import { Search, User, Calendar, CornerDownRight, Loader2, Plus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getQuestions } from "@/lib/api/question";
import type { Question, QuestionsResponse } from "@/types/question";
import { formatDate } from "@/lib/utils/utils";

const PAGE_SIZE = 5;

export default function QAContainer() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<QuestionsResponse["meta"]["pagination"] | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch questions when page or search changes
  useEffect(() => {
    fetchQuestions();
  }, [page]);

  // Reset page when search changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchQuestions();
      } else {
        setPage(1); // will trigger the page-based useEffect
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await getQuestions({ query: search, page, pageSize: PAGE_SIZE });
      
      if (page === 1) {
        setQuestions(response.data);
      } else {
        setQuestions((prev) => [...prev, ...response.data]);
      }
      
      setPagination(response.meta.pagination);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const hasMore = pagination ? pagination.page < pagination.pageCount : false;

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
        {isInitialLoad && questions.length === 0 ? (
          // Initial Skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 md:h-32 bg-slate-50 animate-pulse rounded-xl border-2 border-slate-100"
              />
            ))}
          </div>
        ) : questions.length > 0 ? (
          <>
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-4 md:space-y-5 border-none"
            >
              {questions.map((item) => (
                <AccordionItem
                  key={item.documentId}
                  value={item.documentId}
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
                          <span>{item.name || "Anonim"}</span>
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
                      <p>{item.answer || "Belum ada jawaban. Mohon tunggu tim kami menanggapi pertanyaan Anda."}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Load More Button */}
            {hasMore && (
              <div className="pt-4 flex justify-center">
                <Button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoading}
                  variant="outline"
                  className="rounded-full px-8 py-6 border-2 border-slate-100 hover:border-primary hover:text-primary transition-all gap-2 font-bold"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Plus size={18} />
                  )}
                  Muat Lebih Banyak
                </Button>
              </div>
            )}
          </>
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
