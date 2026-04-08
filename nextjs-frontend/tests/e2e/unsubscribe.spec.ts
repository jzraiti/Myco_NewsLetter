import { expect, test } from "./support/publicJourneyTest";

test("visitor can unsubscribe from the public unsubscribe page", async ({ page }) => {
  await page.goto("/unsubscribe");
  await page.getByPlaceholder("Enter your email").fill("existing@example.com");
  await page.getByRole("button", { name: "Unsubscribe" }).click();

  await expect(page.getByText("Unsubscribed successfully!")).toBeVisible();
});

test("missing email shows not found feedback on unsubscribe", async ({ page }) => {
  await page.goto("/unsubscribe");
  await page.getByPlaceholder("Enter your email").fill("missing@example.com");
  await page.getByRole("button", { name: "Unsubscribe" }).click();

  await expect(page.getByText("Email not found")).toBeVisible();
});
