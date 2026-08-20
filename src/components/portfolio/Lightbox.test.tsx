import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { MediaItem } from "./types";
import Lightbox from "./Lightbox";

const items: MediaItem[] = [
  { type: "image", url: "/images/portfolio/print/01.svg", alt: "Motiv eins" },
  { type: "image", url: "/images/portfolio/print/02.svg", alt: "Motiv zwei" },
];

describe("Lightbox", () => {
  it("zeigt das Medium am aktuellen Index und die Position", () => {
    render(<Lightbox items={items} index={0} onClose={vi.fn()} onNavigate={vi.fn()} closeLabel="Schließen" />);
    expect(screen.getByAltText("Motiv eins")).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("ruft onNavigate('next') beim Klick auf den Pfeil auf", async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<Lightbox items={items} index={0} onClose={vi.fn()} onNavigate={onNavigate} closeLabel="Schließen" />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onNavigate).toHaveBeenCalledWith("next");
  });

  it("ruft onClose beim Klick auf Schließen auf", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Lightbox items={items} index={0} onClose={onClose} onNavigate={vi.fn()} closeLabel="Schließen" />);
    await user.click(screen.getByRole("button", { name: "Schließen" }));
    expect(onClose).toHaveBeenCalled();
  });
});
