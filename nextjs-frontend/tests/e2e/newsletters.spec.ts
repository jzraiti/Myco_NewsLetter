import { expect, test } from "./support/publicJourneyTest";

test("visitor can browse the newsletter archive with paginated URLs", async ({ page }) => {
  await page.goto("/newsletters?page=2");

  await expect(page.getByRole("heading", { name: /previous newsletters/i })).toBeVisible();
  await expect(page.getByText("Page 2 of 2")).toBeVisible();

  const newsletterLink = page.getByRole("link", { name: /view newsletter/i }).first();
  await expect(newsletterLink).toHaveAttribute("href", "https://example.com/newsletters/2026-03-08");
  await expect(page.getByRole("link", { name: /view newsletter/i }).first()).not.toHaveAttribute(
    "href",
    "https://example.com/newsletters/2026-03-20",
  );
});

test("visitor gets a valid newsletter page when the URL page is out of range", async ({ page }) => {
  await page.goto("/newsletters?page=999");

  await expect(page).toHaveURL(/\/newsletters\?page=2/);
  await expect(page.getByText("Page 2 of 2")).toBeVisible();
  await expect(page.getByRole("link", { name: /view newsletter/i }).first()).toHaveAttribute(
    "href",
    "https://example.com/newsletters/2026-03-08",
  );
});

test("visitor gets a canonical newsletter URL when the page param is invalid", async ({ page }) => {
  await page.goto("/newsletters?page=abc");

  await expect(page).toHaveURL("/newsletters");
  await expect(page.getByText("Page 1 of 2")).toBeVisible();
  await expect(page.getByRole("link", { name: /view newsletter/i }).first()).toHaveAttribute(
    "href",
    "https://example.com/newsletters/2026-03-20",
  );
});
