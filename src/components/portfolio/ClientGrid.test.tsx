import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ClientData } from "./types";
import ClientGrid from "./ClientGrid";

const clients: ClientData[] = [
  { id: "kalkhoff", name: "Kalkhoff", cover: "/images/portfolio/fubble/kalkhoff/logo.svg", media: [] },
  { id: "makita", name: "Makita", cover: "/images/portfolio/fubble/makita/logo.svg", media: [] },
];

describe("ClientGrid", () => {
  it("zeigt alle Kundennamen", () => {
    render(<ClientGrid clients={clients} onOpen={vi.fn()} />);
    expect(screen.getByText("Kalkhoff")).toBeInTheDocument();
    expect(screen.getByText("Makita")).toBeInTheDocument();
  });

  it("ruft onOpen mit der Kunden-ID beim Klick auf", async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<ClientGrid clients={clients} onOpen={onOpen} />);
    await user.click(screen.getByText("Kalkhoff"));
    expect(onOpen).toHaveBeenCalledWith("kalkhoff");
  });
});
