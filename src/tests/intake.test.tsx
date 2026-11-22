import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AppStateProvider } from "../context/AppState";
import Intake from "../pages/Intake";

// Synthetic example text, matching the product brief.
const EXAMPLE =
  "We are a Baiga family in Dindori; our house is kutcha, my mother does not work for the government, and I want to start keeping dairy animals.";

function renderIntake() {
  return render(
    <MemoryRouter>
      <AppStateProvider>
        <Intake />
      </AppStateProvider>
    </MemoryRouter>,
  );
}

describe("Intake", () => {
  it("shows proposals after reading the description, and confirms nothing until Confirm is clicked", () => {
    renderIntake();

    fireEvent.change(screen.getByLabelText("Tell us about your household in your own words"), { target: { value: EXAMPLE } });
    fireEvent.click(screen.getByRole("button", { name: "Read my description" }));

    expect(screen.getAllByText(/Baiga/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dindori/).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: "Confirm" }).length).toBeGreaterThan(0);
    expect(screen.queryByText("Confirmed details")).toBeNull();
    expect(screen.queryByText("Follow-up questions")).toBeNull();

    fireEvent.click(screen.getAllByRole("button", { name: "Confirm" })[0]!);
    expect(screen.getByText("Confirmed details")).toBeTruthy();
  });

  it("fills the example without submitting", () => {
    renderIntake();
    fireEvent.click(screen.getByRole("button", { name: "Use the example" }));
    expect(screen.queryByText("Details we found")).toBeNull();
    expect((screen.getByLabelText("Tell us about your household in your own words") as HTMLTextAreaElement).value).toBe(EXAMPLE);
  });

  it("refuses a description that looks like an identity number", () => {
    renderIntake();
    fireEvent.change(screen.getByLabelText("Tell us about your household in your own words"), {
      target: { value: "Baiga family in Dindori, Aadhaar 1234 5678 9012" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Read my description" }));
    expect(screen.getByRole("status").textContent).toContain("Remove it");
    expect(screen.queryByText("Details we found")).toBeNull();
  });

  it("shows a message for empty input", () => {
    renderIntake();
    fireEvent.click(screen.getByRole("button", { name: "Read my description" }));
    expect(screen.getByRole("status").textContent).toContain("Please describe your household");
  });

  it("offers Yes / No / I don't know for government-employee follow-up", () => {
    renderIntake();
    fireEvent.click(screen.getByRole("button", { name: "Use the example" }));
    fireEvent.click(screen.getByRole("button", { name: "Read my description" }));
    while (screen.queryAllByRole("button", { name: "Confirm" }).length > 0) {
      fireEvent.click(screen.getAllByRole("button", { name: "Confirm" })[0]!);
    }
    expect(screen.getByText("Follow-up questions")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Rural" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Urban" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Rural" }));
    expect(screen.getByText("Your answer: rural")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Yes" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /^No$/ })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "I don't know" }));
    expect(screen.getByText("Your answer: I don't know")).toBeTruthy();
  });
});
