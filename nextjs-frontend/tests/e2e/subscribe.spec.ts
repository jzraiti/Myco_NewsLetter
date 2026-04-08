import { expect, test } from "./support/publicJourneyTest";

test("visitor can subscribe from the home page", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Enter your email").fill("new-reader@example.com");
  await page.getByRole("button", { name: "Subscribe" }).click();

  await expect(page.getByText("Thanks for subscribing!")).toBeVisible();
});

test("existing reader sees already subscribed feedback", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Enter your email").fill("existing@example.com");
  await page.getByRole("button", { name: "Subscribe" }).click();

  await expect(page.getByText("You are already subscribed!")).toBeVisible();
});
