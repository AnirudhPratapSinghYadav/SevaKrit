import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ROUTES = ["/", "/intake", "/results", "/plan", "/privacy", "/review"] as const;
const VIEWPORTS = [
  { width: 320, height: 640 },
  { width: 360, height: 740 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
] as const;

const EXPECTED_TOKENS = [
  "--canvas",
  "--surface",
  "--surface-muted",
  "--ink",
  "--ink-soft",
  "--brand",
  "--brand-hover",
  "--border",
  "--accent-earth",
  "--accent-gold",
  "--success-ink",
  "--success-bg",
  "--warning-ink",
  "--warning-bg",
  "--mismatch-ink",
  "--mismatch-bg",
  "--error-ink",
  "--error-bg",
  "--info-ink",
  "--info-bg",
  "--radius-input",
  "--radius-card",
  "--radius-image",
  "--page-max",
  "--content-max",
] as const;

const SHOT_DIR = path.join("e2e-artifacts", "phase1");

async function collectDom(page: Page) {
  return page.evaluate(() => {
    const overflow = [...document.querySelectorAll("body *")]
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.right > window.innerWidth + 2;
      })
      .slice(0, 12)
      .map((el) => ({
        tag: el.tagName,
        className: typeof el.className === "string" ? el.className : "",
      }));

    return {
      title: document.title,
      lang: document.documentElement.lang,
      h1: [...document.querySelectorAll("h1")].map((el) => el.textContent?.trim() ?? ""),
      headings: [...document.querySelectorAll("h1,h2,h3")].map((el) => ({
        tag: el.tagName,
        text: el.textContent?.trim() ?? "",
      })),
      nav: [...document.querySelectorAll('nav[aria-label="Main"] a')].map((el) => ({
        text: el.textContent?.trim() ?? "",
        href: el.getAttribute("href"),
      })),
      landmarks: [...document.querySelectorAll("header,nav,main,footer")].map((el) => el.tagName),
      controls: [...document.querySelectorAll("button,input,select,textarea,a[href]")].map((el) => ({
        tag: el.tagName,
        text:
          el.getAttribute("aria-label") ||
          (el as HTMLElement).innerText?.trim().slice(0, 80) ||
          el.getAttribute("href") ||
          "",
        disabled: (el as HTMLButtonElement).disabled === true,
      })),
      images: [...document.querySelectorAll("img")].map((img) => ({
        alt: img.alt,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        currentSrc: img.currentSrc,
      })),
      overflow,
      mainId: document.getElementById("main-content")?.id ?? null,
    };
  });
}

