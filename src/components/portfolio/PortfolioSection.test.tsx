import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import PortfolioSection from "./PortfolioSection";

function renderPortfolio() {
  return render(
    <LanguageProvider>
      <PortfolioSection />
    </LanguageProvider>
  );
}

describe("PortfolioSection", () => {
  it("zeigt alle 5 Kategorien in der Übersicht", () => {
    renderPortfolio();
    expect(screen.getByText("Sportschau Social")).toBeInTheDocument();
    expect(screen.getByText("Sportschau TV")).toBeInTheDocument();
    expect(screen.getByText("Fubble")).toBeInTheDocument();
    expect(screen.getByText("Print")).toBeInTheDocument();
    expect(screen.getByText("Die Gedanken sind frei")).toBeInTheDocument();
  });

  it("öffnet bei Print direkt die flache Galerie (keine Kunden)", async () => {
    const user = userEvent.setup();
    renderPortfolio();
    await user.click(screen.getByText("Print"));
    expect(await screen.findByAltText("Black Saturday Saarlouis – City-Light-Plakat")).toBeInTheDocument();
  });

  it("öffnet bei Fubble zuerst das Kunden-Grid, dann die Kunden-Galerie", async () => {
    const user = userEvent.setup();
    renderPortfolio();
    await user.click(screen.getByText("Fubble"));
    expect(await screen.findByText("Kalkhoff")).toBeInTheDocument();
    await user.click(screen.getByText("Kalkhoff"));
    expect((await screen.findAllByAltText(/Kalkhoff/)).length).toBeGreaterThan(0);
  });

  it("Zurück-Button in der Kategorie-Galerie führt zur Übersicht zurück", async () => {
    const user = userEvent.setup();
    renderPortfolio();
    await user.click(screen.getByText("Print"));
    await user.click(await screen.findByText("Zurück zur Übersicht"));
    expect(await screen.findByText("Sportschau Social")).toBeInTheDocument();
  });

  it("öffnet die Lightbox beim Klick auf ein Medium und zeigt die Position", async () => {
    const user = userEvent.setup();
    renderPortfolio();
    await user.click(screen.getByText("Print"));
    await user.click(await screen.findByAltText("Knock-Out Charity Part 1 – Event-Broschüre"));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });
});
