import { expect, test } from "./support/publicJourneyTest";

test("visitor can unsubscribe from the public unsubscribe page", async ({ page }) => {
  await page.goto("/unsubscribe");
  await page.getByLabel("Email address").fill("existing@example.com");
  await page.getByRole("button", { name: "Review unsubscribe" }).click();
  await page.getByRole("button", { name: "Confirm unsubscribe" }).click();

  await expect(page.getByText("Unsubscribed successfully!")).toBeVisible();
});

test("missing email shows not found feedback on unsubscribe", async ({ page }) => {
  await page.goto("/unsubscribe");
  await page.getByLabel("Email address").fill("missing@example.com");
  await page.getByRole("button", { name: "Review unsubscribe" }).click();
  await page.getByRole("button", { name: "Confirm unsubscribe" }).click();

  await expect(page.getByText("Email not found")).toBeVisible();
});

test("unsubscribe confirmation stays visible on a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/unsubscribe");
  await page.getByLabel("Email address").fill("existing@example.com");
  await page.getByRole("button", { name: "Review unsubscribe" }).click();

  await expect(page.getByText("Confirm unsubscribe for existing@example.com?")).toBeVisible();
  await expect(page.getByRole("button", { name: "Keep subscription" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Confirm unsubscribe" })).toBeVisible();
});
