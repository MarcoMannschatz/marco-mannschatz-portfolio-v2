import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import HeroSection from "./HeroSection";

function renderHero() {
  return render(
    <LanguageProvider>
      <HeroSection />
    </LanguageProvider>
  );
}

describe("HeroSection", () => {
  it("zeigt den Namen als zweizeilige Headline", () => {
    renderHero();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Marco Mannschatz");
  });

  it("verlinkt den CV-Download direkt auf die statische PDF-Datei", () => {
    renderHero();
    const link = screen.getByRole("link", { name: /cv download/i });
    expect(link).toHaveAttribute("href", "/cv/Lebenslauf_MARCO_MANNSCHATZ.pdf");
    expect(link).toHaveAttribute("download");
  });

  it("zeigt das Porträt in Graustufen", () => {
    renderHero();
    const img = screen.getByAltText("Marco Mannschatz");
    expect(img).toHaveClass("grayscale");
  });
});
