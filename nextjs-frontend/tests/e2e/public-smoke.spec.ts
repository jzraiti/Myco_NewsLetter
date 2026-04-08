import { expect, test } from "./support/publicJourneyTest";

test("public smoke canary for the four public routes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /your weekly dose of mycology research/i })).toBeVisible();

  await page.goto("/unsubscribe");
  await expect(page.getByText("We are sad to see you go!")).toBeVisible();

  await page.goto("/newsletters");
  await expect(page.getByRole("heading", { name: /previous newsletters/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /view newsletter/i })).toBeVisible();

  await page.goto("/articles");
  await expect(page.getByRole("heading", { name: /research articles/i })).toBeVisible();
  await expect(page.getByText("Mycorrhiza strengthen drought resilience")).toBeVisible();
});
