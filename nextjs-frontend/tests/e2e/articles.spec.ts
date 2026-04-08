import { expect, test } from "./support/publicJourneyTest";

test("visitor can browse and search research articles with paginated URLs", async ({ page }) => {
  await page.goto("/articles?page=2");

  await expect(page.getByText("Page 2 of 2")).toBeVisible();
  await expect(page.getByText("Fixture Article 15")).toBeVisible();
  await expect(page.getByText("Mycorrhiza strengthen drought resilience")).not.toBeVisible();

  const searchInput = page.getByPlaceholder("Search articles...");
  await searchInput.fill("Mycorrhiza");

  await expect(page).toHaveURL(/\/articles\?page=1&q=Mycorrhiza/);
  await expect(page.getByText("Mycorrhiza strengthen drought resilience")).toBeVisible();
  await expect(page.getByText("Page 1 of 1")).toBeVisible();
});

test("visitor gets a valid article page when the URL page is out of range", async ({ page }) => {
  await page.goto("/articles?page=999");

  await expect(page).toHaveURL(/\/articles\?page=2/);
  await expect(page.getByText("Page 2 of 2")).toBeVisible();
  await expect(page.getByText("Fixture Article 15")).toBeVisible();
});

test("visitor gets a canonical article URL when the page param is invalid", async ({ page }) => {
  await page.goto("/articles?page=abc&q=Mycorrhiza");

  await expect(page).toHaveURL(/\/articles\?q=Mycorrhiza/);
  await expect(page.getByText("Page 1 of 1")).toBeVisible();
  await expect(page.getByText("Mycorrhiza strengthen drought resilience")).toBeVisible();
});
