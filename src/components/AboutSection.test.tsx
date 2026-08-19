import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import AboutSection from "./AboutSection";

describe("AboutSection", () => {
  it("zeigt alle 6 Schwerpunkt-Tags und die beiden Kennzahlen", () => {
    render(
      <LanguageProvider>
        <AboutSection />
      </LanguageProvider>
    );
    expect(screen.getByText("Visuelle Aufbereitung komplexer Inhalte")).toBeInTheDocument();
    expect(screen.getByText("Zielgruppengerechte Kommunikation")).toBeInTheDocument();
    expect(screen.getByText("6+")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("hat schwarzen Hintergrund per bg-black Klasse", () => {
    const { container } = render(
      <LanguageProvider>
        <AboutSection />
      </LanguageProvider>
    );
    expect(container.querySelector("section#about")).toHaveClass("bg-black");
  });
});
