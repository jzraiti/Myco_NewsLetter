import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ARCHIVE_PAGE_SIZE,
  fetchPaginatedArticles,
  fetchPaginatedNewsletters,
  fetchPublishedArticles,
  fetchPublishedNewsletters,
  filterArticlesByQuery,
} from "./content";

type NewsletterRecord = { id: number | string; created_at: string; link: string };
type ArticleRecord = {
  id: number | string;
  title: string | null;
  venue: string | null;
  publicationDate: string;
  Level: number | string | null;
  panels: number | string | null;
  llm_summary: string | null;
  url: string;
};

type QueryState<T> = {
  rows: T[];
  count: number;
  orders: Array<{ column: string; ascending: boolean }>;
  searchTerm: string;
};

function applyOrdering<T extends { id: number | string }>(rows: T[], state: QueryState<T>) {
  return [...rows].sort((left, right) => {
    for (const order of state.orders) {
      const leftValue = left[order.column as keyof T];
      const rightValue = right[order.column as keyof T];

      if (leftValue === rightValue) {
        continue;
      }

      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return order.ascending ? leftValue - rightValue : rightValue - leftValue;
      }

      const comparison = String(leftValue).localeCompare(String(rightValue));
      return order.ascending ? comparison : -comparison;
    }

    return 0;
  });
}

function createNewslettersQuery(rows: NewsletterRecord[]) {
  const state: QueryState<NewsletterRecord> = {
    rows,
    count: rows.length,
    orders: [],
    searchTerm: "",
  };

  return {
    state,
    order(column: string, options?: { ascending?: boolean }) {
      state.orders.push({ column, ascending: options?.ascending ?? true });
      return this;
    },
    or() {
      return this;
    },
    async range(from: number, to: number) {
      const orderedRows = applyOrdering(state.rows, state);
      return {
        data: orderedRows.slice(from, to + 1),
        error: null,
        count: state.count,
      };
    },
  };
}

function createArticlesQuery(rows: ArticleRecord[]) {
  const state: QueryState<ArticleRecord> = {
    rows,
    count: rows.length,
    orders: [],
    searchTerm: "",
  };

  return {
    state,
    order(column: string, options?: { ascending?: boolean }) {
      state.orders.push({ column, ascending: options?.ascending ?? true });
      return this;
    },
    or(filter: string) {
      const firstFilter = filter.split(",", 1)[0] ?? "";
      const prefix = "title.ilike.%";
      const suffix = "%";
      const rawSearchTerm = firstFilter.startsWith(prefix) && firstFilter.endsWith(suffix)
        ? firstFilter.slice(prefix.length, -suffix.length)
        : "";
      state.searchTerm = rawSearchTerm.replaceAll("\\,", ",").toLowerCase();

      if (state.searchTerm) {
        state.rows = state.rows.filter((row) => {
          const values = [row.title ?? "", row.venue ?? "", row.llm_summary ?? ""];
          return values.some((value) => value.toLowerCase().includes(state.searchTerm));
        });
        state.count = state.rows.length;
      }

      return this;
    },
    async range(from: number, to: number) {
      const orderedRows = applyOrdering(state.rows, state);
      return {
        data: orderedRows.slice(from, to + 1),
        error: null,
        count: state.count,
      };
    },
  };
}

function createContentClient(options: {
  newsletters?: NewsletterRecord[];
  articles?: ArticleRecord[];
}) {
  const { newsletters = [], articles = [] } = options;
  const selectCalls: Array<{
    table: "newsletters" | "ss_articles";
    columns?: string;
    count?: "exact";
  }> = [];
  const articleQueries: Array<ReturnType<typeof createArticlesQuery>> = [];
  const newsletterQueries: Array<ReturnType<typeof createNewslettersQuery>> = [];

  return {
    selectCalls,
    articleQueries,
    newsletterQueries,
    from: vi.fn((table: "newsletters" | "ss_articles") => ({
      select: (columns?: string, options?: { count: "exact" }) => {
        selectCalls.push({ table, columns, count: options?.count });

        if (table === "newsletters") {
          if (options?.count === "exact") {
            const query = createNewslettersQuery(newsletters.map((row) => ({ ...row })));
            newsletterQueries.push(query);
            return query;
          }

          return Promise.resolve({
            data: newsletters,
            error: null,
          });
        }

        if (options?.count === "exact") {
          const query = createArticlesQuery(articles.map((row) => ({ ...row })));
          articleQueries.push(query);
          return query;
        }

        return Promise.resolve({
          data: articles,
          error: null,
        });
      },
    })),
  };
}

