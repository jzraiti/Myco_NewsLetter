import { Page, Route } from "@playwright/test";

import { TEST_ARTICLES, TEST_NEWSLETTERS, TEST_SUBSCRIBER_COUNT } from "@/lib/public-data/test-fixtures";

type Subscriber = {
  email: string;
  is_subscribed: boolean;
};

const defaultSubscribers = [
  ["existing@example.com", { email: "existing@example.com", is_subscribed: true }],
  ["archived@example.com", { email: "archived@example.com", is_subscribed: false }],
] as const satisfies ReadonlyArray<readonly [string, Subscriber]>;

const defaultNewsletters = TEST_NEWSLETTERS.map((newsletter) => ({
  id: newsletter.id,
  created_at: newsletter.createdAt,
  link: newsletter.link,
}));

const defaultArticles = TEST_ARTICLES.map((article) => ({
  id: article.id,
  title: article.title,
  llm_summary: article.summary,
  venue: article.venue,
  publicationDate: article.publicationDate,
  Level: article.level,
  panels: article.panels,
  url: article.url,
}));

function createSubscribers() {
  return new Map<string, Subscriber>(defaultSubscribers);
}

function createNewsletters() {
  return defaultNewsletters.map((newsletter) => ({ ...newsletter }));
}

function createArticles() {
  return defaultArticles.map((article) => ({ ...article }));
}

export const PUBLIC_JOURNEY_TEST_DATA = {
  subscriberCount: TEST_SUBSCRIBER_COUNT,
  existingSubscriberEmail: "existing@example.com",
  archivedSubscriberEmail: "archived@example.com",
  newsletterLink: "https://example.com/newsletters/2026-03-20",
  articleTitles: [
    "Mycorrhiza strengthen drought resilience",
    "Fungal decomposition accelerates carbon cycling",
  ],
} as const;

async function fulfillJson(route: Route, payload: unknown, extraHeaders: Record<string, string> = {}) {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    headers: {
      "access-control-allow-origin": "*",
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
  });
}

export async function mockSupabase(page: Page) {
  const subscribers = createSubscribers();
  const newsletters = createNewsletters();
  const articles = createArticles();

  await page.route("**/rest/v1/recipients*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();

    if (method === "GET" && request.headers()["prefer"]?.includes("count=exact")) {
      await fulfillJson(route, null, {
        "content-range": `0-0/${PUBLIC_JOURNEY_TEST_DATA.subscriberCount}`,
      });
      return;
    }

    if (method === "GET") {
      const emailFilter = url.searchParams.get("email");
      const email = emailFilter?.split("eq.")[1] ?? "";
      const subscriber = subscribers.get(email);
      await fulfillJson(route, subscriber ?? null);
      return;
    }

    if (method === "POST") {
      const body = request.postDataJSON() as Array<Subscriber>;
      const [subscriber] = body;
      subscribers.set(subscriber.email, subscriber);
      await fulfillJson(route, body);
      return;
    }

    if (method === "PATCH") {
      const emailFilter = url.searchParams.get("email");
      const email = emailFilter?.split("eq.")[1] ?? "";
      const body = (request.postDataJSON() as Partial<Subscriber>) ?? {};
      const existing = subscribers.get(email);

      if (!existing) {
        await fulfillJson(route, []);
        return;
      }

      const updated = { ...existing, ...body };
      subscribers.set(email, updated);
      await fulfillJson(route, [updated]);
      return;
    }

    await route.fallback();
  });

  await page.route("**/rest/v1/newsletters*", async (route) => {
    await fulfillJson(route, newsletters);
  });

  await page.route("**/rest/v1/ss_articles*", async (route) => {
    await fulfillJson(route, articles);
  });
}
