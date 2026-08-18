import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("rendert den Namen Marco Mannschatz", () => {
    render(<App />);
    expect(screen.getByText("Marco Mannschatz")).toBeInTheDocument();
  });
});
