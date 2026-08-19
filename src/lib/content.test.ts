import { describe, expect, it } from "vitest";
import { content } from "./content";

describe("content", () => {
  it("enthält den Hero-Namen und beide Sprachen für den Claim", () => {
    expect(content.hero.name).toBe("Marco Mannschatz");
    expect(content.hero.claim.de).toBe("Design · Marketing · Creative Strategy");
    expect(content.hero.claim.en).toBe("Design · Marketing · Creative Strategy");
  });

  it("enthält 5 Berufsstationen im Lebenslauf", () => {
    expect(content.cv.experience).toHaveLength(5);
  });

  it("enthält 5 Portfolio-Kategorien, Fubble hat 14 Kunden", () => {
    expect(content.portfolio.categories).toHaveLength(5);
    const fubble = content.portfolio.categories.find((c) => c.id === "fubble");
    expect(fubble?.clients).toHaveLength(14);
  });

  it("Kontakt-E-Mail stimmt mit der öffentlichen Adresse überein", () => {
    expect(content.contact.email).toBe("hallo@marcomannschatz.de");
  });
});
