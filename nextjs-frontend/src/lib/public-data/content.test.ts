import { describe, expect, it, vi } from "vitest";

import { fetchPublishedArticles, fetchPublishedNewsletters, filterArticlesByQuery } from "./content";

function createContentClient(options: {
  newsletters?: Array<{ id: number | string; created_at: string; link: string }>;
  articles?: Array<{
    id: number | string;
    title: string | null;
    venue: string | null;
    publicationDate: string;
    Level: number | string | null;
    panels: number | string | null;
    llm_summary: string | null;
    url: string;
  }>;
}) {
  const { newsletters = [], articles = [] } = options;

  return {
    from: vi.fn((table: "newsletters" | "ss_articles") => ({
      select: () =>
        Promise.resolve({
          data: table === "newsletters" ? newsletters : articles,
          error: null,
        }),
    })),
  };
}

describe("content helpers", () => {
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
});
