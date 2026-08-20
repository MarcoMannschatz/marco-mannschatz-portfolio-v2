import { render, screen } from "@testing-library/react";
import { Router } from "wouter";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import Impressum from "./Impressum";
import Datenschutz from "./Datenschutz";

describe("Impressum", () => {
  it("zeigt die Pflichtangaben nach § 5 TMG", () => {
    render(
      <Router>
        <LanguageProvider>
          <Impressum />
        </LanguageProvider>
      </Router>
    );
    expect(screen.getByRole("heading", { name: "Impressum" })).toBeInTheDocument();
    expect(screen.getAllByText(/Kempener Straße 26/).length).toBeGreaterThan(0);
  });
});

describe("Datenschutz", () => {
  it("nennt Vercel als Hoster und erwähnt kein Umami mehr", () => {
    render(
      <Router>
        <LanguageProvider>
          <Datenschutz />
        </LanguageProvider>
      </Router>
    );
    expect(screen.getAllByText(/Vercel/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Umami/)).not.toBeInTheDocument();
  });
});
