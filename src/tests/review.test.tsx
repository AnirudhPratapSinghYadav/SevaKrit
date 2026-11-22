import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../i18n/Language";
import Review from "../pages/Review";

function renderReview() {
  return renderToStaticMarkup(
    <LanguageProvider>
      <MemoryRouter>
        <AuthProvider>
          <Review />
        </AuthProvider>
      </MemoryRouter>
    </LanguageProvider>,
  );
}

describe("Review reviewer panel", () => {
  const html = renderReview();

  it("explains that reviewer auth needs Supabase configuration when unset", () => {
    expect(html).toMatch(/Reviewer sign-in unavailable|Sign-in is unavailable/i);
    expect(html).toContain("VITE_SUPABASE");
  });

  it("does not render a fake local admin credential form", () => {
    expect(html).not.toContain('type="password"');
    expect(html).not.toContain("isAdmin");
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
