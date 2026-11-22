import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Home from "../pages/Home";

describe("Home page smoke test", () => {
  it("renders the headline at /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Home />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "You shouldn't need to know a scheme's name to find a way forward.",
      }),
    ).toBeInTheDocument();
  });
});

