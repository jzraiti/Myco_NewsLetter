import { expect, test } from "./support/publicJourneyTest";

test("visitor can browse and search JUFO rankings without browser CSV requests", async ({ page }) => {
  const requestedUrls: string[] = [];
  page.on("request", (request) => {
    requestedUrls.push(request.url());
  });

  await page.goto("/jufo");

  await expect(page.getByRole("heading", { name: /publication rankings/i }).first()).toBeVisible();
  await expect(page.getByText("Fixture Publication 01")).toBeVisible();
  expect(requestedUrls.some((url) => url.includes("jfp-export2025.csv"))).toBe(false);

  await page.getByRole("link", { name: "Next" }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByText("Fixture Publication 51")).toBeVisible();

  const searchInput = page.getByPlaceholder("Search publications...");
  await searchInput.fill("Fixture Publication 11");

  await expect(page).toHaveURL(/q=Fixture\+Publication\+11/);
  await expect(page.getByText("Fixture Publication 11")).toBeVisible();
  await expect(page.getByText("Fixture Publication 01")).toBeHidden();
});
