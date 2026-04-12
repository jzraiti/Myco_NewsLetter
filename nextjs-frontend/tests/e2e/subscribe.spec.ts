import { expect, test } from "./support/publicJourneyTest";

test("visitor can subscribe from the home page", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email address").fill("new-reader@example.com");
  await page.getByRole("button", { name: "Subscribe Free" }).click();

  await expect(page.getByText("Thanks for subscribing!")).toBeVisible();
});

test("existing reader sees already subscribed feedback", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Email address").fill("existing@example.com");
  await page.getByRole("button", { name: "Subscribe Free" }).click();

  await expect(page.getByText("You are already subscribed!")).toBeVisible();
});

test("subscribe form stays visible and actionable on a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByRole("button", { name: "Subscribe Free" })).toBeVisible();
});
