import { test, expect } from "@playwright/test";

const DESCRIPTION =
  "We are a Baiga family in Dindori; our house is kutcha, my mother does not work for the government, and I want to start keeping dairy animals.";

async function confirmLikelyFit(page: import("@playwright/test").Page) {
  await page.goto("/discover");
  await page.getByRole("button", { name: "Use the example" }).click();
  await page.getByRole("button", { name: "Read my description" }).click();
  const confirms = page.getByRole("button", { name: "Confirm" });
  const count = await confirms.count();
  for (let i = 0; i < count; i += 1) {
    await page.getByRole("button", { name: "Confirm" }).first().click();
  }
  await page.getByRole("button", { name: "Rural", exact: true }).click();
  await page.getByRole("button", { name: "No", exact: true }).click();
  await page.goto("/results");
  await expect(page.getByText("Likely fit").first()).toBeVisible();
}

test("login guest enters workspace", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Continue as guest" }).click();
  await expect(page).toHaveURL(/\/workspace/);
  await expect(page.getByRole("heading", { name: /Start from what you know/i })).toBeVisible();
});

test("HaqCompass compares confirmed vs hypothetical without saving", async ({ page }) => {
  await confirmLikelyFit(page);
  await page.goto("/tools/compass");
  await expect(page.getByRole("heading", { name: "HaqCompass" })).toBeVisible();
  await page.locator("#compass-house").selectOption("pucca");
  await expect(page.getByText("What-if result").first()).toBeVisible();
  await expect(page.getByText("Likely mismatch").first()).toBeVisible();
  await page.goto("/discover");
  // Hypothetical pucca must not overwrite saved confirmed answers.
  await expect(page.getByText(/House type\s*:\s*kutcha/i).first()).toBeVisible();
  await expect(page.getByText(/House type\s*:\s*pucca/i)).toHaveCount(0);
});

test("HaqPocket public page has no household answers", async ({ page }) => {
  await page.goto("/public/schemes/pm-janman-housing-mp");
  await expect(page.getByText("does not contain any household answers")).toBeVisible();
  await expect(page.getByRole("heading", { name: /PM-JANMAN/i })).toBeVisible();
  await expect(page.getByText(DESCRIPTION)).toHaveCount(0);
});

test("SevaRoute and HaqResolve pages load from plan tools", async ({ page }) => {
  await confirmLikelyFit(page);
  await page.goto("/tools/route");
  await expect(page.getByRole("heading", { name: "SevaRoute" })).toBeVisible();
  await expect(page.getByText(/not invented|Verification needed/i).first()).toBeVisible();
  await page.goto("/tools/resolve");
  await expect(page.getByRole("heading", { name: "HaqResolve" })).toBeVisible();
  await expect(page.getByText(/does not access government application status/i).first()).toBeVisible();
});

test("HaqWatch is on-demand comparison, not automatic alerts", async ({ page }) => {
  await confirmLikelyFit(page);
  await page.goto("/tools/watch");
  await expect(page.getByRole("heading", { name: "HaqWatch" })).toBeVisible();
  await expect(page.getByText(/does not send automatic alerts/i)).toBeVisible();
  await page.getByRole("button", { name: /Remember current rule versions/i }).click();
  await expect(page.getByText(/matches the latest published version|No earlier watched/i).first()).toBeVisible();
});
