import { createPublicBrowserClient, createPublicServerClient } from "@/lib/supabase/public";

import type { ArticleRow, ArticleSummary, NewsletterRow, NewsletterSummary } from "./types";

type QueryResult<T> = Promise<{ data: T[] | null; error: { message: string } | null }>;

type ContentClient = {
  from: (table: "newsletters") => {
    select: (columns?: string) => QueryResult<NewsletterRow>;
  };
  from: (table: "ss_articles") => {
    select: (columns?: string) => QueryResult<ArticleRow>;
  };
};

function sortByNewestDate<T>(items: T[], getDate: (item: T) => string) {
  return [...items].sort(
    (left, right) => new Date(getDate(right)).getTime() - new Date(getDate(left)).getTime(),
  );
}

function normalizeText(value: string | null) {
  const normalized = value?.trim() ?? "";
  return normalized.length > 0 ? normalized : "";
}

function mapNewsletter(row: NewsletterRow): NewsletterSummary {
  return {
    id: row.id,
    createdAt: row.created_at,
    link: row.link,
  };
}

function mapArticle(row: ArticleRow): ArticleSummary | null {
  if (row.Level == null) {
    return null;
  }

  return {
    id: row.id,
    title: normalizeText(row.title),
    venue: normalizeText(row.venue) || null,
    publicationDate: row.publicationDate,
    level: row.Level,
    panels: row.panels,
    summary: normalizeText(row.llm_summary),
    url: row.url,
  };
}

export async function fetchPublishedNewsletters(
  client: ContentClient = createPublicServerClient(),
): Promise<NewsletterSummary[]> {
  const { data, error } = await client.from("newsletters").select("id, created_at, link");

  if (error || !data) {
    return [];
  }

  return sortByNewestDate(data, (newsletter) => newsletter.created_at).map(mapNewsletter);
}

export async function fetchPublishedArticles(
  client: ContentClient = createPublicServerClient(),
): Promise<ArticleSummary[]> {
  const { data, error } = await client
    .from("ss_articles")
    .select("id, title, venue, publicationDate, Level, panels, llm_summary, url");

  if (error || !data) {
    return [];
  }

  return sortByNewestDate(data, (article) => article.publicationDate)
    .map(mapArticle)
    .filter((article): article is ArticleSummary => article !== null);
}

export function filterArticlesByQuery(articles: ArticleSummary[], query: string): ArticleSummary[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return articles;
  }

  return articles.filter((article) => {
    const searchFields = [article.title, article.summary, article.venue ?? ""];
    return searchFields.some((value) => value.toLowerCase().includes(normalizedQuery));
  });
}

export function createPublicContentBrowserClient() {
  return createPublicBrowserClient();
}
