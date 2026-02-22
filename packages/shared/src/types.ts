export interface ArticleMetadata {
  articleNumber: string;
  title: string;
  part?: string;
  partTitle?: string;
  chapter?: string;
  chapterTitle?: string;
  section?: string;
  sectionTitle?: string;
  hierarchy: string;
}

export interface ConstitutionArticle {
  id: string;
  text: string;
  metadata: ArticleMetadata;
}

export interface Source {
  articleNumber: string;
  title: string;
  hierarchy: string;
  text: string;
  score: number;
}

export interface SearchResult {
  sources: Source[];
}

export interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
}

export interface SearchRequestBody {
  query: string;
  topK?: number;
}
