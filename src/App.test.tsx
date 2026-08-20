import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("rendert die Startseite mit Hero-Headline unter '/'", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Marco Mannschatz");
  });

  it("rendert das Impressum unter '/impressum'", () => {
    window.history.pushState({}, "", "/impressum");
    render(<App />);
    expect(screen.getByRole("heading", { name: "Impressum" })).toBeInTheDocument();
  });
});
