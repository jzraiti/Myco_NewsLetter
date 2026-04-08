import { expect, test } from "./support/publicJourneyTest";

test("visitor can browse the newsletter archive", async ({ page }) => {
  await page.goto("/newsletters");

  await expect(page.getByRole("heading", { name: /previous newsletters/i })).toBeVisible();

  const newsletterLink = page.getByRole("link", { name: /view newsletter/i });
  await expect(newsletterLink).toBeVisible();
  await expect(newsletterLink).toHaveAttribute(
    "href",
    "https://example.com/newsletters/2026-03-20",
  );
});
