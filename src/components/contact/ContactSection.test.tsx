import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import ContactSection from "./ContactSection";

function renderContact() {
  return render(
    <LanguageProvider>
      <ContactSection />
    </LanguageProvider>
  );
}

describe("ContactSection", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("zeigt die E-Mail-Adresse als mailto-Link", () => {
    renderContact();
    const link = screen.getByRole("link", { name: /hallo@marcomannschatz\.de/i });
    expect(link).toHaveAttribute("href", "mailto:hallo@marcomannschatz.de");
  });

  it("verhindert Absenden ohne DSGVO-Zustimmung (Submit-Button bleibt disabled)", async () => {
    const user = userEvent.setup();
    renderContact();
    await user.type(screen.getByPlaceholderText("Name *"), "Test Person");
    await user.type(screen.getByPlaceholderText("E-Mail *"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Ihre Nachricht *"), "Testnachricht");
    expect(screen.getByRole("button", { name: /nachricht senden/i })).toBeDisabled();
  });

  it("sendet bei ausgefülltem Formular + Zustimmung an /api/contact und zeigt die Erfolgsmeldung", async () => {
    const user = userEvent.setup();
    renderContact();
    await user.type(screen.getByPlaceholderText("Name *"), "Test Person");
    await user.type(screen.getByPlaceholderText("E-Mail *"), "test@example.com");
    await user.type(screen.getByPlaceholderText("Ihre Nachricht *"), "Testnachricht");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /nachricht senden/i }));

    expect(fetch).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Test Person", email: "test@example.com", subject: undefined, message: "Testnachricht" }),
      })
    );
    expect(await screen.findByText("Nachricht gesendet!")).toBeInTheDocument();
  });
});
