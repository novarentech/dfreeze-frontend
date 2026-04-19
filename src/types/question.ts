export interface Question {
  id: number;
  documentId: string;
  question: string;
  answer: string;
  author?: string;
  date?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}
