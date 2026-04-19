export interface Question {
  id: number;
  documentId: string;
  name: string;
  phone: string;
  question: string;
  answer: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface QuestionsResponse {
  data: Question[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
