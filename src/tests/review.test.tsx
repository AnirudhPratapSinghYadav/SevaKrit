import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Review from "../pages/Review";

describe("Review reviewer panel", () => {
  const html = renderToStaticMarkup(<Review />);

  it("explains that sign-in needs Supabase configuration", () => {
    expect(html).toContain("Sign-in is unavailable");
  });

  it("does not render a fake local admin form without Supabase", () => {
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("lists scheme ids and marks unverified dates as not verified", () => {
    expect(html).toContain("aahar-anudan");
    expect(html).toContain("not verified");
  });

  it("lists source ids with their checked status", () => {
    expect(html).toContain("mp-scheme-index");
    expect(html).toContain("not-yet-checked");
  });
});
