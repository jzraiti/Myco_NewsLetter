import { expect, test } from "./support/publicJourneyTest";

test("visitor can browse and search research articles", async ({ page }) => {
  await page.goto("/articles");

  await expect(page.getByText("Mycorrhiza strengthen drought resilience")).toBeVisible();
  await expect(page.getByText("Fungal decomposition accelerates carbon cycling")).toBeVisible();

  const searchInput = page.getByPlaceholder("Search articles...");
  await searchInput.fill("Mycorrhiza");

  await expect(page.getByText("Mycorrhiza strengthen drought resilience")).toBeVisible();
  await expect(page.getByText("Fungal decomposition accelerates carbon cycling")).toBeHidden();

  await searchInput.fill("zzzz");

  await expect(page.getByText("No articles found matching your search.")).toBeVisible();
});
