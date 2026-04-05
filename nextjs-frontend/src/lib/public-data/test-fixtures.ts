import type { ArticleSummary, NewsletterSummary } from "./types";

export const TEST_SUBSCRIBER_COUNT = 2;

export const TEST_NEWSLETTERS: NewsletterSummary[] = [
  {
    id: 1,
    createdAt: "2026-03-20T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-20",
  },
];

export const TEST_ARTICLES: ArticleSummary[] = [
  {
    id: 1,
    title: "Mycorrhiza strengthen drought resilience",
    venue: "Nature Ecology",
    publicationDate: "2026-03-12",
    level: 2,
    panels: 1,
    summary: "Mycorrhiza partnerships help plants tolerate dry conditions.",
    url: "https://example.com/article-1",
  },
  {
    id: 2,
    title: "Fungal decomposition accelerates carbon cycling",
    venue: "Fungal Biology",
    publicationDate: "2026-03-08",
    level: 1,
    panels: 2,
    summary: "Wood decay fungi rapidly recycle forest carbon stores.",
    url: "https://example.com/article-2",
  },
];
