import { Page, Route } from "@playwright/test";

type Subscriber = {
  email: string;
  is_subscribed: boolean;
};

const subscribers = new Map<string, Subscriber>([
  ["existing@example.com", { email: "existing@example.com", is_subscribed: true }],
  ["archived@example.com", { email: "archived@example.com", is_subscribed: false }],
]);

const newsletters = [
  {
    id: 1,
    created_at: "2026-03-20T12:00:00.000Z",
    link: "https://example.com/newsletters/2026-03-20",
  },
];

const articles = [
  {
    id: 1,
    title: "Mycorrhiza strengthen drought resilience",
    llm_summary: "Mycorrhiza partnerships help plants tolerate dry conditions.",
    venue: "Nature Ecology",
    publicationDate: "2026-03-12",
    Level: 2,
    panels: 1,
    url: "https://example.com/article-1",
  },
  {
    id: 2,
    title: "Fungal decomposition accelerates carbon cycling",
    llm_summary: "Wood decay fungi rapidly recycle forest carbon stores.",
    venue: "Fungal Biology",
    publicationDate: "2026-03-08",
    Level: 1,
    panels: 2,
    url: "https://example.com/article-2",
  },
];

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
  await page.route("**/rest/v1/recipients*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();

    if (method === "GET" && request.headers()["prefer"]?.includes("count=exact")) {
      await fulfillJson(route, null, { "content-range": `0-0/${subscribers.size}` });
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