test.describe("Phase 1 browser verification", () => {
  test.beforeAll(() => {
    fs.mkdirSync(SHOT_DIR, { recursive: true });
  });

  test("routes: DOM, console, network, CTAs", async ({ page }) => {
    const browserErrors: string[] = [];
    const httpFailures: string[] = [];
    page.on("pageerror", (err) => browserErrors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") browserErrors.push(msg.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400) {
        httpFailures.push(`${response.status()} ${response.url()}`);
      }
    });

    const audits: Record<string, Awaited<ReturnType<typeof collectDom>>> = {};

    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page.locator("#main-content")).toBeVisible();
      audits[route] = await collectDom(page);
      expect(audits[route].h1.length, `${route} should have exactly one H1`).toBe(1);
      expect(audits[route].overflow, `${route} overflow`).toEqual([]);
      expect(audits[route].landmarks).toContain("HEADER");
      expect(audits[route].landmarks).toContain("NAV");
      expect(audits[route].landmarks).toContain("MAIN");
      expect(audits[route].landmarks).toContain("FOOTER");
      await page.screenshot({
        path: path.join(SHOT_DIR, `route-${route === "/" ? "home" : route.slice(1)}.png`),
        fullPage: true,
      });
    }

    // CTA links from home
    await page.goto("/");
    await page.getByRole("link", { name: "Start with a description" }).click();
    await expect(page).toHaveURL(/\/intake$/);
    await page.goto("/");
    await page.getByRole("link", { name: "How your data is handled" }).click();
    await expect(page).toHaveURL(/\/privacy$/);

    // Nav links
    await page.goto("/");
    for (const item of [
      { name: "Describe household", path: "/intake" },
      { name: "Results", path: "/results" },
      { name: "Plan", path: "/plan" },
      { name: "Privacy", path: "/privacy" },
    ]) {
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: item.name }).click();
      await expect(page).toHaveURL(new RegExp(`${item.path}$`));
    }

    expect(browserErrors, `console/page errors: ${browserErrors.join(" | ")}`).toEqual([]);
    expect(httpFailures, `HTTP failures: ${httpFailures.join(" | ")}`).toEqual([]);

    fs.writeFileSync(path.join(SHOT_DIR, "dom-audit.json"), JSON.stringify(audits, null, 2));
  });

  test("viewports: overflow and screenshots", async ({ page }) => {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize(vp);
      for (const route of ROUTES) {
        await page.goto(route);
        const overflow = await page.evaluate(() =>
          [...document.querySelectorAll("body *")]
            .filter((el) => {
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.right > window.innerWidth + 2;
            })
            .slice(0, 8)
            .map((el) => el.tagName + "." + (typeof el.className === "string" ? el.className : "")),
        );
        expect(overflow, `${route} @ ${vp.width} overflow`).toEqual([]);
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollWidth, `${route} @ ${vp.width} scrollWidth`).toBeLessThanOrEqual(vp.width + 1);
      }
      await page.goto("/");
      await page.screenshot({
        path: path.join(SHOT_DIR, `home-${vp.width}.png`),
        fullPage: true,
      });
    }
  });

  test("skip link keyboard focus and activation", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    const visible = await skip.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        left: style.left,
        opacity: style.opacity,
        visibility: style.visibility,
        width: rect.width,
        height: rect.height,
        top: rect.top,
      };
    });
    expect(visible.width).toBeGreaterThan(0);
    expect(visible.height).toBeGreaterThan(0);
    expect(visible.visibility).not.toBe("hidden");
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("focus ring visible with brand contrast on keyboard controls", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/intake");
    const textarea = page.getByLabel("Tell us about your household in your own words");
    await textarea.focus();
    const focusStyles = await textarea.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const root = window.getComputedStyle(document.documentElement);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        outlineColor: style.outlineColor,
        brand: root.getPropertyValue("--brand").trim(),
      };
    });
    expect(focusStyles.outlineStyle).not.toBe("none");
    expect(Number.parseFloat(focusStyles.outlineWidth)).toBeGreaterThanOrEqual(2);
    expect(focusStyles.brand.toLowerCase()).toBe("#173b35");
    // Brand green outline on light canvas is high contrast (declared 12.26:1 white-on-brand; ring uses brand).
    expect(focusStyles.outlineColor.replace(/\s/g, "")).toMatch(/rgb\(23,\s*59,\s*53\)|#173b35/i);
  });

  test("24 design tokens applied in computed styles", async ({ page }) => {
    await page.goto("/");
    const tokenReport = await page.evaluate((names) => {
      const root = document.documentElement;
      const body = document.body;
      const rootStyle = window.getComputedStyle(root);
      const bodyStyle = window.getComputedStyle(body);
      const declared = Object.fromEntries(
        names.map((name) => [name, rootStyle.getPropertyValue(name).trim()]),
      );
      return {
        declared,
        bodyBackground: bodyStyle.backgroundColor,
        bodyColor: bodyStyle.color,
        skipOutline: (() => {
          const skip = document.querySelector(".skip-link");
          return skip ? window.getComputedStyle(skip).outlineColor : null;
        })(),
        mainUsesCanvas: (() => {
          const shell = document.querySelector(".bg-canvas") ?? document.body;
          return window.getComputedStyle(shell as Element).backgroundColor;
        })(),
      };
    }, [...EXPECTED_TOKENS]);

    for (const name of EXPECTED_TOKENS) {
      expect(tokenReport.declared[name], `${name} declared`).not.toBe("");
    }
    // Body must resolve canvas/ink-soft from tokens, not transparent/default.
    expect(tokenReport.bodyBackground.replace(/\s/g, "")).toBe("rgb(247,245,240)");
    expect(tokenReport.bodyColor.replace(/\s/g, "")).toBe("rgb(85,100,95)");
    expect(tokenReport.mainUsesCanvas.replace(/\s/g, "")).toBe("rgb(247,245,240)");

    fs.writeFileSync(path.join(SHOT_DIR, "token-audit.json"), JSON.stringify(tokenReport, null, 2));
  });
});
