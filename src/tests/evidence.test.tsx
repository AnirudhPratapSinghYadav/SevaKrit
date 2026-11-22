import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RuleTrace from "../components/RuleTrace";
import SourceCard from "../components/SourceCard";
import { evaluateSchemeDetailed } from "../domain/evaluate";
import { allSources, NOW, ruleVersion, standardRules, syntheticScheme, verifiedSource } from "./fixtures";

describe("SourceCard", () => {
  it("renders the status text and an external link with the correct href and rel", () => {
    render(
      <SourceCard
        authority={verifiedSource.publisher}
        url={verifiedSource.url}
        status={verifiedSource.status}
        verifiedOn="2025-05-01"
      />,
    );
    expect(screen.getByText("Status: verified")).toBeTruthy();
    const link = screen.getByRole("link", { name: "Open official source" });
    expect(link.getAttribute("href")).toBe(verifiedSource.url);
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("shows 'Human verification date not recorded' when no verification date exists", () => {
    render(
      <SourceCard
        authority={verifiedSource.publisher}
        url={verifiedSource.url}
        status={verifiedSource.status}
        verifiedOn={null}
      />,
    );
    expect(screen.getByText("Human verification date not recorded")).toBeTruthy();
  });
});

describe("RuleTrace unanswered facts", () => {
  it("shows 'Not answered' for a rule whose fact has not been confirmed", () => {
    const detail = evaluateSchemeDetailed(
      syntheticScheme,
      ruleVersion(standardRules()),
      { confirmedFacts: {}, unknownFacts: [] },
      allSources,
      NOW,
    );
    render(<RuleTrace results={detail.results} />);
    expect(screen.getAllByRole("cell", { name: "Not answered" }).length).toBeGreaterThan(0);
  });
});
