import { describe, expect, it } from "vitest";
import { supabaseConfigured } from "../services/supabaseConfig";

describe("supabaseConfigured", () => {
  it("is false when the env is empty", () => {
    expect(supabaseConfigured({})).toBe(false);
  });

  it("is false when only the URL is set", () => {
    expect(supabaseConfigured({ VITE_SUPABASE_URL: "https://synthetic.example.test" })).toBe(false);
  });

  it("is false when only the anon key is set", () => {
    expect(supabaseConfigured({ VITE_SUPABASE_ANON_KEY: "synthetic-placeholder" })).toBe(false);
  });

  it("is false when both values are blank", () => {
    expect(supabaseConfigured({ VITE_SUPABASE_URL: "", VITE_SUPABASE_ANON_KEY: "  " })).toBe(false);
  });

  it("is true when both values are set", () => {
    expect(
      supabaseConfigured({
        VITE_SUPABASE_URL: "https://synthetic.example.test",
        VITE_SUPABASE_ANON_KEY: "synthetic-placeholder",
      }),
    ).toBe(true);
  });
});
