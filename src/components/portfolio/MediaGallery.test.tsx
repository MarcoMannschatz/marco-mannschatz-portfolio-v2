import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { MediaItem } from "./types";
import MediaGallery from "./MediaGallery";

const items: MediaItem[] = [
  { type: "image", url: "/images/portfolio/print/01.svg", alt: "Motiv eins" },
  { type: "image", url: "/images/portfolio/print/02.svg", alt: "Motiv zwei" },
];

describe("MediaGallery", () => {
  it("rendert ein Bild pro Media-Item", () => {
    render(<MediaGallery items={items} onOpen={vi.fn()} />);
    expect(screen.getByAltText("Motiv eins")).toBeInTheDocument();
    expect(screen.getByAltText("Motiv zwei")).toBeInTheDocument();
  });

  it("ruft onOpen mit dem Index beim Klick auf", async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<MediaGallery items={items} onOpen={onOpen} />);
    await user.click(screen.getByAltText("Motiv zwei"));
    expect(onOpen).toHaveBeenCalledWith(1);
  });
});
