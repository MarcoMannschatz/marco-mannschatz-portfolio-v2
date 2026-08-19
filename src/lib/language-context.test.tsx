import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { LanguageProvider, useLanguage } from "./language-context";

function Probe() {
  const { lang, setLang, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="text">{t("Hallo", "Hello")}</span>
      <button onClick={() => setLang(lang === "de" ? "en" : "de")}>toggle</button>
    </div>
  );
}

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("startet standardmäßig auf Deutsch", () => {
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    expect(screen.getByTestId("lang")).toHaveTextContent("de");
    expect(screen.getByTestId("text")).toHaveTextContent("Hallo");
  });

  it("wechselt bei setLang auf Englisch und persistiert in localStorage", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Probe />
      </LanguageProvider>
    );
    await user.click(screen.getByText("toggle"));
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("text")).toHaveTextContent("Hello");
    expect(localStorage.getItem("lang")).toBe("en");
  });
});
