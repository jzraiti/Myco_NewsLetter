import { createPublicBrowserClient, createPublicServerClient } from "@/lib/supabase/public";

import { TEST_ARTICLES, TEST_NEWSLETTERS } from "./test-fixtures";
import type {
  ArchiveQuery,
  ArticleRow,
  ArticleSummary,
  NewsletterRow,
  NewsletterSummary,
  PaginatedArchiveResult,
} from "./types";

type QueryResult<T> = Promise<{ data: T[] | null; error: { message: string } | null }>;

type CountQueryResult<T> = Promise<{
  data: T[] | null;
  error: { message: string } | null;
  count: number | null;
}>;

type QueryBuilder<T> = {
  order: (column: string, options?: { ascending?: boolean }) => QueryBuilder<T>;
  range: (from: number, to: number) => CountQueryResult<T>;
  or: (filter: string) => QueryBuilder<T>;
};

type ContentClient = {
  from: (table: "newsletters") => {
    select: (columns?: string) => QueryResult<NewsletterRow>;
    select: (columns: string, options: { count: "exact" }) => QueryBuilder<NewsletterRow>;
  };
  from: (table: "ss_articles") => {
    select: (columns?: string) => QueryResult<ArticleRow>;
    select: (columns: string, options: { count: "exact" }) => QueryBuilder<ArticleRow>;
  };
};

export const ARCHIVE_PAGE_SIZE = 12;

function shouldUseE2EFixtures() {
  return process.env.NEXT_PUBLIC_E2E_STATIC_DATA === "true";
}

function sortByNewestDate<T>(items: T[], getDate: (item: T) => string) {
  return [...items].sort(
    (left, right) => new Date(getDate(right)).getTime() - new Date(getDate(left)).getTime(),
  );
}

function compareByIdDescending(left: number | string, right: number | string) {
  if (typeof left === "number" && typeof right === "number") {
    return right - left;
  }

  return String(right).localeCompare(String(left));
}

function sortByNewestWithId<T extends { id: number | string }>(items: T[], getDate: (item: T) => string) {
  return [...items].sort((left, right) => {
    const dateDifference = new Date(getDate(right)).getTime() - new Date(getDate(left)).getTime();

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return compareByIdDescending(left.id, right.id);
  });
}

function clampPage(page: number, totalPages: number) {
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.min(page, totalPages);
}

function buildPageResult<T>({
  items,
  page,
  query,
}: {
  items: T[];
  page: number;
  query: string;
}): PaginatedArchiveResult<T> {
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ARCHIVE_PAGE_SIZE));
  const safePage = clampPage(page, totalPages);
  const start = (safePage - 1) * ARCHIVE_PAGE_SIZE;

  return {
    items: items.slice(start, start + ARCHIVE_PAGE_SIZE),
    page: safePage,
    totalPages,
    totalCount,
    pageSize: ARCHIVE_PAGE_SIZE,
    query,
  };
}

function normalizeCount(count: number | null, itemsLength: number) {
  return typeof count === "number" ? count : itemsLength;
}

function getPageRange(page: number) {
  const start = (page - 1) * ARCHIVE_PAGE_SIZE;
  return {
    start,
    end: start + ARCHIVE_PAGE_SIZE - 1,
  };
}

function mapPaginatedResult<T>({
  items,
  requestedPage,
  totalCount,
  query,
}: {
  items: T[];
  requestedPage: number;
  totalCount: number;
  query: string;
}): PaginatedArchiveResult<T> {
  const totalPages = Math.max(1, Math.ceil(totalCount / ARCHIVE_PAGE_SIZE));

  return {
    items,
    page: clampPage(requestedPage, totalPages),
    totalPages,
    totalCount,
    pageSize: ARCHIVE_PAGE_SIZE,
    query,
  };
}

function escapeSupabaseLike(value: string) {
  return value.replaceAll(",", "\\,");
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
  client?: ContentClient,
): Promise<NewsletterSummary[]> {
  if (shouldUseE2EFixtures()) {
    return TEST_NEWSLETTERS;
  }

  const resolvedClient = client ?? createPublicServerClient();
  const { data, error } = await resolvedClient.from("newsletters").select("id, created_at, link");

  if (error || !data) {
    return [];
  }

  return sortByNewestDate(data, (newsletter) => newsletter.created_at).map(mapNewsletter);
}

export async function fetchPublishedArticles(
  client?: ContentClient,
): Promise<ArticleSummary[]> {
  if (shouldUseE2EFixtures()) {
    return TEST_ARTICLES;
  }

  const resolvedClient = client ?? createPublicServerClient();
  const { data, error } = await resolvedClient
    .from("ss_articles")
    .select("id, title, venue, publicationDate, Level, panels, llm_summary, url");

  if (error || !data) {
    return [];
  }

  return sortByNewestDate(data, (article) => article.publicationDate)
    .map(mapArticle)
    .filter((article): article is ArticleSummary => article !== null);
}

