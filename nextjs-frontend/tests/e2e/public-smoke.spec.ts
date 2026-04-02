import { expect, test } from "@playwright/test";

import { mockSupabase } from "./support/mockSupabase";

test.beforeEach(async ({ page }) => {
  await mockSupabase(page);
});

test("public smoke coverage for subscription and content pages", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Enter your email").fill("new-reader@example.com");
  await page.getByRole("button", { name: "Subscribe" }).click();
  await expect(page.getByText("Thanks for subscribing!")).toBeVisible();

  await page.goto("/unsubscribe");
  await page.getByPlaceholder("Enter your email").fill("existing@example.com");
  await page.getByRole("button", { name: "Unsubscribe" }).click();
  await expect(page.getByText("Unsubscribed successfully!")).toBeVisible();

  await page.goto("/newsletters");
  await expect(page.getByRole("heading", { name: /previous newsletters/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /view newsletter/i })).toBeVisible();

  await page.goto("/articles");
  await expect(page.getByText("Mycorrhiza strengthen drought resilience")).toBeVisible();
  await page.getByPlaceholder("Search articles...").fill("Mycorrhiza");
  await expect(page.getByText("Mycorrhiza strengthen drought resilience")).toBeVisible();
  await expect(page.getByText("Fungal decomposition accelerates carbon cycling")).toBeHidden();
});