describe("content helpers", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_E2E_STATIC_DATA;
  });

  it("sorts newest-first for newsletters and articles", async () => {
    const client = createContentClient({
      newsletters: [
        { id: 1, created_at: "2026-03-01", link: "older" },
        { id: 2, created_at: "2026-03-08", link: "newer" },
      ],
      articles: [
        {
          id: 1,
          title: "Older article",
          venue: "Fungal Biology",
          publicationDate: "2026-03-01",
          Level: 1,
          panels: 2,
          llm_summary: "Older summary",
          url: "https://example.com/older",
        },
        {
          id: 2,
          title: "Newer article",
          venue: "Nature Ecology",
          publicationDate: "2026-03-08",
          Level: 2,
          panels: 3,
          llm_summary: "Newer summary",
          url: "https://example.com/newer",
        },
      ],
    });

    const newsletters = await fetchPublishedNewsletters(client);
    const articles = await fetchPublishedArticles(client);

    expect(newsletters.map((newsletter) => newsletter.id)).toEqual([2, 1]);
    expect(articles.map((article) => article.id)).toEqual([2, 1]);
  });

  it("drops null Level rows and normalizes summary/venue strings without using any", async () => {
    const client = createContentClient({
      articles: [
        {
          id: 1,
          title: "Keep me",
          venue: "  Nature Ecology  ",
          publicationDate: "2026-03-08",
          Level: 2,
          panels: 3,
          llm_summary: "  Summary text  ",
          url: "https://example.com/keep",
        },
        {
          id: 2,
          title: "Drop me",
          venue: null,
          publicationDate: "2026-03-01",
          Level: null,
          panels: null,
          llm_summary: null,
          url: "https://example.com/drop",
        },
      ],
    });

    const articles = await fetchPublishedArticles(client);

    expect(articles).toEqual([
      {
        id: 1,
        title: "Keep me",
        venue: "Nature Ecology",
        publicationDate: "2026-03-08",
        level: 2,
        panels: 3,
        summary: "Summary text",
        url: "https://example.com/keep",
      },
    ]);
  });

  it("matches title, summary, and venue case-insensitively", () => {
    const articles = [
      {
        id: 1,
        title: "Mycorrhiza strengthen drought resilience",
        venue: "Nature Ecology",
        publicationDate: "2026-03-08",
        level: 2,
        panels: 3,
        summary: "Fungi help stressed plants recover.",
        url: "https://example.com/1",
      },
      {
        id: 2,
        title: "Forest decay study",
        venue: "Fungal Biology",
        publicationDate: "2026-03-01",
        level: 1,
        panels: 1,
        summary: "Carbon cycling in forests.",
        url: "https://example.com/2",
      },
    ];

    expect(filterArticlesByQuery(articles, "drought")).toHaveLength(1);
    expect(filterArticlesByQuery(articles, "stressed plants")).toHaveLength(1);
    expect(filterArticlesByQuery(articles, "fungal biology")).toHaveLength(1);
  });

  it("returns the original ordered dataset when the query is blank", () => {
    const articles = [
      {
        id: 1,
        title: "First",
        venue: null,
        publicationDate: "2026-03-08",
        level: 2,
        panels: 3,
        summary: "First summary",
        url: "https://example.com/1",
      },
      {
        id: 2,
        title: "Second",
        venue: null,
        publicationDate: "2026-03-01",
        level: 1,
        panels: 1,
        summary: "Second summary",
        url: "https://example.com/2",
      },
    ];

    expect(filterArticlesByQuery(articles, "")).toBe(articles);
  });

  it("returns the second article page with fixed pageSize metadata in fixture mode", async () => {
    process.env.NEXT_PUBLIC_E2E_STATIC_DATA = "true";

    const result = await fetchPaginatedArticles({ query: "", page: 2 });

    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(ARCHIVE_PAGE_SIZE);
    expect(result.totalPages).toBe(2);
    expect(result.totalCount).toBe(15);
    expect(result.items).toHaveLength(3);
    expect(result.items.map((article) => article.title)).toEqual([
      "Fungal biocrusts improve desert retention",
      "Mycorrhiza rebalance phosphorus allocation",
      "Fixture Article 15",
    ]);
  });

  it("clamps out-of-range article pages and returns only matching rows", async () => {
    process.env.NEXT_PUBLIC_E2E_STATIC_DATA = "true";

    const result = await fetchPaginatedArticles({ query: "mycorrhiza", page: 99 });

    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.totalCount).toBe(3);
    expect(result.query).toBe("mycorrhiza");
    expect(result.items.map((article) => article.title)).toEqual([
      "Mycorrhiza strengthen drought resilience",
      "Forest fungi coordinate nutrient hotspots",
      "Mycorrhiza rebalance phosphorus allocation",
    ]);
  });

  it("returns the second newsletter page with newest-first ordering metadata in fixture mode", async () => {
    process.env.NEXT_PUBLIC_E2E_STATIC_DATA = "true";

    const result = await fetchPaginatedNewsletters({ page: 2 });

    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(ARCHIVE_PAGE_SIZE);
    expect(result.totalPages).toBe(2);
    expect(result.totalCount).toBe(15);
    expect(result.items.map((newsletter) => newsletter.link)).toEqual([
      "https://example.com/newsletters/2026-03-08",
      "https://example.com/newsletters/2026-03-07",
      "https://example.com/newsletters/2025-12-12",
    ]);
  });

  it("clamps live newsletter pages to the last valid page", async () => {
    const newsletters = Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      created_at: `2026-03-${String(20 - index).padStart(2, "0")}T12:00:00.000Z`,
      link: `https://example.com/newsletters/${index + 1}`,
    }));
    const client = createContentClient({ newsletters });

    const result = await fetchPaginatedNewsletters({ page: 999 }, client);

    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(2);
    expect(result.totalCount).toBe(15);
    expect(result.items).toHaveLength(3);
    expect(result.items[0]?.link).toBe("https://example.com/newsletters/13");
  });

  it("queries live article pagination with exact counts, ordering, range, and server-side search", async () => {
    const client = createContentClient({
      articles: [
        {
          id: 11,
          title: "Fungal resilience trial",
          venue: "Nature Ecology",
          publicationDate: "2026-03-11",
          Level: 2,
          panels: 1,
          llm_summary: "Fungal communities improve stress tolerance.",
          url: "https://example.com/articles/11",
        },
      ],
    });

    const result = await fetchPaginatedArticles({ query: " fungal ", page: 1 }, client);

    expect(client.selectCalls).toContainEqual({
      table: "ss_articles",
      columns: "id, title, venue, publicationDate, Level, panels, llm_summary, url",
      count: "exact",
    });
    expect(client.articleQueries).toHaveLength(1);
    expect(client.articleQueries[0]?.state.orders).toEqual([
      { column: "publicationDate", ascending: false },
      { column: "id", ascending: false },
    ]);
    expect(client.articleQueries[0]?.state.searchTerm).toBe("fungal");
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(ARCHIVE_PAGE_SIZE);
    expect(result.totalCount).toBe(1);
    expect(result.query).toBe("fungal");
    expect(result.items[0]?.title).toBe("Fungal resilience trial");
  });
});
