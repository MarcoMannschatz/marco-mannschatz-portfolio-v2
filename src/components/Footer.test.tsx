import { render, screen } from "@testing-library/react";
import { Router } from "wouter";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import Footer from "./Footer";

function renderFooter() {
  return render(
    <Router>
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    </Router>
  );
}

describe("Footer", () => {
  it("zeigt Name, Tagline und das aktuelle Jahr im Copyright", () => {
    renderFooter();
    expect(screen.getByText("Marco Mannschatz")).toBeInTheDocument();
    expect(screen.getByText("Design · Marketing · Creative Strategy")).toBeInTheDocument();
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it("verlinkt Impressum und Datenschutz", () => {
    renderFooter();
    expect(screen.getByRole("link", { name: "Impressum" })).toHaveAttribute("href", "/impressum");
    expect(screen.getByRole("link", { name: "Datenschutz" })).toHaveAttribute("href", "/datenschutz");
  });
});