export async function fetchPaginatedNewsletters(
  { page }: Pick<ArchiveQuery, "page">,
  client?: ContentClient,
): Promise<PaginatedArchiveResult<NewsletterSummary>> {
  if (shouldUseE2EFixtures()) {
    return buildPageResult({
      items: sortByNewestWithId(TEST_NEWSLETTERS, (newsletter) => newsletter.createdAt),
      page,
      query: "",
    });
  }

  const resolvedClient = client ?? createPublicServerClient();
  const requestedPage = Math.max(1, Math.trunc(page) || 1);
  const createQuery = () =>
    resolvedClient
      .from("newsletters")
      .select("id, created_at, link", { count: "exact" })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });
  const initialRange = getPageRange(requestedPage);
  const { data, error, count } = await createQuery().range(initialRange.start, initialRange.end);

  if (error || !data) {
    return mapPaginatedResult({
      items: [],
      requestedPage: 1,
      totalCount: 0,
      query: "",
    });
  }

  const totalCount = normalizeCount(count, data.length);
  const totalPages = Math.max(1, Math.ceil(totalCount / ARCHIVE_PAGE_SIZE));
  const safePage = clampPage(requestedPage, totalPages);

  if (safePage !== requestedPage) {
    const safeRange = getPageRange(safePage);
    const { data: safeData, error: safeError } = await createQuery().range(safeRange.start, safeRange.end);

    if (safeError || !safeData) {
      return mapPaginatedResult({
        items: [],
        requestedPage: 1,
        totalCount: 0,
        query: "",
      });
    }

    return mapPaginatedResult({
      items: safeData.map(mapNewsletter),
      requestedPage: safePage,
      totalCount,
      query: "",
    });
  }

  return mapPaginatedResult({
    items: data.map(mapNewsletter),
    requestedPage,
    totalCount,
    query: "",
  });
}

export async function fetchPaginatedArticles(
  { query, page }: ArchiveQuery,
  client?: ContentClient,
): Promise<PaginatedArchiveResult<ArticleSummary>> {
  const trimmedQuery = query.trim();

  if (shouldUseE2EFixtures()) {
    const filteredArticles = filterArticlesByQuery(
      sortByNewestWithId(TEST_ARTICLES, (article) => article.publicationDate),
      trimmedQuery,
    );

    return buildPageResult({
      items: filteredArticles,
      page,
      query: trimmedQuery,
    });
  }

  const resolvedClient = client ?? createPublicServerClient();
  const requestedPage = Math.max(1, Math.trunc(page) || 1);
  const createQuery = () =>
    resolvedClient
      .from("ss_articles")
      .select("id, title, venue, publicationDate, Level, panels, llm_summary, url", { count: "exact" })
      .order("publicationDate", { ascending: false })
      .order("id", { ascending: false });
  let queryBuilder = createQuery();

  if (trimmedQuery) {
    const escapedQuery = escapeSupabaseLike(trimmedQuery);
    queryBuilder = queryBuilder.or(
      `title.ilike.%${escapedQuery}%,venue.ilike.%${escapedQuery}%,llm_summary.ilike.%${escapedQuery}%`,
    );
  }

  const initialRange = getPageRange(requestedPage);
  const { data, error, count } = await queryBuilder.range(initialRange.start, initialRange.end);

  if (error || !data) {
    return mapPaginatedResult({
      items: [],
      requestedPage: 1,
      totalCount: 0,
      query: trimmedQuery,
    });
  }

  const totalCount = normalizeCount(count, data.length);
  const totalPages = Math.max(1, Math.ceil(totalCount / ARCHIVE_PAGE_SIZE));
  const safePage = clampPage(requestedPage, totalPages);

  if (safePage !== requestedPage) {
    const safeRange = getPageRange(safePage);
    const safeQueryBuilder = trimmedQuery
      ? createQuery().or(
          `title.ilike.%${escapeSupabaseLike(trimmedQuery)}%,venue.ilike.%${escapeSupabaseLike(trimmedQuery)}%,llm_summary.ilike.%${escapeSupabaseLike(trimmedQuery)}%`,
        )
      : createQuery();
    const { data: safeData, error: safeError } = await safeQueryBuilder.range(
      safeRange.start,
      safeRange.end,
    );

    if (safeError || !safeData) {
      return mapPaginatedResult({
        items: [],
        requestedPage: 1,
        totalCount: 0,
        query: trimmedQuery,
      });
    }

    return mapPaginatedResult({
      items: safeData.map(mapArticle).filter((article): article is ArticleSummary => article !== null),
      requestedPage: safePage,
      totalCount,
      query: trimmedQuery,
    });
  }

  return mapPaginatedResult({
    items: data.map(mapArticle).filter((article): article is ArticleSummary => article !== null),
    requestedPage,
    totalCount,
    query: trimmedQuery,
  });
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
