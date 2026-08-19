import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import CVSection from "./CVSection";

describe("CVSection", () => {
  it("zeigt alle 5 Berufsstationen und den PDF-Download-Link", () => {
    render(
      <LanguageProvider>
        <CVSection />
      </LanguageProvider>
    );
    expect(screen.getByText("WDR / Sportschau")).toBeInTheDocument();
    expect(screen.getAllByText("Fubble.de")).toHaveLength(2);
    expect(screen.getByText("Monin Deutschland")).toBeInTheDocument();
    const downloadLink = screen.getByRole("link", { name: /pdf herunterladen/i });
    expect(downloadLink).toHaveAttribute("href", "/cv/Lebenslauf_MARCO_MANNSCHATZ.pdf");
  });

  it("zeigt Ausbildung, Skills und Sprachen", () => {
    render(
      <LanguageProvider>
        <CVSection />
      </LanguageProvider>
    );
    expect(screen.getByText("Diplom — Kommunikationsdesign")).toBeInTheDocument();
    expect(screen.getByText("Adobe Creative Suite")).toBeInTheDocument();
    expect(screen.getByText("Deutsch")).toBeInTheDocument();
  });
});
