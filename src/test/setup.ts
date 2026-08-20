import "@testing-library/jest-dom/vitest";

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver;

// jsdom kennt scrollIntoView nicht — ohne Mock werfen alle Klick-Handler,
// die scrollen (Header-Navigation, PortfolioSection), einen TypeError.
window.HTMLElement.prototype.scrollIntoView = function () {};
