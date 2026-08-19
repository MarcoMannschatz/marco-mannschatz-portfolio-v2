import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import Header from "./Header";

function renderHeader() {
  return render(
    <LanguageProvider>
      <Header />
    </LanguageProvider>
  );
}

describe("Header", () => {
  it("zeigt alle vier Navigationslinks auf Deutsch", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "Über mich" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Lebenslauf" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Arbeiten" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Kontakt" })).toBeInTheDocument();
  });

  it("wechselt die Sprache über den Globe-Button auf Englisch", async () => {
    const user = userEvent.setup();
    renderHeader();
    const langButtons = screen.getAllByRole("button", { name: /switch language/i });
    await user.click(langButtons[0]);
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("öffnet das mobile Vollbildmenü per Hamburger-Button", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: /menü öffnen/i }));
    expect(screen.getByRole("button", { name: /menü schließen/i })).toBeInTheDocument();
  });
});
