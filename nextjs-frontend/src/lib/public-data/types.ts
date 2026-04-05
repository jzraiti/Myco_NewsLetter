export interface SubscriptionMutationResult {
  status: "subscribed" | "already-subscribed" | "unsubscribed" | "not-found" | "error";
  message: string;
}

export interface NewsletterSummary {
  id: number | string;
  createdAt: string;
  link: string;
}

export interface ArticleSummary {
  id: number | string;
  title: string;
  venue: string | null;
  publicationDate: string;
  level: number | string | null;
  panels: number | string | null;
  summary: string;
  url: string;
}

export interface RecipientLookupRow {
  is_subscribed: boolean;
}

export interface NewsletterRow {
  id: number | string;
  created_at: string;
  link: string;
}

export interface ArticleRow {
  id: number | string;
  title: string | null;
  venue: string | null;
  publicationDate: string;
  Level: number | string | null;
  panels: number | string | null;
  llm_summary: string | null;
  url: string;
}
