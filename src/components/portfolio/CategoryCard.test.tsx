import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { CategoryData } from "./types";
import CategoryCard from "./CategoryCard";

const category: CategoryData = {
  id: "print",
  title: { de: "Print", en: "Print" },
  subtitle: "Printmedien",
  description: { de: "Beschreibung", en: "Description" },
  cover: "/images/portfolio/print/cover.svg",
  aspectRatio: "4/3",
  media: [
    { type: "image", url: "/images/portfolio/print/01.svg", alt: "1" },
    { type: "image", url: "/images/portfolio/print/02.svg", alt: "2" },
  ],
};

describe("CategoryCard", () => {
  it("zeigt Titel, Untertitel und Medienanzahl", () => {
    render(<CategoryCard cat={category} idx={0} t={(de) => de} onOpen={vi.fn()} />);
    expect(screen.getByText("Print")).toBeInTheDocument();
    expect(screen.getByText("Printmedien")).toBeInTheDocument();
    expect(screen.getByText(/2 Arbeiten/)).toBeInTheDocument();
  });

  it("ruft onOpen mit der Kategorie-ID beim Klick auf", async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<CategoryCard cat={category} idx={0} t={(de) => de} onOpen={onOpen} />);
    await user.click(screen.getByText("Print"));
    expect(onOpen).toHaveBeenCalledWith("print");
  });
});
