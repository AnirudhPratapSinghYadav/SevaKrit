import { test, expect } from "@playwright/test";

const DESCRIPTION =
  "We are a Baiga family in Dindori; our house is kutcha, my mother does not work for the government, and I want to start keeping dairy animals.";

test("fresh browser: typed intake shows proposals and confirmation", async ({ page }) => {
  await page.goto("/intake");
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

test("results show published PM-JANMAN housing with needs-information when facts incomplete", async ({ page }) => {
  await page.goto("/results");
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible();
  await expect(page.getByText("PM-JANMAN rural housing").first()).toBeVisible();
  await expect(page.getByText("Needs information").first()).toBeVisible();
  await expect(page.getByText("No scheme is confirmed yet")).toHaveCount(0);

  await page.goto("/plan");
  await expect(page.getByText("PM-JANMAN rural housing").first()).toBeVisible();
});

test("citizen path: confirm sample facts, answer follow-ups, see likely fit", async ({ page }) => {
  await page.goto("/intake");
  await page.getByRole("button", { name: "Use the example" }).click();
  await page.getByRole("button", { name: "Read my description" }).click();
  await expect(page.getByText("Not confirmed yet").first()).toBeVisible();

  const confirms = page.getByRole("button", { name: "Confirm" });
  const count = await confirms.count();
  for (let i = 0; i < count; i += 1) {
    await page.getByRole("button", { name: "Confirm" }).first().click();
  }

  await expect(page.getByText("Follow-up questions")).toBeVisible();
  // Answer remaining published-rule facts with typed values.
  const govt = page.getByLabel(/government employee/i);
  if (await govt.count()) {
    await govt.fill("No");
    await page.getByRole("button", { name: "Confirm answer" }).first().click();
  }
  const settlement = page.getByLabel(/rural or urban/i);
  if (await settlement.count()) {
    await settlement.fill("rural");
    await page.getByRole("button", { name: "Confirm answer" }).first().click();
  }

  await page.getByRole("link", { name: "See results" }).click();
  await expect(page.getByText("Likely fit").first()).toBeVisible();
  await expect(page.getByText("PM-JANMAN rural housing").first()).toBeVisible();
  await page.getByText("Rule trace").first().click();
  await expect(page.getByText(/Met:/).first()).toBeVisible();
});

test("privacy page is reachable", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading").first()).toBeVisible();
  await expect(page.getByText("Page not found")).toHaveCount(0);
});

test("review page is read-only", async ({ page }) => {
  await page.goto("/review");
  await expect(page.getByText("Editing is disabled in this demo").first()).toBeVisible();
  await expect(page.locator("main").getByRole("button")).toHaveCount(0);
});

test("mobile 360px has no horizontal overflow on intake", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/intake");
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(360);
});

test("no console errors on intake", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await page.goto("/intake");
  await page.getByLabel("Tell us about your household in your own words").fill(DESCRIPTION);
  await page.getByRole("button", { name: "Read my description" }).click();
  await expect(page.getByText("Not confirmed yet").first()).toBeVisible();

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
