import { test, expect } from "@playwright/test";

const DESCRIPTION =
  "We are a Baiga family in Dindori; our house is kutcha, my mother does not work for the government, and I want to start keeping dairy animals.";

test("fresh browser: typed intake shows proposals and confirmation", async ({ page }) => {
  await page.goto("/discover");
  await page.getByLabel("Tell us about your household in your own words").fill(DESCRIPTION);
  await page.getByRole("button", { name: "Read my description" }).click();

  await expect(page.getByText("Baiga").first()).toBeVisible();
  await expect(page.getByText("Dindori").first()).toBeVisible();
  await expect(page.getByText("Not confirmed yet").first()).toBeVisible();

  const confirmButton = page.getByRole("button", { name: "Confirm" }).first();
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();
  await expect(page.getByText("Confirmed details").first()).toBeVisible();
});

test("results show needs-information when facts incomplete; plan stays empty", async ({ page }) => {
  await page.goto("/results");
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
  await expect(page.getByText("PM-JANMAN rural housing").first()).toBeVisible();
  await expect(page.getByText("Needs information").first()).toBeVisible();
  await expect(page.getByText("No scheme is confirmed yet")).toHaveCount(0);

  await page.goto("/plan");
  await expect(page.getByText("No likely-fit schemes for your confirmed answers yet").first()).toBeVisible();
  await expect(page.getByText("PM-JANMAN rural housing")).toHaveCount(0);
});

test("citizen path: confirm sample facts, answer follow-ups, likely fit + scheme detail", async ({ page }) => {
  await page.goto("/discover");
  await page.getByRole("button", { name: "Use the example" }).click();
  await page.getByRole("button", { name: "Read my description" }).click();
  await expect(page.getByText("Not confirmed yet").first()).toBeVisible();

  const confirms = page.getByRole("button", { name: "Confirm" });
  const count = await confirms.count();
  for (let i = 0; i < count; i += 1) {
    await page.getByRole("button", { name: "Confirm" }).first().click();
  }

  await expect(page.getByText("Follow-up questions")).toBeVisible();
  await page.getByRole("button", { name: "Rural", exact: true }).click();
  await page.getByRole("button", { name: "No", exact: true }).click();

  await page.getByRole("link", { name: "See results" }).click();
  await expect(page.getByText("Likely fit").first()).toBeVisible();
  await expect(page.getByText("PM-JANMAN rural housing").first()).toBeVisible();
  await page.getByText("Rule trace").first().click();
  await expect(page.getByRole("cell", { name: "Met", exact: true }).first()).toBeVisible();

  await page.getByRole("link", { name: "Understand this scheme" }).first().click();
  await expect(page).toHaveURL(/\/schemes\/pm-janman-housing-mp$/);
  await expect(page.getByRole("heading", { name: "PM-JANMAN rural housing" })).toBeVisible();
  await expect(page.getByText("Eligibility evidence")).toBeVisible();

  await page.getByRole("link", { name: "Open my plan" }).click();
  await expect(page).toHaveURL(/\/plan$/);
  await expect(page.getByText("PM-JANMAN rural housing").first()).toBeVisible();
  await expect(page.getByText("Result: likely fit").first()).toBeVisible();
});

test("/intake redirects to /discover", async ({ page }) => {
  await page.goto("/intake");
  await expect(page).toHaveURL(/\/discover$/);
  await expect(page.getByRole("heading", { name: "Describe your household" })).toBeVisible();
});

test("privacy page is reachable", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading").first()).toBeVisible();
  await expect(page.getByText("Page not found")).toHaveCount(0);
});

test("review page is read-only", async ({ page }) => {
  await page.goto("/review");
  await expect(page.getByText("Sign-in is unavailable").first()).toBeVisible();
  await expect(page.locator("main").getByRole("button")).toHaveCount(0);
});

test("mobile 360px has no horizontal overflow on discover", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/discover");
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);
});

test("no console errors on discover", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await page.goto("/discover");
  await page.getByLabel("Tell us about your household in your own words").fill(DESCRIPTION);
  await page.getByRole("button", { name: "Read my description" }).click();
  await expect(page.getByText("Not confirmed yet").first()).toBeVisible();

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
