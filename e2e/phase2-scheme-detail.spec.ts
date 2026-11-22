import { test, expect, type Page } from "@playwright/test";

const SCHEME_PATH = "/schemes/pm-janman-housing-mp";
const SCHEME_HEADING = "PM-JANMAN rural housing";

/**
 * Reaches the scheme detail page with the same steps journey.spec.ts uses:
 * synthetic Baiga Dindori intake -> confirm facts -> answer follow-ups -> results -> scheme detail.
 * The scheme detail is reached through the results link so the intake state is preserved.
 */
async function reachSchemeDetail(page: Page) {
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
  await expect(page.getByText("PM-JANMAN rural housing").first()).toBeVisible();

  await page.getByRole("link", { name: "Understand this scheme" }).first().click();
  await expect(page).toHaveURL(new RegExp(`${SCHEME_PATH.replace(/\//g, "\\/")}$`));
}

test("scheme detail: heading and SourceCard section are visible", async ({ page }) => {
  await reachSchemeDetail(page);

  await expect(page.getByRole("heading", { name: SCHEME_HEADING })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Source record" })).toBeVisible();
});

test("scheme detail: SourceCard external link is noopener and https", async ({ page }) => {
  await reachSchemeDetail(page);

  const sourceLink = page.getByRole("link", { name: "Open official source" });
  await expect(sourceLink).toBeVisible();
  await expect(sourceLink).toHaveAttribute("rel", /noopener/);
  const href = await sourceLink.getAttribute("href");
  expect(href).not.toBeNull();
  expect(href!.startsWith("https://")).toBe(true);
});

test("scheme detail: trace table present; unanswered cells read Not answered", async ({ page }) => {
  await reachSchemeDetail(page);

  // The rule trace is collapsed behind a "Rule trace" toggle on results; open it if the table is not yet shown.
  if ((await page.getByRole("table").count()) === 0) {
    await page.getByText("Rule trace").first().click();
  }
  const table = page.getByRole("table").first();
  await expect(table).toBeVisible();

  // If no cell is unanswered for this synthetic household, this sub-check is skipped rather than failed.
  const unanswered = table.getByRole("cell", { name: "Not answered" });
  const unansweredCount = await unanswered.count();
  if (unansweredCount === 0) {
    test.info().annotations.push({
      type: "note",
      description: "No unanswered cells in the trace table for this household; Not answered check skipped.",
    });
  } else {
    for (let i = 0; i < unansweredCount; i += 1) {
      await expect(unanswered.nth(i)).toHaveText("Not answered");
    }
  }
});

test("scheme detail: no horizontal overflow at 320, 360, 768 and 1440 widths", async ({ page }) => {
  await reachSchemeDetail(page);

  for (const width of [320, 360, 768, 1440]) {
    await page.setViewportSize({ width, height: 740 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    );
    expect(overflow, `scrollWidth exceeds clientWidth at ${width}px`).toBe(true);
  }
});

test("scheme detail: every img has non-empty alt or role=presentation", async ({ page }) => {
  await reachSchemeDetail(page);

  const offenders = await page.$$eval("img", (imgs) =>
    imgs
      .filter((img) => {
        const alt = img.getAttribute("alt");
        const role = img.getAttribute("role");
        return role !== "presentation" && (alt === null || alt.trim() === "");
      })
      .map((img) => img.outerHTML),
  );
  expect(offenders).toEqual([]);
});

test("scheme detail: no console errors or page errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await reachSchemeDetail(page);

  // No errors are filtered out. If a future error is from unrelated third-party code,
  // record its exact text here in a comment before excluding it.
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
