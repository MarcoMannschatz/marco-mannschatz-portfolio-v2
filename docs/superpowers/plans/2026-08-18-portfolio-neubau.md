# Portfolio-Neubau Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Statischen Nachbau von `marcomannschatz.de` bauen — visuell nicht von der Live-Seite unterscheidbar, aber ohne Datenbank, Login oder eigenes Backend (bis auf eine einzelne Kontaktformular-Funktion).

**Architecture:** Vite + React 19 + TypeScript, Tailwind CSS v4 (CSS-first Tokens, kein `tailwind.config.*`), alle Inhalte statisch in `src/lib/content.ts`, Client-seitiges Routing mit `wouter` für 3 Seiten (Home, Impressum, Datenschutz), Framer Motion für die im Styleguide vorgegebenen Fade-ups/Hover-Übergänge. Kontaktformular postet an eine Vercel Serverless Function (`api/contact.ts`), die über die Brevo Transactional-Email-API verschickt.

**Tech Stack:** React 19, Vite 7, TypeScript 5.9, Tailwind CSS v4, Framer Motion, lucide-react, wouter, Vitest + React Testing Library, Vercel Serverless Functions (Node), Brevo API.

## Global Constraints

- Design-Quelle ist ausschließlich `docs/superpowers/specs/2026-08-18-portfolio-neubau-design.md` und das darin referenzierte Styleguide-Dokument — bei Zweifel gewinnt der Styleguide, nicht Geschmack.
- Farben: nur die Tokens aus Styleguide 2.1 (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted-foreground`, `--border`, plus Weiß/Schwarz-Opazitäten). Keine neuen Akzentfarben.
- Border-Radius überall `0`. Keine Schatten. Keine runden Card-Layouts (Ausnahme: das kreisrunde Hero-Porträt, das ist im Styleguide explizit so vorgesehen).
- Typografie: `Oswald` (700, Uppercase, `line-height:.9`, `letter-spacing:-.02em`) für alle Headlines, `Inter` für UI/Fließtext, beide über Bunny Fonts geladen — kein Google Fonts.
- Kein Tracking, keine Analytics-Skripte, keine Cookie-Banner.
- Kapitelfolge der Startseite fix: Weiß (Header) → Weiß (Hero) → Schwarz (Über mich) → Weiß (Lebenslauf) → Weiß (Arbeiten) → Schwarz (Kontakt) → Schwarz (Footer).
- Keine Datenbank, kein Admin-Login, kein Datei-Upload-Backend, kein E-Mail-Benachrichtigungsdienst außer der Brevo-Function.
- **Commits benötigen laut Projektvorgabe von Marco explizite Freigabe vor jedem `git commit`.** Wer diesen Plan ausführt, zeigt vor dem Commit-Schritt jedes Tasks eine kurze Zusammenfassung der Änderungen und wartet auf ein OK, bevor `git commit` läuft. Nichts wird ungefragt committet.
- Sekundärsprache Englisch ist über `t(de, en)` aus dem `LanguageContext` überall mitzuführen — keine Komponente darf hartcodierten deutschen Text ohne englisches Pendant enthalten (Ausnahme: Eigennamen wie „Marco Mannschatz", Firmennamen).

---

## Dateistruktur (Übersicht)

```
marco-mannschatz-portfolio-v2/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  vitest.config.ts
  .gitignore                          # bereits vorhanden
  api/
    contact.ts                        # Vercel Serverless Function (Brevo)
    contact.test.ts
  scripts/
    generate-placeholders.mjs         # erzeugt SVG-Platzhalterbilder für alle content.ts-Medienpfade
  public/
    images/...                        # von generate-placeholders.mjs erzeugt, später von Marco ersetzt
    cv/                                # CV-PDF landet hier, sobald Marco sie liefert
  src/
    main.tsx
    App.tsx                           # wouter-Router: Home / Impressum / Datenschutz
    index.css                         # Tokens, Base-Layer, .container, .section-padding
    test/
      setup.ts                        # jest-dom + IntersectionObserver-Mock für Framer Motion
    lib/
      content.ts                      # alle Texte + Portfolio-Datenstruktur
      content.test.ts
      language-context.tsx
      language-context.test.tsx
    components/
      Header.tsx
      Header.test.tsx
      HeroSection.tsx
      HeroSection.test.tsx
      AboutSection.tsx
      AboutSection.test.tsx
      CVSection.tsx
      CVSection.test.tsx
      Footer.tsx
      Footer.test.tsx
      portfolio/
        types.ts
        CategoryCard.tsx
        CategoryCard.test.tsx
        ClientGrid.tsx
        ClientGrid.test.tsx
        MediaGallery.tsx
        MediaGallery.test.tsx
        VideoCard.tsx
        Lightbox.tsx
        Lightbox.test.tsx
        PortfolioSection.tsx
        PortfolioSection.test.tsx
      contact/
        ContactSection.tsx
        ContactSection.test.tsx
    pages/
      Home.tsx
      Impressum.tsx
      Datenschutz.tsx
      Legal.test.tsx                  # Smoke-Tests für Impressum/Datenschutz
```

---

### Task 1: Projekt-Grundgerüst — Vite, Tailwind-Tokens, Container, Testing-Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/main.tsx`
- Create: `src/App.tsx` (Platzhalter-Version, wird in Task 13 final)
- Create: `src/test/setup.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `.container` und `.section-padding` CSS-Klassen (von allen späteren Sections genutzt), CSS-Variablen `--font-display`/`--font-sans`, Tailwind-Farb-Tokens `bg-background`, `text-foreground`, `bg-primary`, `bg-secondary`, `text-muted-foreground`, `border-border`.

- [ ] **Step 1: `package.json` anlegen**

```json
{
  "name": "marco-mannschatz-portfolio",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "check": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "framer-motion": "^12.23.22",
    "lucide-react": "^0.453.0",
    "react": "^19.2.1",
    "react-dom": "^19.2.1",
    "wouter": "^3.3.5"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.3",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^24.7.0",
    "@types/react": "^19.2.1",
    "@types/react-dom": "^19.2.1",
    "@vercel/node": "^3.2.29",
    "@vitejs/plugin-react": "^5.0.4",
    "jsdom": "^25.0.1",
    "tailwindcss": "^4.1.14",
    "typescript": "^5.9.3",
    "vite": "^7.1.7",
    "vitest": "^2.1.4"
  }
}
```

- [ ] **Step 2: Dependencies installieren**

Run: `npm install`
Expected: `node_modules/` wird angelegt, Befehl endet ohne Fehler.

- [ ] **Step 3: `tsconfig.json` anlegen**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "vite.config.ts", "vitest.config.ts", "api"]
}
```

- [ ] **Step 4: `vite.config.ts` anlegen**

```ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
```

- [ ] **Step 5: `vitest.config.ts` anlegen**

```ts
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    globals: true,
  },
});
```

- [ ] **Step 6: `src/test/setup.ts` anlegen (jest-dom + IntersectionObserver-Mock)**

Framer Motions `whileInView` nutzt `IntersectionObserver`, das jsdom nicht implementiert. Ohne Mock werfen alle Section-Tests einen `ReferenceError`.

```ts
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

// @ts-expect-error jsdom kennt IntersectionObserver nicht
globalThis.IntersectionObserver = MockIntersectionObserver;
```

- [ ] **Step 7: `index.html` anlegen**

```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>Marco Mannschatz – Design · Marketing · Creative Strategy</title>
    <meta
      name="description"
      content="Diplom-Kommunikationsdesigner mit Expertise in Design, Marketing und Creative Strategy. Portfolio und Lebenslauf von Marco Mannschatz."
    />
    <meta name="author" content="Marco Mannschatz" />
    <!-- DSGVO-safe: Bunny Fonts (EU-gehostet, keine Datenübertragung an Google) -->
    <link rel="preconnect" href="https://fonts.bunny.net" />
    <link
      href="https://fonts.bunny.net/css2?family=Inter:wght@300;400;500;600;700&family=Oswald:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: `src/index.css` anlegen (Tokens, Base-Layer, Container)**

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-display: "Oswald", Impact, "Arial Black", sans-serif;
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.05 0 0);
  --primary: oklch(0 0 0);
  --secondary: oklch(0.95 0 0);
  --muted-foreground: oklch(0.4 0 0);
  --border: oklch(0.88 0 0);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
}

.container {
  width: 100%;
  max-width: 1320px;
  margin-inline: auto;
  padding-inline: 20px;
}

@media (min-width: 640px) {
  .container {
    padding-inline: 32px;
  }
}

@media (min-width: 1024px) {
  .container {
    padding-inline: 48px;
  }
}

.section-padding {
  padding-block: 96px;
}

@media (min-width: 768px) {
  .section-padding {
    padding-block: 128px;
  }
}

::selection {
  background: oklch(0.05 0 0 / 0.15);
}

@keyframes skillFill {
  from {
    width: 0;
  }
}

.skill-bar-fill {
  animation: skillFill 1.2s ease-out forwards;
}
```

- [ ] **Step 9: `src/main.tsx` anlegen**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 10: `src/App.tsx` als Platzhalter anlegen (wird in Task 13 durch echtes Routing ersetzt)**

```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <h1 className="section-padding container text-4xl md:text-6xl">
        Marco Mannschatz
      </h1>
    </div>
  );
}
```

- [ ] **Step 11: Smoke-Test schreiben**

```tsx
// src/App.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("rendert den Namen Marco Mannschatz", () => {
    render(<App />);
    expect(screen.getByText("Marco Mannschatz")).toBeInTheDocument();
  });
});
```

- [ ] **Step 12: Tests laufen lassen**

Run: `npm test`
Expected: 1 Testdatei, 1 Test, PASS.

- [ ] **Step 13: Typecheck laufen lassen**

Run: `npm run check`
Expected: keine Fehler.

- [ ] **Step 14: Commit**

Zusammenfassung an Marco zeigen, auf Freigabe warten, dann:

```bash
git add package.json package-lock.json tsconfig.json vite.config.ts vitest.config.ts index.html src
git commit -m "chore: set up Vite + React + Tailwind v4 project skeleton"
```

---

### Task 2: Content & Sprache — `content.ts` + `LanguageContext`

**Files:**
- Create: `src/lib/content.ts`
- Create: `src/lib/language-context.tsx`
- Test: `src/lib/content.test.ts`
- Test: `src/lib/language-context.test.tsx`

**Interfaces:**
- Produces: `content` (default export shape: `{ nav, hero, about, cv, portfolio, contact, footer }`), Typen `MediaItem`, `ClientData`, `CategoryData` (aus `content.ts` exportiert, werden von `src/components/portfolio/types.ts` in Task 7 re-exportiert), `LanguageProvider`, `useLanguage()` → `{ lang: "de" | "en", setLang, t }`.
- Consumes: nichts (Basis-Layer).

Alle Bild-/Video-Pfade zeigen auf `/images/...` bzw. `/videos/...` — die Dateien selbst entstehen erst in Task 14 (Platzhalter-Generator). Das ist beabsichtigt: `content.ts` ist bereits die finale Datenstruktur, nur die referenzierten Assets fehlen noch.

- [ ] **Step 1: Fehlschlagenden Test für `content.ts` schreiben**

```ts
// src/lib/content.test.ts
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

  it("enthält 5 Portfolio-Kategorien, Fubble hat 13 Kunden", () => {
    expect(content.portfolio.categories).toHaveLength(5);
    const fubble = content.portfolio.categories.find((c) => c.id === "fubble");
    expect(fubble?.clients).toHaveLength(13);
  });

  it("Kontakt-E-Mail stimmt mit der öffentlichen Adresse überein", () => {
    expect(content.contact.email).toBe("hallo@marcomannschatz.de");
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/lib/content.test.ts`
Expected: FAIL mit „Cannot find module './content'"

- [ ] **Step 3: `src/lib/content.ts` anlegen**

Texte 1:1 aus dem alten Repo (`client/src/lib/content.ts`) übernommen; Bild-URLs durch lokale Platzhalterpfade ersetzt, DB-spezifische Felder (`numericId`) entfernt.

```ts
export const PROFILE_IMAGE = "/images/profile.svg";
export const CV_PDF_URL = "/cv/Lebenslauf_MARCO_MANNSCHATZ.pdf";

export interface MediaItem {
  type: "image" | "video";
  url: string;
  alt: string;
}

export interface ClientData {
  id: string;
  name: string;
  cover: string;
  media: MediaItem[];
}

export interface CategoryData {
  id: string;
  title: { de: string; en: string };
  subtitle: string;
  description: { de: string; en: string };
  cover: string;
  aspectRatio?: string;
  media: MediaItem[];
  clients?: ClientData[];
}

export const content = {
  nav: {
    about: { de: "Über mich", en: "About" },
    cv: { de: "Lebenslauf", en: "Resume" },
    portfolio: { de: "Arbeiten", en: "Work" },
    contact: { de: "Kontakt", en: "Contact" },
  },
  hero: {
    greeting: { de: "Hallo, ich bin", en: "Hello, I'm" },
    name: "Marco Mannschatz",
    title: { de: "Diplom-Kommunikationsdesigner", en: "Communication Design Graduate" },
    claim: { de: "Design · Marketing · Creative Strategy", en: "Design · Marketing · Creative Strategy" },
    intro: {
      de: "Ich verbinde visuelles Design mit strategischem Marketing und datengetriebener Kommunikation — für Marken, die Wirkung erzielen wollen.",
      en: "I combine visual design with strategic marketing and data-driven communication — for brands that want to make an impact.",
    },
    cta_cv: { de: "Lebenslauf ansehen", en: "View Resume" },
    cta_work: { de: "Arbeiten entdecken", en: "Explore Work" },
  },
  about: {
    title: { de: "Über mich", en: "About Me" },
    text: {
      de: `Diplom-Kommunikationsdesigner mit mehrjähriger Berufserfahrung an der Schnittstelle von Design, Marketing und strategischer Kommunikation. Seit 2020 gestalte ich als Freelance Grafikdesigner für die Sportschau im WDR datenbasierte Informationsgrafiken und arbeite eng mit Redaktionen zusammen — von Social-Media-Grafiken bis hin zu Studiografiken für die Live-Berichterstattung.

Parallel dazu bringe ich umfassende Erfahrung in Performance-Marketing, Akquise und Vertrieb mit. Bei Fubble.de betreute ich namhafte Kunden wie Allianz, Bayer 04 Leverkusen, Coca-Cola und Commerzbank Direktservice — mit Fokus auf Umsetzung der CI-Richtlinien, CRM, KPI-Reporting und Ads-Management.

Mein Profil vereint gestalterische Kompetenz mit einem tiefen Verständnis für Zielgruppen, Markenführung und datengetriebene Kommunikation. Ich arbeite strukturiert, zuverlässig und mit dem Anspruch, komplexe Inhalte visuell stark, sachlich präzise und zielgruppengerecht aufzubereiten.`,
      en: `Communication Design graduate with years of professional experience at the intersection of design, marketing, and strategic communication. Since 2020, I have been working as a freelance graphic designer for Sportschau at WDR, creating data-driven information graphics and collaborating closely with editorial teams — from social media visuals to studio graphics for live broadcasts.

In parallel, I bring extensive experience in performance marketing, acquisition, and sales. At Fubble.de, I managed high-profile clients such as Allianz, Bayer 04 Leverkusen, Coca-Cola, and Commerzbank Direktservice — with a focus on implementing CI guidelines, CRM, KPI reporting, and ads management.

My profile combines design expertise with a deep understanding of target audiences, brand management, and data-driven communication. I work in a structured, reliable manner with the ambition to present complex content in a visually compelling, factually precise, and audience-appropriate way.`,
    },
    highlights: {
      de: [
        "Visuelle Aufbereitung komplexer Inhalte",
        "Datenbasierte Informationsgrafik",
        "Performance-Marketing & Ads",
        "Corporate Design & Markenführung",
        "Redaktionelle Zusammenarbeit",
        "Zielgruppengerechte Kommunikation",
      ],
      en: [
        "Visual presentation of complex content",
        "Data-driven information graphics",
        "Performance marketing & ads",
        "Corporate design & brand management",
        "Editorial collaboration",
        "Audience-targeted communication",
      ],
    },
  },
  cv: {
    title: { de: "Lebenslauf", en: "Resume" },
    experience_title: { de: "Berufserfahrung", en: "Professional Experience" },
    education_title: { de: "Ausbildung", en: "Education" },
    skills_title: { de: "Kenntnisse", en: "Skills" },
    languages_title: { de: "Sprachen", en: "Languages" },
    download: { de: "PDF herunterladen", en: "Download PDF" },
    present: { de: "Heute", en: "Present" },
    experience: [
      {
        role: { de: "Freelance Grafikdesigner", en: "Freelance Graphic Designer" },
        company: "WDR / Sportschau",
        location: "Köln",
        period: { de: "Apr. 2020 – Heute", en: "Apr 2020 – Present" },
        tags: {
          de: "Social Media · Informationsgrafik · Studiografik · Redaktion",
          en: "Social Media · Information Graphics · Studio Graphics · Editorial",
        },
        bullets: {
          de: [
            "Grafiken für Social-Media-Kanäle (Instagram, Facebook, TikTok, YouTube), Website, Intranet",
            "Erstellung und Betreuung der Studiografiken der Sportschau",
            "Schulung von Redakteuren zur Verbesserung des Workflows zwischen Redaktion und Grafik",
          ],
          en: [
            "Graphics for social media channels (Instagram, Facebook, TikTok, YouTube), website, intranet",
            "Creation and management of Sportschau studio graphics",
            "Training editors to improve workflow between editorial and design teams",
          ],
        },
      },
      {
        role: { de: "Performance Marketing Manager", en: "Performance Marketing Manager" },
        company: "Fubble.de",
        location: "Leverkusen",
        period: { de: "Jan. 2024 – Nov. 2025", en: "Jan 2024 – Nov 2025" },
        tags: {
          de: "Performance-Marketing · Akquise & Vertrieb · CRM & KPI-Reporting · Ads-Management · Kundenbetreuung",
          en: "Performance Marketing · Acquisition & Sales · CRM & KPI Reporting · Ads Management · Client Relations",
        },
        bullets: {
          de: [
            "Umfassende Erfahrung in Performance-Marketing",
            "Kundenbetreuung namhafter Kunden: Allianz, Bayer 04 Leverkusen, Coca-Cola, Commerzbank Direktservice, Paulaner u. v. m.",
            "Ausgezeichnete Designkompetenz zur Steigerung der Markenaufmerksamkeit",
          ],
          en: [
            "Extensive experience in performance marketing",
            "Client management for major brands: Allianz, Bayer 04 Leverkusen, Coca-Cola, Commerzbank Direktservice, Paulaner and more",
            "Outstanding design skills to increase brand awareness",
          ],
        },
      },
      {
        role: { de: "Freelance Grafikdesigner & Copywriter", en: "Freelance Graphic Designer & Copywriter" },
        company: "Fubble.de",
        location: "Leverkusen",
        period: { de: "Jan. 2019 – Jan. 2024", en: "Jan 2019 – Jan 2024" },
        tags: {
          de: "Social Ads · Recruiting · CI-Richtlinien · Marketing & HR",
          en: "Social Ads · Recruiting · CI Guidelines · Marketing & HR",
        },
        bullets: {
          de: [
            "Gestaltung und Texten von Social Ads und Social-Recruiting-Anzeigen unter Einhaltung der CI-Richtlinien zahlreicher Unternehmen",
            "Schnittstelle zwischen Marketing und HR",
          ],
          en: [
            "Design and copywriting for social ads and social recruiting campaigns in compliance with corporate identity guidelines",
            "Interface between marketing and HR departments",
          ],
        },
      },
      {
        role: { de: "Freelance Social Media Manager", en: "Freelance Social Media Manager" },
        company: "Monin Deutschland",
        location: "Trier",
        period: { de: "Jan. 2018 – Dez. 2018", en: "Jan 2018 – Dec 2018" },
        tags: {
          de: "Social Media · Content · Community · Shootings",
          en: "Social Media · Content · Community · Photo Shoots",
        },
        bullets: {
          de: [
            "Einrichtung von Social-Media-Kanälen zur Steigerung der Reichweite",
            "Erstellung von einzigartigem Content für alle Plattformen",
            "Redaktion von Beiträgen und Beantwortung von Kundenanfragen",
            "Koordination und Planung von Shootings zur Content-Erstellung",
          ],
          en: [
            "Setting up social media channels to increase reach",
            "Creating unique content for all platforms",
            "Editing posts and responding to customer inquiries",
            "Coordinating and planning photo shoots for content creation",
          ],
        },
      },
      {
        role: { de: "Selbstständiger Kommunikationsdesigner", en: "Independent Communication Designer" },
        company: { de: "Selbstständigkeit", en: "Self-employed" },
        location: "Saarlouis / Köln",
        period: { de: "Juli 2017 – Jan. 2024", en: "Jul 2017 – Jan 2024" },
        tags: { de: "Print · Digital · Corporate Design · Infografik", en: "Print · Digital · Corporate Design · Infographics" },
        bullets: {
          de: [
            "Erstellung visueller Konzepte für Print- und Digitalmedien",
            "Design von Logos und Markenelementen für Corporate Design",
            "Bearbeitung und Retusche von Bildmaterial",
            "Erstellung von Infografiken und Illustrationen für vielfältige Medien",
          ],
          en: [
            "Creating visual concepts for print and digital media",
            "Designing logos and brand elements for corporate design",
            "Image editing and retouching",
            "Creating infographics and illustrations for diverse media",
          ],
        },
      },
    ],
    education: [
      {
        degree: { de: "Diplom — Kommunikationsdesign", en: "Diploma — Communication Design" },
        school: { de: "Hochschule der Bildenden Künste", en: "University of Fine Arts" },
        location: "Saarbrücken",
        year: "2020",
        detail: { de: "Schwerpunkt: Werbung und Werbetexten", en: "Focus: Advertising and Copywriting" },
      },
    ],
    skills: ["Adobe Creative Suite", "Canva", "CRM", "Google Ads Manager", "Meta Ads Manager", "Microsoft Office"],
    languages: [
      { name: { de: "Deutsch", en: "German" }, level: 5, label: { de: "Muttersprache", en: "Native" } },
      { name: { de: "Englisch", en: "English" }, level: 4, label: { de: "Gut", en: "Good" } },
      { name: { de: "Italienisch", en: "Italian" }, level: 4, label: { de: "Gut", en: "Good" } },
      { name: { de: "Französisch", en: "French" }, level: 2, label: { de: "Grundkenntnisse", en: "Basic" } },
    ],
  },
  portfolio: {
    title: { de: "Arbeiten", en: "Work" },
    subtitle: {
      de: "Ausgewählte Projekte aus Design, Marketing und visueller Kommunikation",
      en: "Selected projects in design, marketing, and visual communication",
    },
    all: { de: "Alle", en: "All" },
    empty: { de: "Noch keine Arbeiten veröffentlicht.", en: "No work published yet." },
    back: { de: "Zurück zur Übersicht", en: "Back to Overview" },
    detailClose: { de: "Schließen", en: "Close" },
    categories: [
      {
        id: "sportschau-social",
        title: { de: "Sportschau Social", en: "Sportschau Social" },
        subtitle: "Social Media / Digital Design",
        description: {
          de: "Seit 2020 unterstütze ich die Sportschau, eines der reichweitenstärksten Sportformate Deutschlands, bei der grafischen Gestaltung der Social-Media-Kanäle. Ziel ist eine zeitgemäße, aufmerksamkeitsstarke Aufbereitung der Inhalte, die sich im dynamischen Umfeld sozialer Netzwerke behauptet. Dabei arbeite ich eng mit der Redaktion zusammen, um journalistisch korrekte Inhalte schnell und plattformübergreifend auszuspielen. Klare Bildsprache, hohe Wiedererkennbarkeit und eine unmittelbar erfassbare Sportlichkeit stehen im Mittelpunkt.",
          en: "Since 2020, I have been supporting Sportschau, one of Germany's most widely-reaching sports formats, with the graphic design of their social media channels. The goal is a contemporary, attention-grabbing presentation of content that stands out in the dynamic environment of social networks. I work closely with the editorial team to deliver journalistically accurate content quickly and across platforms. Clear visual language, high recognition value, and an immediately perceptible sense of sportiness are at the core.",
        },
        cover: "/images/portfolio/sportschau-social/cover.svg",
        media: [
          { type: "image" as const, url: "/images/portfolio/sportschau-social/01.svg", alt: "Eintracht Frankfurt Champions League" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/02.svg", alt: "Schalke 04 Talfahrt Infografik" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/03.svg", alt: "Messi & Putellas Ballon d'Or" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/04.svg", alt: "Moritz Seider NHL" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/05.svg", alt: "Europameister Grafik" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/06.svg", alt: "Filip Kostić Transfer zu Juventus Turin" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/07.svg", alt: "Johannes Thingnes Bø Biathlon" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/08.svg", alt: "Thomas Delaney BVB" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/09.svg", alt: "Alexander Zverev Tennis" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/10.svg", alt: "Marktwert-Statistik" },
        ],
      },
      {
        id: "sportschau-tv",
        title: { de: "Sportschau TV", en: "Sportschau TV" },
        subtitle: "Broadcast / Studiografik",
        description: {
          de: "Neben der Social-Media-Arbeit gestalte ich für die Sportschau auch Grafiken für die TV-Sendung. Dazu gehören Studiografiken, Bauchbinden, Infotafeln und animierte Elemente, die während der Live-Berichterstattung eingesetzt werden. Die Herausforderung liegt in der schnellen Umsetzung unter Sendedruck bei gleichzeitig hoher visueller Qualität und redaktioneller Präzision.",
          en: "In addition to social media work, I also create graphics for the Sportschau TV broadcast. This includes studio graphics, lower thirds, information boards, and animated elements used during live coverage. The challenge lies in fast turnaround under broadcast pressure while maintaining high visual quality and editorial precision.",
        },
        cover: "/images/portfolio/sportschau-tv/cover.svg",
        media: [
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/01.svg", alt: "Ferrari Monza F1 Studiografik" },
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/02.svg", alt: "Bayer Leverkusen vs PSG Ergebnisgrafik" },
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/03.svg", alt: "Randal Kolo Muani Eintracht Frankfurt" },
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/04.svg", alt: "Borussia Mönchengladbach Ergebnisübersicht" },
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/05.svg", alt: "Sumo Wrestling Studiografik" },
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/06.svg", alt: "El Clásico Real Madrid vs FC Barcelona" },
          { type: "video" as const, url: "/videos/portfolio/sportschau-tv/schalke-animation.mp4", alt: "Schalke 04 Logo Animation" },
        ],
      },
      {
        id: "fubble",
        title: { de: "Fubble", en: "Fubble" },
        subtitle: "Performance-Marketing / Social Recruiting Ads",
        description: {
          de: "Bei Fubble.de verantworte ich nicht nur die Gestaltung von Kampagnengrafiken, sondern das gesamte End-to-End-Management der Performance-Kampagnen: von der strategischen Einrichtung über Budgetverwaltung und Skalierung bis hin zu KPI-Reporting und Optimierung. Die Auswahl der hier gezeigten Social Recruiting Ads verdeutlichen meine gestalterische Bandbreite: Ich arbeite sowohl CI-konform innerhalb bestehender Corporate Designs namhafter Kunden wie Allianz, Bayer 04 Leverkusen, Coca-Cola oder Commerzbank Direktservice als auch frei illustrativ, wenn es die Kampagnenstrategie erfordert. Diese Kombination aus Designkompetenz und datengetriebenem Kampagnenmanagement macht mich zur Schnittstelle zwischen Kreation und Performance.",
          en: "At Fubble.de, I am responsible not only for designing campaign graphics but for the entire end-to-end management of performance campaigns: from strategic setup through budget management and scaling to KPI reporting and optimization. The selection of social recruiting ads shown here demonstrates my creative range: I work both within existing corporate design guidelines of renowned clients such as Allianz, Bayer 04 Leverkusen, Coca-Cola, and Commerzbank Direktservice, as well as in a free illustrative style when the campaign strategy calls for it. This combination of design expertise and data-driven campaign management positions me at the intersection of creation and performance.",
        },
        cover: "/videos/portfolio/fubble/logo-animation.mp4",
        aspectRatio: "1/1",
        media: [],
        clients: [
          {
            id: "kalkhoff",
            name: "Kalkhoff",
            cover: "/images/portfolio/fubble/kalkhoff/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/kalkhoff/01.svg", alt: "Kalkhoff – Produktionsmitarbeiter (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/kalkhoff/02.svg", alt: "Kalkhoff – Teamkoordinator Materiallager (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/kalkhoff/03.svg", alt: "Kalkhoff – Staplerfahrer (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/kalkhoff/04.svg", alt: "Kalkhoff – Staplerfahrer (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/kalkhoff/05.svg", alt: "Kalkhoff – Industrial Engineer (m/w/d)" },
            ],
          },
          {
            id: "coca-cola-europacific-partners",
            name: "Coca-Cola Europacific Partners",
            cover: "/images/portfolio/fubble/coca-cola-europacific-partners/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/coca-cola-europacific-partners/01.svg", alt: "CCEP – Trainee Sales & Commercial Development (Entwurf 1)" },
              { type: "image" as const, url: "/images/portfolio/fubble/coca-cola-europacific-partners/02.svg", alt: "CCEP – Trainee Sales & Commercial Development (Entwurf 2)" },
              { type: "image" as const, url: "/images/portfolio/fubble/coca-cola-europacific-partners/03.svg", alt: "CCEP – Trainee Sales & Commercial Development (Entwurf 3)" },
              { type: "image" as const, url: "/images/portfolio/fubble/coca-cola-europacific-partners/04.svg", alt: "CCEP – Auslieferungsfahrer (all genders)" },
            ],
          },
          {
            id: "commerz-direktservice",
            name: "Commerz Direktservice",
            cover: "/images/portfolio/fubble/commerz-direktservice/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/commerz-direktservice/01.svg", alt: "Commerz Direktservice – Sachbearbeiter Zahlungsrecherche (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/commerz-direktservice/02.svg", alt: "Commerz Direktservice – Systemadministrator Server (m/w/d)" },
            ],
          },
          {
            id: "makita",
            name: "Makita",
            cover: "/images/portfolio/fubble/makita/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/makita/01.svg", alt: "Makita – Anwendungstechniker Region West (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/makita/02.svg", alt: "Makita – Servicemonteur (m/w/d)" },
            ],
          },
          {
            id: "irs-intelligent-repairs",
            name: "IRS Intelligent Repairs",
            cover: "/images/portfolio/fubble/irs-intelligent-repairs/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/irs-intelligent-repairs/01.svg", alt: "IRS Intelligent Repairs – Kfz-Meister / Kfz-Sachverständiger (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/irs-intelligent-repairs/02.svg", alt: "IRS Intelligent Repairs – Kfz-Lackierermeister (m/w/d)" },
            ],
          },
          {
            id: "bayerische-staatsforsten",
            name: "Bayerische Staatsforsten",
            cover: "/images/portfolio/fubble/bayerische-staatsforsten/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/bayerische-staatsforsten/01.svg", alt: "Bayerische Staatsforsten – SAP Business Intelligence Spezialist (m/w/d)" },
            ],
          },
          {
            id: "kietzmann-consulting",
            name: "Kietzmann Consulting",
            cover: "/images/portfolio/fubble/kietzmann-consulting/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/kietzmann-consulting/01.svg", alt: "Kietzmann Consulting – Kapitäne und Co-Piloten (m/w/d)" },
            ],
          },
          {
            id: "hugendubel-digital",
            name: "Hugendubel Digital",
            cover: "/images/portfolio/fubble/hugendubel-digital/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/hugendubel-digital/01.svg", alt: "Hugendubel Digital – Backend-IT-Entwickler (m/w/d)" },
            ],
          },
          {
            id: "pylones",
            name: "Pylones",
            cover: "/images/portfolio/fubble/pylones/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/pylones/01.svg", alt: "Pylones – Verkäufer (m/w/d)" },
            ],
          },
          {
            id: "sparkradiance",
            name: "SparkRadiance",
            cover: "/images/portfolio/fubble/sparkradiance/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/sparkradiance/01.svg", alt: "SparkRadiance – Fachinformatiker IT Servicedesk (m/w/d)" },
            ],
          },
          {
            id: "guentner",
            name: "Güntner",
            cover: "/images/portfolio/fubble/guentner/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/guentner/01.svg", alt: "Güntner – Servicetechniker (m/w/d)" },
            ],
          },
          {
            id: "riedel-communications",
            name: "RIEDEL Communications",
            cover: "/images/portfolio/fubble/riedel-communications/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/riedel-communications/01.svg", alt: "RIEDEL Communications – Social Recruiting Ad" },
            ],
          },
          {
            id: "kohlpharma",
            name: "kohlpharma",
            cover: "/images/portfolio/fubble/kohlpharma/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/kohlpharma/01.svg", alt: "kohlpharma – Softwareentwickler (m/w/d)" },
            ],
          },
          {
            id: "bergischlaender",
            name: "Bergischländer",
            cover: "/images/portfolio/fubble/bergischlaender/logo.svg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/bergischlaender/01.svg", alt: "Bergischländer – Fleischfachverkäufer (m/w/d)" },
            ],
          },
        ],
      },
      {
        id: "print",
        title: { de: "Print", en: "Print" },
        subtitle: "Printmedien / Editorial Design / Plakate",
        description: {
          de: "Auch abseits des Bildschirms fühle ich mich zu Hause: Ob Broschüren, Speisekarten, Visitenkarten oder großformatige Plakate – Printdesign verlangt ein besonderes Gespür für Typografie, Materialität und Detailgenauigkeit. Die hier gezeigten Arbeiten reichen von Event-Broschüren über Restaurant-Branding bis hin zu City-Light-Plakaten und zeigen meine Bandbreite im klassischen Grafikdesign.",
          en: "I am equally at home away from the screen: whether brochures, menus, business cards, or large-format posters – print design demands a special sense for typography, materiality, and attention to detail. The works shown here range from event brochures to restaurant branding to city-light posters, demonstrating my range in classic graphic design.",
        },
        cover: "/images/portfolio/print/cover.svg",
        aspectRatio: "4/3",
        media: [
          { type: "image" as const, url: "/images/portfolio/print/01.svg", alt: "Knock-Out Charity Part 1 – Event-Broschüre" },
          { type: "image" as const, url: "/images/portfolio/print/02.svg", alt: "NARU – Traditions of Japan – Speisekarte & Visitenkarte" },
          { type: "image" as const, url: "/images/portfolio/print/03.svg", alt: "Black Saturday Saarlouis – City-Light-Plakat" },
        ],
      },
      {
        id: "gedanken-sind-frei",
        title: { de: "Die Gedanken sind frei", en: "Free Works" },
        subtitle: "Freie Arbeiten / Fiktive Projekte / Experimente",
        description: {
          de: "Dieser Bereich ist meinen freien Arbeiten gewidmet – Projekte, die ohne Briefing, ohne Kunde und ohne Kompromisse entstehen. Ob fiktive Kampagnen, typografische Experimente, illustrative Spielereien oder konzeptionelle Ideen: Hier zeige ich, wie ich denke, wenn niemand zuschaut. Kreativität braucht Raum zum Atmen.",
          en: "This section is dedicated to my free works – projects created without a brief, without a client, and without compromise. Whether fictional campaigns, typographic experiments, illustrative explorations, or conceptual ideas: this is how I think when no one is watching. Creativity needs room to breathe.",
        },
        cover: "/images/portfolio/gedanken-sind-frei/cover.svg",
        aspectRatio: "4/3",
        media: [
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/01.svg", alt: "Wilkinson Sword – Samurai-Kampagne (Mockup)" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/02.svg", alt: "Wilkinson Sword – Samurai-Kampagne (Textseite)" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/03.svg", alt: "Wilkinson Sword – Samurai-Kampagne (Coupon)" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/04.svg", alt: "Lieferando – Fiktive Kampagne (Mousse i denn zum Städtele hinaus?)" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/05.svg", alt: "Spreads 'N' Breads – Pausenbrotdiebstahl" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/06.svg", alt: "Spreads 'N' Breads – 100% biologisch abbeissbar" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/07.svg", alt: "Der Postillon – Ice Bucket Challenge Satire-Artikel" },
        ],
      },
    ] satisfies CategoryData[],
  },
  contact: {
    title: { de: "Kontakt", en: "Contact" },
    subtitle: { de: "Ich freue mich auf Ihre Nachricht", en: "I look forward to hearing from you" },
    phone: "+49 152 28822797",
    email: "hallo@marcomannschatz.de",
    address: { de: "Kempener Straße 26, 50733 Köln", en: "Kempener Straße 26, 50733 Cologne, Germany" },
    cta: { de: "E-Mail schreiben", en: "Send Email" },
  },
  footer: {
    copyright: "Marco Mannschatz",
    tagline: { de: "Design · Marketing · Creative Strategy", en: "Design · Marketing · Creative Strategy" },
  },
};
```

- [ ] **Step 4: Test laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/lib/content.test.ts`
Expected: PASS (4 Tests)

- [ ] **Step 5: Fehlschlagenden Test für `LanguageContext` schreiben**

```tsx
// src/lib/language-context.test.tsx
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
```

- [ ] **Step 6: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/lib/language-context.test.tsx`
Expected: FAIL mit „Cannot find module './language-context'"

- [ ] **Step 7: `src/lib/language-context.tsx` anlegen**

```tsx
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Lang = "de" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (de: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "de",
  setLang: () => {},
  t: (de) => de,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lang");
      if (saved === "en" || saved === "de") return saved;
    }
    return "de";
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.lang = newLang;
  }, []);

  const t = useCallback((de: string, en: string) => (lang === "de" ? de : en), [lang]);

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
```

- [ ] **Step 8: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/lib/language-context.test.tsx`
Expected: PASS (2 Tests)

- [ ] **Step 9: Alle Tests + Typecheck laufen lassen**

Run: `npm test && npm run check`
Expected: alle PASS, keine Typfehler.

- [ ] **Step 10: Commit**

Zusammenfassung zeigen, auf Freigabe warten, dann:

```bash
git add src/lib
git commit -m "feat: add static content and language context"
```

---

### Task 3: Header + mobiles Vollbildmenü

**Files:**
- Create: `src/components/Header.tsx`
- Test: `src/components/Header.test.tsx`

**Interfaces:**
- Consumes: `useLanguage()` aus `@/lib/language-context`, `content.nav` aus `@/lib/content`.
- Produces: `Header` (default export, keine Props) — wird von `Home.tsx` in Task 13 eingebunden.

Übernommen 1:1 aus `Header.tsx` im alten Repo (Struktur, Klassen, Framer-Motion-Timings), ohne funktionale Änderung — der Header hängt an keiner DB/Backend-Logik.

- [ ] **Step 1: Fehlschlagenden Test schreiben**

```tsx
// src/components/Header.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import Header from "./Header";

function renderHeader() {
  return render(
    <LanguageProvider>
      <Header />
    </LanguageProvider>
  );
}

describe("Header", () => {
  it("zeigt alle vier Navigationslinks auf Deutsch", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "Über mich" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Lebenslauf" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Arbeiten" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Kontakt" })).toBeInTheDocument();
  });

  it("wechselt die Sprache über den Globe-Button auf Englisch", async () => {
    const user = userEvent.setup();
    renderHeader();
    const langButtons = screen.getAllByRole("button", { name: /switch language/i });
    await user.click(langButtons[0]);
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
  });

  it("öffnet das mobile Vollbildmenü per Hamburger-Button", async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole("button", { name: /menü öffnen/i }));
    expect(screen.getByRole("button", { name: /menü schließen/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/components/Header.test.tsx`
Expected: FAIL mit „Cannot find module './Header'"

- [ ] **Step 3: `src/components/Header.tsx` anlegen**

```tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { content } from "@/lib/content";

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navItems = [
    { href: "#about", label: t(content.nav.about.de, content.nav.about.en) },
    { href: "#cv", label: t(content.nav.cv.de, content.nav.cv.en) },
    { href: "#portfolio", label: t(content.nav.portfolio.de, content.nav.portfolio.en) },
    { href: "#contact", label: t(content.nav.contact.de, content.nav.contact.en) },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
          mobileOpen ? "bg-black" : scrolled ? "bg-white/95 backdrop-blur-sm border-b border-black/10" : "bg-white"
        }`}
      >
        <div className="container flex items-center justify-between h-16 md:h-20">
          <div className="relative z-50" />

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
            <div className="h-5 w-px bg-black/20" />
            <button
              onClick={() => setLang(lang === "de" ? "en" : "de")}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground transition-colors duration-200"
              aria-label="Switch language"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "de" ? "EN" : "DE"}
            </button>
          </nav>

          <div className="flex items-center gap-4 md:hidden relative z-50">
            <motion.button
              onClick={() => setLang(lang === "de" ? "en" : "de")}
              className="text-xs font-semibold uppercase tracking-wider"
              animate={{ color: mobileOpen ? "#ffffff" : "#000000" }}
              transition={{ duration: 0.3 }}
              aria-label="Switch language"
            >
              {lang === "de" ? "EN" : "DE"}
            </motion.button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              className="w-8 h-8 flex flex-col justify-center items-center gap-[5px]"
            >
              <motion.span
                className="block h-[2px] w-6 origin-center"
                animate={{ backgroundColor: mobileOpen ? "#ffffff" : "#000000", rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="block h-[2px] w-6 origin-center"
                animate={{ backgroundColor: mobileOpen ? "#ffffff" : "#000000", opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
              <motion.span
                className="block h-[2px] w-6 origin-center"
                animate={{ backgroundColor: mobileOpen ? "#ffffff" : "#000000", rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-black flex flex-col md:hidden pt-16"
          >
            <div className="flex-1 flex flex-col justify-center px-8 pt-8 pb-16">
              <nav className="flex flex-col gap-2">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.35, delay: 0.1 + i * 0.07, ease: "easeOut" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="group flex items-center gap-4 py-4 border-b border-white/10 last:border-0"
                  >
                    <span
                      className="text-[clamp(2.5rem,10vw,4rem)] font-bold uppercase tracking-tight text-white leading-none group-hover:text-white/60 transition-colors duration-200"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.label}
                    </span>
                    <motion.span
                      className="text-white/30 text-sm font-mono ml-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                    >
                      0{i + 1}
                    </motion.span>
                  </motion.a>
                ))}
              </nav>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="px-8 pb-10 flex items-center justify-between border-t border-white/10 pt-6"
            >
              <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Design · Marketing · Creative Strategy</p>
              <button
                onClick={() => setLang(lang === "de" ? "en" : "de")}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {lang === "de" ? "EN" : "DE"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 4: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/components/Header.test.tsx`
Expected: PASS (3 Tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/Header.test.tsx
git commit -m "feat: add Header with mobile fullscreen menu"
```

---

### Task 4: Hero-Section

**Files:**
- Create: `src/components/HeroSection.tsx`
- Test: `src/components/HeroSection.test.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `content.hero` und `PROFILE_IMAGE` aus `@/lib/content`.
- Produces: `HeroSection` (default export, keine Props).

CV-Download zeigt jetzt direkt auf `CV_PDF_URL` (statische Datei) statt auf die alte Server-Route `/api/cv-download` — das ist die einzige funktionale Abweichung vom Original (siehe Spec Abschnitt 5).

- [ ] **Step 1: Fehlschlagenden Test schreiben**

```tsx
// src/components/HeroSection.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import HeroSection from "./HeroSection";

function renderHero() {
  return render(
    <LanguageProvider>
      <HeroSection />
    </LanguageProvider>
  );
}

describe("HeroSection", () => {
  it("zeigt den Namen als zweizeilige Headline", () => {
    renderHero();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Marco Mannschatz");
  });

  it("verlinkt den CV-Download direkt auf die statische PDF-Datei", () => {
    renderHero();
    const link = screen.getByRole("link", { name: /cv download/i });
    expect(link).toHaveAttribute("href", "/cv/Lebenslauf_MARCO_MANNSCHATZ.pdf");
    expect(link).toHaveAttribute("download");
  });

  it("zeigt das Porträt in Graustufen", () => {
    renderHero();
    const img = screen.getByAltText("Marco Mannschatz");
    expect(img).toHaveClass("grayscale");
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/components/HeroSection.test.tsx`
Expected: FAIL mit „Cannot find module './HeroSection'"

- [ ] **Step 3: `src/components/HeroSection.tsx` anlegen**

```tsx
import { motion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { content, CV_PDF_URL, PROFILE_IMAGE } from "@/lib/content";

export default function HeroSection() {
  const { t } = useLanguage();
  const c = content.hero;

  return (
    <section className="relative min-h-screen bg-white flex flex-col justify-end pt-20">
      <div className="container flex-1 flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-foreground/50 mb-4 md:mb-6"
        >
          {t(c.claim.de, c.claim.en)}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <h1
            className="text-[clamp(3.5rem,12vw,10rem)] font-bold uppercase leading-[0.9] tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Marco
            <br />
            Mannschatz
          </h1>
        </motion.div>

        <div className="mt-8 md:mt-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col gap-8"
          >
            <div>
              <p className="text-sm md:text-base font-semibold uppercase tracking-[0.15em] text-foreground/70">
                {t(c.title.de, c.title.en)}
              </p>
              <div className="w-16 h-1 bg-black mt-3" />
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#cv"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#cv")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center px-6 py-3 bg-black text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-black/80 transition-colors"
              >
                {t(c.cta_cv.de, c.cta_cv.en)}
              </a>
              <a
                href="#portfolio"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center px-6 py-3 border-2 border-black text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
              >
                {t(c.cta_work.de, c.cta_work.en)}
              </a>
              <a
                href={CV_PDF_URL}
                download="Lebenslauf_MARCO_MANNSCHATZ.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-black/30 text-black/60 text-xs font-semibold uppercase tracking-[0.2em] hover:border-black hover:text-black transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                {t("CV Download", "CV Download")}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-6 lg:max-w-md"
          >
            <div className="w-40 h-40 md:w-52 md:h-52 lg:w-56 lg:h-56 flex-shrink-0 rounded-full overflow-hidden aspect-square self-start">
              <img
                src={PROFILE_IMAGE}
                alt="Marco Mannschatz"
                className="w-full h-full object-cover grayscale"
                style={{ objectPosition: "50% 35%" }}
                loading="eager"
              />
            </div>
            <p className="text-base md:text-lg text-foreground/60 leading-relaxed">{t(c.intro.de, c.intro.en)}</p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="container pb-8 pt-12"
      >
        <button
          onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
          {t("Mehr erfahren", "Learn more")}
        </button>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 4: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/components/HeroSection.test.tsx`
Expected: PASS (3 Tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroSection.tsx src/components/HeroSection.test.tsx
git commit -m "feat: add Hero section"
```

---

### Task 5: About-Section (schwarzes Kapitel)

**Files:**
- Create: `src/components/AboutSection.tsx`
- Test: `src/components/AboutSection.test.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `content.about`.
- Produces: `AboutSection` (default export, keine Props).

1:1 aus `AboutSection.tsx` im alten Repo übernommen, keine funktionale Änderung nötig (keine DB-Abhängigkeit).

- [ ] **Step 1: Fehlschlagenden Test schreiben**

```tsx
// src/components/AboutSection.test.tsx
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
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/components/AboutSection.test.tsx`
Expected: FAIL mit „Cannot find module './AboutSection'"

- [ ] **Step 3: `src/components/AboutSection.tsx` anlegen**

```tsx
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { content } from "@/lib/content";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12 } }),
};

export default function AboutSection() {
  const { lang, t } = useLanguage();
  const c = content.about;
  const highlights = lang === "de" ? c.highlights.de : c.highlights.en;
  const paragraphs = t(c.text.de, c.text.en).split("\n\n");

  return (
    <section id="about" className="section-padding bg-black text-white">
      <div className="container">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40 mb-4"
        >
          {t("Über mich", "About")}
        </motion.p>

        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={1}
          variants={fadeUp}
          className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[0.9] mb-12 md:mb-16 whitespace-pre-line"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("Komplexe Inhalte\nvisuell stark\naufbereiten.", "Making complex\ncontent visually\ncompelling.")}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                custom={2 + i * 0.5}
                variants={fadeUp}
                className="text-sm md:text-base text-white/60 leading-[1.8] mb-5 last:mb-0"
              >
                {p}
              </motion.p>
            ))}
          </div>

          <div>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={2}
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40 mb-6"
            >
              {t("Schwerpunkte", "Focus Areas")}
            </motion.p>

            <div className="flex flex-wrap gap-3 mb-12">
              {highlights.map((h, i) => (
                <motion.span
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  custom={2.5 + i * 0.15}
                  variants={fadeUp}
                  className="px-4 py-2 border border-white/20 text-sm font-medium uppercase tracking-wider text-white/80 hover:bg-white hover:text-black transition-colors duration-300 cursor-default"
                >
                  {h}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={4}
              variants={fadeUp}
              className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10"
            >
              <div>
                <p className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  6+
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 mt-2">{t("Jahre Erfahrung", "Years Experience")}</p>
              </div>
              <div>
                <p className="text-5xl md:text-6xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  3
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40 mt-2">{t("Sprachen", "Languages")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/components/AboutSection.test.tsx`
Expected: PASS (2 Tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/AboutSection.tsx src/components/AboutSection.test.tsx
git commit -m "feat: add About section"
```

---

### Task 6: CV-Section (weißes Kapitel) + CV-PDF-Verzeichnis

**Files:**
- Create: `src/components/CVSection.tsx`
- Create: `public/cv/.gitkeep`
- Test: `src/components/CVSection.test.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `content.cv`, `CV_PDF_URL` aus `@/lib/content`.
- Produces: `CVSection` (default export, keine Props).

Download-Button verweist wie im Hero direkt auf `CV_PDF_URL` statt auf `/api/cv-download`.

- [ ] **Step 1: Fehlschlagenden Test schreiben**

```tsx
// src/components/CVSection.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import CVSection from "./CVSection";

describe("CVSection", () => {
  it("zeigt alle 5 Berufsstationen und den PDF-Download-Link", () => {
    render(
      <LanguageProvider>
        <CVSection />
      </LanguageProvider>
    );
    expect(screen.getByText("WDR / Sportschau")).toBeInTheDocument();
    expect(screen.getAllByText("Fubble.de")).toHaveLength(2);
    expect(screen.getByText("Monin Deutschland")).toBeInTheDocument();
    const downloadLink = screen.getByRole("link", { name: /pdf herunterladen/i });
    expect(downloadLink).toHaveAttribute("href", "/cv/Lebenslauf_MARCO_MANNSCHATZ.pdf");
  });

  it("zeigt Ausbildung, Skills und Sprachen", () => {
    render(
      <LanguageProvider>
        <CVSection />
      </LanguageProvider>
    );
    expect(screen.getByText("Diplom — Kommunikationsdesign")).toBeInTheDocument();
    expect(screen.getByText("Adobe Creative Suite")).toBeInTheDocument();
    expect(screen.getByText("Deutsch")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/components/CVSection.test.tsx`
Expected: FAIL mit „Cannot find module './CVSection'"

- [ ] **Step 3: `src/components/CVSection.tsx` anlegen**

```tsx
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { content, CV_PDF_URL } from "@/lib/content";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

export default function CVSection() {
  const { lang, t } = useLanguage();
  const c = content.cv;

  return (
    <section id="cv" className="section-padding bg-white">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 md:mb-16 gap-4">
          <div>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={0}
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/40 mb-4"
            >
              {t(c.title.de, c.title.en)}
            </motion.p>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={1}
              variants={fadeUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[0.9]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t(c.experience_title.de, c.experience_title.en)}
            </motion.h2>
          </div>
          <motion.a
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeUp}
            href={CV_PDF_URL}
            download="Lebenslauf_MARCO_MANNSCHATZ.pdf"
            className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-black/80 transition-colors flex-shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            {t(c.download.de, c.download.en)}
          </motion.a>
        </div>

        <div className="space-y-0">
          {c.experience.map((exp, i) => {
            const role = t(exp.role.de, exp.role.en);
            const company = typeof exp.company === "string" ? exp.company : t(exp.company.de, exp.company.en);
            const period = t(exp.period.de, exp.period.en);
            const tags = lang === "de" ? exp.tags.de : exp.tags.en;
            const bullets = lang === "de" ? exp.bullets.de : exp.bullets.en;

            return (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i * 0.3}
                variants={fadeUp}
                className="grid lg:grid-cols-12 gap-4 lg:gap-8 py-8 border-t border-foreground/10 group hover:bg-secondary/30 transition-colors duration-300 -mx-4 px-4 lg:-mx-6 lg:px-6"
              >
                <div className="lg:col-span-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/50">{period}</p>
                  <p className="text-xs text-foreground/30 mt-1">{exp.location}</p>
                </div>

                <div className="lg:col-span-9">
                  <h4 className="text-xl lg:text-2xl font-bold uppercase tracking-tight mb-1" style={{ fontFamily: "var(--font-display)" }}>
                    {role}
                  </h4>
                  <p className="text-sm font-semibold text-foreground/60 mb-3">{company}</p>
                  <p className="text-xs text-foreground/40 mb-4 uppercase tracking-wider">{tags}</p>
                  <ul className="space-y-1.5">
                    {bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-foreground/60 leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-black mt-1.5 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 mt-16 pt-12 border-t border-foreground/10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} custom={0} variants={fadeUp}>
            <h3 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
              {t(c.education_title.de, c.education_title.en)}
            </h3>
            {c.education.map((edu, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-foreground">{t(edu.degree.de, edu.degree.en)}</p>
                <p className="text-sm text-foreground/50 mt-1">
                  {t(edu.school.de, edu.school.en)}, {edu.location}
                </p>
                <p className="text-xs text-foreground/30 mt-1">{edu.year}</p>
                <p className="text-xs text-foreground/50 mt-2">{t(edu.detail.de, edu.detail.en)}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} custom={1} variants={fadeUp}>
            <h3 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
              {t(c.skills_title.de, c.skills_title.en)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {c.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold uppercase tracking-wider text-foreground/70 px-3 py-2 border border-foreground/15 hover:border-foreground/40 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} custom={2} variants={fadeUp}>
            <h3 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
              {t(c.languages_title.de, c.languages_title.en)}
            </h3>
            <div className="space-y-4">
              {c.languages.map((l, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-sm font-semibold text-foreground">{t(l.name.de, l.name.en)}</span>
                    <span className="text-xs text-foreground/40 uppercase tracking-wider">{t(l.label.de, l.label.en)}</span>
                  </div>
                  <div className="h-[3px] bg-foreground/10">
                    <div className="h-full bg-black skill-bar-fill" style={{ width: `${(l.level / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: `public/cv/.gitkeep` anlegen (leere Datei)**

Sichert das Verzeichnis in Git, bis Marco die echte PDF liefert — Git versioniert keine leeren Ordner.

- [ ] **Step 5: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/components/CVSection.test.tsx`
Expected: PASS (2 Tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/CVSection.tsx src/components/CVSection.test.tsx public/cv/.gitkeep
git commit -m "feat: add CV section"
```

---

### Task 7: Portfolio Ebene 1 — Typen + Kategorie-Übersicht (`CategoryCard`)

**Files:**
- Create: `src/components/portfolio/types.ts`
- Create: `src/components/portfolio/CategoryCard.tsx`
- Test: `src/components/portfolio/CategoryCard.test.tsx`

**Interfaces:**
- Consumes: `CategoryData` aus `@/lib/content` (re-exportiert über `types.ts`).
- Produces: `CategoryCard` — Props `{ cat: CategoryData; idx: number; t: (de: string, en: string) => string; onOpen: (id: string) => void }`. Wird von `PortfolioSection` (Task 9) genutzt.

Unterschied zum Original: `onOpen` bekommt nur noch die String-`id` (keine `numericId` mehr, da keine DB-Query dahinter steht), Medienanzahl kommt aus `cat.media.length + (cat.clients?.reduce(...) ?? 0)` statt aus einer eigenen `trpc`-Query.

- [ ] **Step 1: `src/components/portfolio/types.ts` anlegen**

```ts
export type { MediaItem, ClientData, CategoryData } from "@/lib/content";
```

- [ ] **Step 2: Fehlschlagenden Test schreiben**

```tsx
// src/components/portfolio/CategoryCard.test.tsx
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
```

- [ ] **Step 3: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/components/portfolio/CategoryCard.test.tsx`
Expected: FAIL mit „Cannot find module './CategoryCard'"

- [ ] **Step 4: `src/components/portfolio/CategoryCard.tsx` anlegen**

```tsx
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { CategoryData } from "./types";

function mediaCount(cat: CategoryData): number {
  if (cat.clients) {
    return cat.clients.reduce((sum, client) => sum + client.media.length, 0);
  }
  return cat.media.length;
}

export default function CategoryCard({
  cat,
  idx,
  t,
  onOpen,
}: {
  cat: CategoryData;
  idx: number;
  t: (de: string, en: string) => string;
  onOpen: (id: string) => void;
}) {
  const hasClients = !!cat.clients?.length;
  const isVideo = cat.cover.endsWith(".mp4");
  const total = mediaCount(cat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="group relative overflow-hidden cursor-pointer"
      onClick={() => onOpen(cat.id)}
    >
      <div className={`relative aspect-[3/4] overflow-hidden ${isVideo ? "bg-white" : hasClients ? "bg-neutral-900" : ""}`}>
        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              src={cat.cover}
              autoPlay
              loop
              muted
              playsInline
              className="max-w-[85%] max-h-[70%] object-contain grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
            />
          </div>
        ) : hasClients ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
            <img
              src={cat.cover}
              alt={t(cat.title.de, cat.title.en)}
              loading="lazy"
              className="max-w-[90%] max-h-[60%] object-contain grayscale brightness-200 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
            />
          </div>
        ) : (
          <img
            src={cat.cover}
            alt={t(cat.title.de, cat.title.en)}
            loading="lazy"
            className="w-full h-full object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
          />
        )}
        <div
          className={`absolute inset-0 ${
            isVideo ? "bg-transparent" : hasClients ? "bg-black/10 group-hover:bg-black/0" : "bg-black/30 group-hover:bg-black/10"
          } transition-colors duration-700`}
        />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${isVideo ? "text-neutral-500" : "text-white/60"}`}>
            {cat.subtitle}
          </p>
          <h3
            className={`text-2xl md:text-3xl font-bold uppercase tracking-tight leading-[0.95] ${isVideo ? "text-neutral-900" : "text-white"}`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t(cat.title.de, cat.title.en)}
          </h3>
          <div
            className={`mt-3 flex items-center gap-2 transition-colors duration-500 ${
              isVideo ? "text-neutral-500 group-hover:text-neutral-900" : "text-white/70 group-hover:text-white"
            }`}
          >
            <span className="text-xs uppercase tracking-[0.15em] font-semibold">
              {total} {total === 1 ? "Arbeit" : "Arbeiten"}
            </span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 5: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/components/portfolio/CategoryCard.test.tsx`
Expected: PASS (2 Tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/portfolio/types.ts src/components/portfolio/CategoryCard.tsx src/components/portfolio/CategoryCard.test.tsx
git commit -m "feat: add portfolio category card"
```

---

### Task 8: Portfolio Ebene 2/3 — `ClientGrid`, `VideoCard`, `MediaGallery`

**Files:**
- Create: `src/components/portfolio/ClientGrid.tsx`
- Create: `src/components/portfolio/VideoCard.tsx`
- Create: `src/components/portfolio/MediaGallery.tsx`
- Test: `src/components/portfolio/ClientGrid.test.tsx`
- Test: `src/components/portfolio/MediaGallery.test.tsx`

**Interfaces:**
- Consumes: `ClientData`, `MediaItem` aus `./types`.
- Produces:
  - `ClientGrid` — Props `{ clients: ClientData[]; onOpen: (clientId: string) => void }`. Rendert die Kunden-Kacheln für Kategorien mit `clients` (nur Fubble).
  - `VideoCard` — Props `{ item: MediaItem; onClick: () => void; aspectRatio?: string }`. Hover-Autoplay-Video-Kachel.
  - `MediaGallery` — Props `{ items: MediaItem[]; aspectRatio?: string; onOpen: (index: number) => void }`. Rendert ein Bild/Video-Grid (genutzt sowohl für flache Kategorien als auch für die Kundengalerie).

- [ ] **Step 1: Fehlschlagenden Test für `ClientGrid` schreiben**

```tsx
// src/components/portfolio/ClientGrid.test.tsx
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
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/components/portfolio/ClientGrid.test.tsx`
Expected: FAIL mit „Cannot find module './ClientGrid'"

- [ ] **Step 3: `src/components/portfolio/VideoCard.tsx` anlegen (wird von `MediaGallery` genutzt)**

```tsx
import { useRef } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { MediaItem } from "./types";

export default function VideoCard({
  item,
  onClick,
  aspectRatio,
}: {
  item: MediaItem;
  onClick: () => void;
  aspectRatio?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden cursor-pointer"
      style={{ aspectRatio: aspectRatio || "4/5" }}
      onClick={onClick}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <video
        ref={videoRef}
        src={item.url}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-70 group-hover:opacity-0 transition-opacity duration-500">
          <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white ml-0.5" />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
    </motion.div>
  );
}
```

- [ ] **Step 4: `src/components/portfolio/MediaGallery.tsx` anlegen**

```tsx
import { motion } from "framer-motion";
import type { MediaItem } from "./types";
import VideoCard from "./VideoCard";

export default function MediaGallery({
  items,
  aspectRatio,
  onOpen,
}: {
  items: MediaItem[];
  aspectRatio?: string;
  onOpen: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {items.map((item, i) =>
        item.type === "video" ? (
          <VideoCard key={i} item={item} onClick={() => onOpen(i)} aspectRatio={aspectRatio} />
        ) : (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="group relative overflow-hidden cursor-pointer"
            style={{ aspectRatio: aspectRatio || "4/5" }}
            onClick={() => onOpen(i)}
          >
            <img
              src={item.url}
              alt={item.alt}
              loading="lazy"
              className="w-full h-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </motion.div>
        )
      )}
    </div>
  );
}
```

- [ ] **Step 5: Fehlschlagenden Test für `MediaGallery` schreiben**

```tsx
// src/components/portfolio/MediaGallery.test.tsx
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
```

- [ ] **Step 6: `MediaGallery`-Test laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/components/portfolio/MediaGallery.test.tsx`
Expected: PASS (2 Tests)

- [ ] **Step 7: `src/components/portfolio/ClientGrid.tsx` anlegen**

```tsx
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ClientData } from "./types";

export default function ClientGrid({ clients, onOpen }: { clients: ClientData[]; onOpen: (clientId: string) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {clients.map((client, i) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="group relative overflow-hidden cursor-pointer"
          onClick={() => onOpen(client.id)}
        >
          <div className="relative aspect-square overflow-hidden bg-neutral-900 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4 md:p-5">
              <img
                src={client.cover}
                alt={client.name}
                loading="lazy"
                className="max-w-[85%] max-h-[75%] object-contain grayscale brightness-200 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110"
              />
            </div>
            <div className="px-3 pb-3 md:px-4 md:pb-4">
              <h4 className="text-sm md:text-base font-bold uppercase tracking-tight text-white/80 group-hover:text-white leading-tight transition-colors duration-300">
                {client.name}
              </h4>
              <div className="mt-1 flex items-center gap-1 text-white/40 group-hover:text-white/70 transition-colors duration-300">
                <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] **Step 8: `ClientGrid`-Test laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/components/portfolio/ClientGrid.test.tsx`
Expected: PASS (2 Tests)

- [ ] **Step 9: Commit**

```bash
git add src/components/portfolio/ClientGrid.tsx src/components/portfolio/VideoCard.tsx src/components/portfolio/MediaGallery.tsx src/components/portfolio/ClientGrid.test.tsx src/components/portfolio/MediaGallery.test.tsx
git commit -m "feat: add portfolio client grid and media gallery"
```

---

### Task 9: `Lightbox` + `PortfolioSection`-Orchestrator

**Files:**
- Create: `src/components/portfolio/Lightbox.tsx`
- Create: `src/components/portfolio/PortfolioSection.tsx`
- Test: `src/components/portfolio/Lightbox.test.tsx`
- Test: `src/components/portfolio/PortfolioSection.test.tsx`

**Interfaces:**
- Consumes: `CategoryCard` (Task 7), `ClientGrid`/`MediaGallery`/`VideoCard` (Task 8), `content.portfolio` aus `@/lib/content`.
- Produces: `Lightbox` — Props `{ items: MediaItem[]; index: number; onClose: () => void; onNavigate: (dir: "prev" | "next") => void; closeLabel: string }`. `PortfolioSection` — default export, keine Props, ersetzt die alte `trpc`-basierte Navigation durch direkte Lookups im statischen `content.portfolio.categories`-Array.

Zustandsautomat (ersetzt die alte `view`-Berechnung aus DB-Queries 1:1 durch reine Array-Lookups):

- `overview`: keine Kategorie aktiv → `CategoryCard`-Grid
- `clients`: Kategorie mit `clients` aktiv, kein Kunde gewählt → `ClientGrid`
- `clientDetail`: Kategorie mit `clients` aktiv UND Kunde gewählt → `MediaGallery` mit `client.media`
- `gallery`: Kategorie ohne `clients` aktiv → `MediaGallery` mit `cat.media`

- [ ] **Step 1: Fehlschlagenden Test für `Lightbox` schreiben**

```tsx
// src/components/portfolio/Lightbox.test.tsx
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
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/components/portfolio/Lightbox.test.tsx`
Expected: FAIL mit „Cannot find module './Lightbox'"

- [ ] **Step 3: `src/components/portfolio/Lightbox.tsx` anlegen**

```tsx
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaItem } from "./types";

export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
  closeLabel,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  closeLabel: string;
}) {
  const current = items[index];
  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] text-white/70 hover:text-white transition-colors"
        aria-label={closeLabel}
      >
        <X className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("prev");
            }}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[110] text-white/50 hover:text-white transition-colors p-2"
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("next");
            }}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[110] text-white/50 hover:text-white transition-colors p-2"
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
          </button>
        </>
      )}

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {current.type === "video" ? (
          <video key={current.url} src={current.url} controls autoPlay playsInline className="max-w-full max-h-[85vh] object-contain" />
        ) : (
          <img src={current.url} alt={current.alt} className="max-w-full max-h-[85vh] object-contain" />
        )}
      </motion.div>

      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-semibold uppercase tracking-[0.2em]">
        {index + 1} / {items.length}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 4: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/components/portfolio/Lightbox.test.tsx`
Expected: PASS (3 Tests)

- [ ] **Step 5: Fehlschlagenden Test für `PortfolioSection` schreiben**

```tsx
// src/components/portfolio/PortfolioSection.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import PortfolioSection from "./PortfolioSection";

function renderPortfolio() {
  return render(
    <LanguageProvider>
      <PortfolioSection />
    </LanguageProvider>
  );
}

describe("PortfolioSection", () => {
  it("zeigt alle 5 Kategorien in der Übersicht", () => {
    renderPortfolio();
    expect(screen.getByText("Sportschau Social")).toBeInTheDocument();
    expect(screen.getByText("Sportschau TV")).toBeInTheDocument();
    expect(screen.getByText("Fubble")).toBeInTheDocument();
    expect(screen.getByText("Print")).toBeInTheDocument();
    expect(screen.getByText("Die Gedanken sind frei")).toBeInTheDocument();
  });

  it("öffnet bei Print direkt die flache Galerie (keine Kunden)", async () => {
    const user = userEvent.setup();
    renderPortfolio();
    await user.click(screen.getByText("Print"));
    expect(screen.getByAltText("Black Saturday Saarlouis – City-Light-Plakat")).toBeInTheDocument();
  });

  it("öffnet bei Fubble zuerst das Kunden-Grid, dann die Kunden-Galerie", async () => {
    const user = userEvent.setup();
    renderPortfolio();
    await user.click(screen.getByText("Fubble"));
    expect(screen.getByText("Kalkhoff")).toBeInTheDocument();
    await user.click(screen.getByText("Kalkhoff"));
    expect(screen.getAllByAltText(/Kalkhoff/).length).toBeGreaterThan(0);
  });

  it("Zurück-Button in der Kategorie-Galerie führt zur Übersicht zurück", async () => {
    const user = userEvent.setup();
    renderPortfolio();
    await user.click(screen.getByText("Print"));
    await user.click(screen.getByText("Zurück zur Übersicht"));
    expect(screen.getByText("Sportschau Social")).toBeInTheDocument();
  });

  it("öffnet die Lightbox beim Klick auf ein Medium und zeigt die Position", async () => {
    const user = userEvent.setup();
    renderPortfolio();
    await user.click(screen.getByText("Print"));
    await user.click(screen.getByAltText("Knock-Out Charity Part 1 – Event-Broschüre"));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/components/portfolio/PortfolioSection.test.tsx`
Expected: FAIL mit „Cannot find module './PortfolioSection'"

- [ ] **Step 7: `src/components/portfolio/PortfolioSection.tsx` anlegen**

```tsx
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { content } from "@/lib/content";
import CategoryCard from "./CategoryCard";
import ClientGrid from "./ClientGrid";
import MediaGallery from "./MediaGallery";
import Lightbox from "./Lightbox";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function PortfolioSection() {
  const { t } = useLanguage();
  const c = content.portfolio;
  const categories = c.categories;

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeCat = activeCategoryId ? categories.find((cat) => cat.id === activeCategoryId) ?? null : null;
  const activeClient = activeCat?.clients?.find((cl) => cl.id === activeClientId) ?? null;
  const hasClients = !!activeCat?.clients?.length;

  const activeMedia = activeClient ? activeClient.media : activeCat ? activeCat.media : [];

  const scrollToPortfolio = useCallback(() => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const openCategory = useCallback(
    (id: string) => {
      setActiveCategoryId(id);
      setActiveClientId(null);
      setLightboxIndex(null);
      scrollToPortfolio();
    },
    [scrollToPortfolio]
  );

  const openClient = useCallback(
    (clientId: string) => {
      setActiveClientId(clientId);
      setLightboxIndex(null);
      scrollToPortfolio();
    },
    [scrollToPortfolio]
  );

  const backToCategory = useCallback(() => {
    setActiveClientId(null);
    setLightboxIndex(null);
    scrollToPortfolio();
  }, [scrollToPortfolio]);

  const closeCategory = useCallback(() => {
    setActiveCategoryId(null);
    setActiveClientId(null);
    setLightboxIndex(null);
  }, []);

  const navigateLightbox = useCallback(
    (direction: "prev" | "next") => {
      setLightboxIndex((current) => {
        if (current === null || activeMedia.length === 0) return current;
        return direction === "next" ? (current + 1) % activeMedia.length : (current - 1 + activeMedia.length) % activeMedia.length;
      });
    },
    [activeMedia.length]
  );

  const view: "overview" | "clients" | "clientDetail" | "gallery" = !activeCat
    ? "overview"
    : activeClient
    ? "clientDetail"
    : hasClients
    ? "clients"
    : "gallery";

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/40 mb-4"
        >
          {t(c.title.de, c.title.en)}
        </motion.p>

        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={1}
          variants={fadeUp}
          className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[0.9] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t(c.title.de, c.title.en)}
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={1.5}
          variants={fadeUp}
          className="text-sm md:text-base text-foreground/50 max-w-xl mb-12 md:mb-16"
        >
          {t(c.subtitle.de, c.subtitle.en)}
        </motion.p>

        <AnimatePresence mode="wait">
          {view === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {categories.map((cat, idx) => (
                <CategoryCard key={cat.id} cat={cat} idx={idx} t={t} onOpen={openCategory} />
              ))}
            </motion.div>
          ) : view === "clients" && activeCat ? (
            <motion.div
              key={`clients-${activeCategoryId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <BackButton onClick={closeCategory} label={t(c.back.de, c.back.en)} />
              <CategoryHeader subtitle={activeCat.subtitle} title={t(activeCat.title.de, activeCat.title.en)} description={t(activeCat.description.de, activeCat.description.en)} />
              <ClientGrid clients={activeCat.clients ?? []} onOpen={openClient} />
            </motion.div>
          ) : view === "clientDetail" && activeCat && activeClient ? (
            <motion.div
              key={`client-${activeClientId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <BackButton onClick={backToCategory} label={`${t("Zurück zu", "Back to")} ${t(activeCat.title.de, activeCat.title.en)}`} />
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-2">{activeCat.subtitle}</p>
                <h3
                  className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.9] mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {activeClient.name}
                </h3>
              </div>
              <MediaGallery items={activeClient.media} aspectRatio={activeCat.aspectRatio} onOpen={setLightboxIndex} />
            </motion.div>
          ) : activeCat ? (
            <motion.div
              key={`gallery-${activeCategoryId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <BackButton onClick={closeCategory} label={t(c.back.de, c.back.en)} />
              <CategoryHeader subtitle={activeCat.subtitle} title={t(activeCat.title.de, activeCat.title.en)} description={t(activeCat.description.de, activeCat.description.en)} />
              <MediaGallery items={activeCat.media} aspectRatio={activeCat.aspectRatio} onOpen={setLightboxIndex} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && activeMedia.length > 0 && (
          <Lightbox
            items={activeMedia}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={navigateLightbox}
            closeLabel={t(c.detailClose.de, c.detailClose.en)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-8 group">
      <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function CategoryHeader({ subtitle, title, description }: { subtitle: string; title: string; description: string }) {
  return (
    <div className="mb-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-2">{subtitle}</p>
      <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.9] mb-4" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h3>
      <p className="text-sm md:text-base text-foreground/60 max-w-2xl leading-relaxed">{description}</p>
    </div>
  );
}
```

- [ ] **Step 8: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/components/portfolio/PortfolioSection.test.tsx`
Expected: PASS (5 Tests)

- [ ] **Step 9: Alle bisherigen Tests + Typecheck laufen lassen**

Run: `npm test && npm run check`
Expected: alle PASS, keine Typfehler.

- [ ] **Step 10: Commit**

```bash
git add src/components/portfolio/Lightbox.tsx src/components/portfolio/PortfolioSection.tsx src/components/portfolio/Lightbox.test.tsx src/components/portfolio/PortfolioSection.test.tsx
git commit -m "feat: add portfolio lightbox and section orchestrator"
```

---

### Task 10: Contact-Section (Frontend, schwarzes Kapitel)

**Files:**
- Create: `src/components/contact/ContactSection.tsx`
- Test: `src/components/contact/ContactSection.test.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `content.contact`.
- Produces: `ContactSection` (default export, keine Props).

Unterschied zum Original: `submitMutation` (tRPC) wird durch einen einfachen `fetch("/api/contact", { method: "POST", ... })`-Aufruf ersetzt. UI-Zustände (`submitted`, `error`, Ladeindikator) bleiben identisch. Honeypot- und DSGVO-Checkbox-Logik unverändert.

- [ ] **Step 1: Fehlschlagenden Test schreiben**

```tsx
// src/components/contact/ContactSection.test.tsx
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
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/components/contact/ContactSection.test.tsx`
Expected: FAIL mit „Cannot find module './ContactSection'"

- [ ] **Step 3: `src/components/contact/ContactSection.tsx` anlegen**

```tsx
import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { content } from "@/lib/content";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12 } }),
};

const inputClasses =
  "w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors duration-300 text-sm";

export default function ContactSection() {
  const { lang, t } = useLanguage();
  const c = content.contact;

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (submitted) setSubmitted(false);
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (honeypot) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || undefined,
          message: formData.message,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setPrivacyConsent(false);
    } catch {
      setError(
        t(
          "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
          "An error occurred while sending. Please try again."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-black text-white">
      <div className="container">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          variants={fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40 mb-4"
        >
          {t(c.title.de, c.title.en)}
        </motion.p>

        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={1}
          variants={fadeUp}
          className="text-4xl md:text-6xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.9] mb-12 md:mb-16"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("Lassen Sie uns\nzusammenarbeiten.", "Let's work\ntogether.")}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-8">
            <motion.a
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={2}
              variants={fadeUp}
              href={`mailto:${c.email}`}
              className="flex items-start gap-4 group"
            >
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:text-black transition-colors duration-300">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-1">E-Mail</p>
                <p className="text-lg font-semibold text-white group-hover:text-white/70 transition-colors">{c.email}</p>
              </div>
            </motion.a>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} custom={3} variants={fadeUp}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">{t("Nachricht gesendet!", "Message sent!")}</h3>
                <p className="text-white/50 text-sm max-w-sm">
                  {t(
                    "Vielen Dank für Ihre Nachricht. Ich melde mich so schnell wie möglich bei Ihnen.",
                    "Thank you for your message. I will get back to you as soon as possible."
                  )}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
                >
                  {t("Weitere Nachricht senden", "Send another message")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div aria-hidden="true" tabIndex={-1} style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}>
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    autoComplete="off"
                    tabIndex={-1}
                  />
                </div>

                <p className="text-base text-white/50 leading-relaxed mb-2">{t(c.subtitle.de, c.subtitle.en)}</p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("Name *", "Name *")}
                    className={inputClasses}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("E-Mail *", "Email *")}
                    className={inputClasses}
                  />
                </div>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t("Betreff (optional)", "Subject (optional)")}
                  className={inputClasses}
                />

                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("Ihre Nachricht *", "Your message *")}
                  className={`${inputClasses} resize-none`}
                />

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 accent-white bg-transparent border border-white/30 rounded-none appearance-none checked:bg-white checked:border-white relative flex-shrink-0
                      [&:checked]:after:content-['✓'] [&:checked]:after:text-black [&:checked]:after:text-xs [&:checked]:after:absolute [&:checked]:after:inset-0 [&:checked]:after:flex [&:checked]:after:items-center [&:checked]:after:justify-center"
                    style={{ minWidth: "16px", minHeight: "16px" }}
                  />
                  <span className="text-xs text-white/50 leading-relaxed">
                    {lang === "de" ? (
                      <>
                        Ich habe die{" "}
                        <a href="/datenschutz" target="_blank" className="underline text-white/70 hover:text-white transition-colors">
                          Datenschutzerklärung
                        </a>{" "}
                        gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung meiner Anfrage zu. *
                      </>
                    ) : (
                      <>
                        I have read the{" "}
                        <a href="/datenschutz" target="_blank" className="underline text-white/70 hover:text-white transition-colors">
                          privacy policy
                        </a>{" "}
                        and consent to the processing of my data to handle my inquiry. *
                      </>
                    )}
                  </span>
                </label>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting || !privacyConsent}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-[0.2em] hover:bg-white/90 transition-colors w-fit group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("Wird gesendet...", "Sending...")}
                    </>
                  ) : (
                    <>
                      {t("Nachricht senden", "Send message")}
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/components/contact/ContactSection.test.tsx`
Expected: PASS (3 Tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/contact/ContactSection.tsx src/components/contact/ContactSection.test.tsx
git commit -m "feat: add Contact section calling /api/contact"
```

---

### Task 11: `api/contact.ts` — Vercel Serverless Function mit Brevo

**Files:**
- Create: `api/contact.ts`
- Test: `api/contact.test.ts`

**Interfaces:**
- Consumes: `process.env.BREVO_API_KEY` (Marco liefert den Wert; lokal über `.env.local`, produktiv als Vercel Environment Variable).
- Produces: `parseContactPayload(body: unknown): ContactPayload | null` (exportiert, pure Funktion, von Tests direkt genutzt), `handler` (default export, Vercel-Function-Signatur `(req: VercelRequest, res: VercelResponse) => Promise<void>`), von `ContactSection` (Task 10) über `fetch("/api/contact")` aufgerufen.

**Wichtig für Marco:** Der Absender (`sender.email` unten) muss in Brevo als verifizierter Absender/Domain hinterlegt sein, sonst lehnt Brevo den Versand ab — das ist ein einmaliges manuelles Setup im Brevo-Dashboard, kein Code-Thema.

- [ ] **Step 1: Fehlschlagende Tests schreiben**

```ts
// api/contact.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import handler, { parseContactPayload } from "./contact";

function mockRes() {
  const res: Partial<VercelResponse> & { statusCode?: number; body?: unknown } = {};
  res.status = vi.fn((code: number) => {
    res.statusCode = code;
    return res as VercelResponse;
  });
  res.json = vi.fn((data: unknown) => {
    res.body = data;
    return res as VercelResponse;
  });
  return res as VercelResponse & { statusCode?: number; body?: unknown };
}

describe("parseContactPayload", () => {
  it("akzeptiert ein gültiges Payload und trimmt Felder", () => {
    const result = parseContactPayload({ name: " Test ", email: " test@example.com ", message: " Hallo " });
    expect(result).toEqual({ name: "Test", email: "test@example.com", subject: undefined, message: "Hallo" });
  });

  it("lehnt fehlenden Namen ab", () => {
    expect(parseContactPayload({ name: "", email: "test@example.com", message: "Hallo" })).toBeNull();
  });

  it("lehnt eine ungültige E-Mail-Adresse ab", () => {
    expect(parseContactPayload({ name: "Test", email: "keine-email", message: "Hallo" })).toBeNull();
  });
});

describe("handler", () => {
  beforeEach(() => {
    process.env.BREVO_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.BREVO_API_KEY;
  });

  it("lehnt Nicht-POST-Requests mit 405 ab", async () => {
    const req = { method: "GET" } as VercelRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("lehnt ungültige Payloads mit 400 ab", async () => {
    const req = { method: "POST", body: { name: "", email: "", message: "" } } as VercelRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("ruft die Brevo-API mit dem API-Key auf und antwortet mit 200", async () => {
    const req = {
      method: "POST",
      body: { name: "Test Person", email: "test@example.com", message: "Testnachricht" },
    } as VercelRequest;
    const res = mockRes();
    await handler(req, res);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/smtp/email",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "api-key": "test-key" }),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("antwortet mit 500, wenn BREVO_API_KEY fehlt", async () => {
    delete process.env.BREVO_API_KEY;
    const req = {
      method: "POST",
      body: { name: "Test Person", email: "test@example.com", message: "Testnachricht" },
    } as VercelRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("antwortet mit 502, wenn Brevo einen Fehler zurückgibt", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const req = {
      method: "POST",
      body: { name: "Test Person", email: "test@example.com", message: "Testnachricht" },
    } as VercelRequest;
    const res = mockRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(502);
  });
});
```

- [ ] **Step 2: Tests laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run api/contact.test.ts`
Expected: FAIL mit „Cannot find module './contact'"

- [ ] **Step 3: `api/contact.ts` anlegen**

```ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseContactPayload(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;
  const { name, email, subject, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length === 0) return null;
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) return null;
  if (typeof message !== "string" || message.trim().length === 0) return null;
  if (subject !== undefined && typeof subject !== "string") return null;

  return {
    name: name.trim(),
    email: email.trim(),
    subject: subject?.trim() || undefined,
    message: message.trim(),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  const payload = parseContactPayload(req.body);
  if (!payload) {
    res.status(400).json({ success: false, error: "Invalid payload" });
    return;
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    res.status(500).json({ success: false, error: "Server misconfigured" });
    return;
  }

  const subjectLine = payload.subject ? `Kontaktformular: ${payload.subject}` : "Neue Nachricht über das Kontaktformular";

  const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "marcomannschatz.de", email: "no-reply@marcomannschatz.de" },
      to: [{ email: "hallo@marcomannschatz.de", name: "Marco Mannschatz" }],
      replyTo: { email: payload.email, name: payload.name },
      subject: subjectLine,
      textContent: `Name: ${payload.name}\nE-Mail: ${payload.email}\n\n${payload.message}`,
    }),
  });

  if (!brevoRes.ok) {
    res.status(502).json({ success: false, error: "Email provider error" });
    return;
  }

  res.status(200).json({ success: true });
}
```

- [ ] **Step 4: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run api/contact.test.ts`
Expected: PASS (6 Tests)

- [ ] **Step 5: `.env.local` für lokale Entwicklung anlegen (nicht committen)**

`.env.local` steht bereits in `.gitignore` (Task 1). Marco trägt hier später seinen echten Key ein:

```
BREVO_API_KEY=
```

- [ ] **Step 6: Commit**

```bash
git add api/contact.ts api/contact.test.ts
git commit -m "feat: add Brevo-backed contact API route"
```

---

### Task 12: Footer

**Files:**
- Create: `src/components/Footer.tsx`
- Test: `src/components/Footer.test.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `content.footer`.
- Produces: `Footer` (default export, keine Props). Nutzt `wouter`s `Link` für `/impressum` und `/datenschutz` (Ziel-Seiten entstehen in Task 13).

- [ ] **Step 1: Fehlschlagenden Test schreiben**

```tsx
// src/components/Footer.test.tsx
import { render, screen } from "@testing-library/react";
import { Router } from "wouter";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/lib/language-context";
import Footer from "./Footer";

function renderFooter() {
  return render(
    <Router>
      <LanguageProvider>
        <Footer />
      </LanguageProvider>
    </Router>
  );
}

describe("Footer", () => {
  it("zeigt Name, Tagline und das aktuelle Jahr im Copyright", () => {
    renderFooter();
    expect(screen.getByText("Marco Mannschatz")).toBeInTheDocument();
    expect(screen.getByText("Design · Marketing · Creative Strategy")).toBeInTheDocument();
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it("verlinkt Impressum und Datenschutz", () => {
    renderFooter();
    expect(screen.getByRole("link", { name: "Impressum" })).toHaveAttribute("href", "/impressum");
    expect(screen.getByRole("link", { name: "Datenschutz" })).toHaveAttribute("href", "/datenschutz");
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/components/Footer.test.tsx`
Expected: FAIL mit „Cannot find module './Footer'"

- [ ] **Step 3: `src/components/Footer.tsx` anlegen**

```tsx
import { Link } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { content } from "@/lib/content";

export default function Footer() {
  const { t } = useLanguage();
  const c = content.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-white/10 py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xl font-bold uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Marco Mannschatz
            </p>
            <p className="text-xs text-white/40 uppercase tracking-[0.15em]">{t(c.tagline.de, c.tagline.en)}</p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/impressum" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-white transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 hover:text-white transition-colors">
              {t("Datenschutz", "Privacy")}
            </Link>
          </div>

          <p className="text-xs text-white/30">
            &copy; {year} {c.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/components/Footer.test.tsx`
Expected: PASS (2 Tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.tsx src/components/Footer.test.tsx
git commit -m "feat: add Footer"
```

---

### Task 13: Routing & Seiten — `App.tsx`, `Home.tsx`, `Impressum.tsx`, `Datenschutz.tsx`

**Files:**
- Modify: `src/App.tsx` (ersetzt den Platzhalter aus Task 1)
- Create: `src/pages/Home.tsx`
- Create: `src/pages/Impressum.tsx`
- Create: `src/pages/Datenschutz.tsx`
- Test: `src/pages/Legal.test.tsx`
- Test: `src/App.test.tsx` (ersetzt den Smoke-Test aus Task 1)

**Interfaces:**
- Consumes: `Header`, `HeroSection`, `AboutSection`, `CVSection`, `PortfolioSection`, `ContactSection`, `Footer` (alle vorigen Tasks), `LanguageProvider` aus `@/lib/language-context`.
- Produces: `App` (default export) als Root-Komponente mit `wouter`-Routing für `/`, `/impressum`, `/datenschutz`.

Rechtstexte 1:1 aus dem alten Repo übernommen (`Impressum.tsx`, `Datenschutz.tsx`), mit zwei inhaltlichen Anpassungen, die sich zwingend aus dem Technologiewechsel ergeben (kein Erfinden, sondern Nachführen der Fakten):
1. Abschnitt „Hosting" nennt jetzt Vercel statt „Manus AI Pte. Ltd." als Hoster.
2. Der komplette Abschnitt „Analyse-Tools / Umami Analytics" entfällt ersatzlos — die neue Seite trackt nichts (Spec Abschnitt 7).
Beide Texte sind vor Go-Live von Marco zu prüfen (siehe Spec „Offene Punkte").

- [ ] **Step 1: Fehlschlagenden Test für die Rechts-Seiten schreiben**

```tsx
// src/pages/Legal.test.tsx
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
    expect(screen.getByText(/Kempener Straße 26/)).toBeInTheDocument();
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
    expect(screen.getByText(/Vercel/)).toBeInTheDocument();
    expect(screen.queryByText(/Umami/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npx vitest run src/pages/Legal.test.tsx`
Expected: FAIL mit „Cannot find module './Impressum'"

- [ ] **Step 3: `src/pages/Impressum.tsx` anlegen**

```tsx
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function Impressum() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="container max-w-3xl py-20">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors cursor-pointer mb-10 block">
            <ArrowLeft className="w-4 h-4" />
            {lang === "de" ? "Zurück zur Startseite" : "Back to homepage"}
          </span>
        </Link>

        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-[0.9] mb-12" style={{ fontFamily: "var(--font-display)" }}>
          Impressum
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Angaben gemäß § 5 TMG
            </h2>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Marco Mannschatz
              <br />
              Kempener Straße 26
              <br />
              50733 Köln
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Kontakt
            </h2>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Telefon: +49 152 28822797
              <br />
              E-Mail: hallo@marcomannschatz.de
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Berufsbezeichnung
            </h2>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Diplom-Kommunikationsdesigner
              <br />
              Verliehen in: Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Marco Mannschatz
              <br />
              Kempener Straße 26
              <br />
              50733 Köln
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Haftungsausschluss
            </h2>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Haftung für Inhalte</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Die Inhalte dieser Seite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der
              Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf
              diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht
              verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
              rechtswidrige Tätigkeit hinweisen.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Haftung für Links</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Urheberrecht
            </h2>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten,
              nicht kommerziellen Gebrauch gestattet.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: `src/pages/Datenschutz.tsx` anlegen**

Inhaltlich identisch zum alten Repo, außer: „Manus AI Pte. Ltd." → „Vercel Inc." im Hosting-Abschnitt, Abschnitt „Analyse-Tools" vollständig entfernt.

```tsx
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function Datenschutz() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="container max-w-3xl py-20">
        <Link href="/">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50 hover:text-foreground transition-colors cursor-pointer mb-10 block">
            <ArrowLeft className="w-4 h-4" />
            {lang === "de" ? "Zurück zur Startseite" : "Back to homepage"}
          </span>
        </Link>

        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-[0.9] mb-12" style={{ fontFamily: "var(--font-display)" }}>
          {lang === "de" ? "Datenschutz" : "Privacy"}
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              1. Datenschutz auf einen Blick
            </h2>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Allgemeine Hinweise</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie
              diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              Ausführliche Informationen zum Thema Datenschutz entnehmen Sie der nachfolgenden Datenschutzerklärung.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Datenerfassung auf dieser Website</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
              <br />
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum
              dieser Website entnehmen.
            </p>
            <p className="text-sm text-foreground/60 leading-relaxed mt-2">
              <strong>Wie erfassen wir Ihre Daten?</strong>
              <br />
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen, z.&nbsp;B. durch Eingabe in ein Kontaktformular.
              Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das
              sind vor allem technische Daten (z.&nbsp;B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
            </p>
            <p className="text-sm text-foreground/60 leading-relaxed mt-2">
              <strong>Wofür nutzen wir Ihre Daten?</strong>
              <br />
              Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur
              Analyse Ihres Nutzerverhaltens verwendet werden.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              2. Hosting
            </h2>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Diese Website wird gehostet von <strong>Vercel Inc.</strong> (im Folgenden: Vercel). Die personenbezogenen Daten, die auf
              dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v.&nbsp;a. um
              IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und
              sonstige Daten, die über eine Website generiert werden, handeln.
            </p>
            <p className="text-sm text-foreground/60 leading-relaxed mt-2">
              Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und bestehenden Kunden (Art. 6
              Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots
              durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              3. Allgemeine Hinweise und Pflichtinformationen
            </h2>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Datenschutz</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Der Betreiber dieser Seiten nimmt den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen
              Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Hinweis zur verantwortlichen Stelle</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
            <p className="text-sm text-foreground/60 leading-relaxed mt-2">
              Marco Mannschatz
              <br />
              Kempener Straße 26
              <br />
              50733 Köln
              <br />
              <br />
              Telefon: +49 152 28822797
              <br />
              E-Mail: hallo@marcomannschatz.de
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte
              Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf
              unberührt.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Beschwerderecht bei der zuständigen Aufsichtsbehörde</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde zu, insbesondere
              in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Recht auf Datenübertragbarkeit</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert
              verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Auskunft, Löschung und Berichtigung</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre
              gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht
              auf Berichtigung oder Löschung dieser Daten.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              4. Datenerfassung auf dieser Website
            </h2>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Cookies</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Diese Website verwendet technisch notwendige Cookies, die für den Betrieb der Seite erforderlich sind. Es werden keine
              Tracking-Cookies oder Cookies zu Marketingzwecken eingesetzt. Technisch notwendige Cookies werden auf Grundlage von Art. 6
              Abs. 1 lit. f DSGVO gespeichert.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Server-Log-Dateien</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser
              automatisch an uns übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL,
              Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse.
            </p>

            <h3 className="text-sm font-bold uppercase tracking-wider mt-4 mb-2">Kontaktformular und Kontaktaufnahme</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Wenn Sie das Kontaktformular auf dieser Website nutzen oder uns per E-Mail oder Telefon kontaktieren, werden Ihre Angaben
              (Name, E-Mail-Adresse, ggf. Betreff und Nachrichtentext) zum Zwecke der Bearbeitung Ihrer Anfrage und für den Fall von
              Anschlussfragen bei uns gespeichert und verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung)
              sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen). Der Versand erfolgt technisch
              über den E-Mail-Dienstleister Brevo (Sendinblue GmbH); Brevo verarbeitet die übermittelten Daten in unserem Auftrag zum
              Zweck des E-Mail-Versands. Diese Daten geben wir nicht ohne Ihre Einwilligung an Dritte außerhalb dieses Auftragsverhältnisses weiter.
            </p>
            <p className="text-sm text-foreground/60 leading-relaxed mt-2">
              <strong>Speicherdauer:</strong> Die über das Kontaktformular übermittelten Daten verbleiben bei uns, bis Sie uns zur
              Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z.&nbsp;B.
              nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen von
              bis zu 10 Jahren – bleiben unberührt. Im Regelfall werden Kontaktanfragen nach 3 Jahren gelöscht, sofern kein
              Vertragsverhältnis entstanden ist.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              5. Schriftarten
            </h2>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Diese Website nutzt Bunny Fonts, einen DSGVO-konformen Schriftarten-Dienst mit Servern in der EU. Es findet keine
              Datenübertragung an Google oder andere Drittanbieter außerhalb der EU statt.
            </p>
          </section>
        </div>

        <p className="text-xs text-foreground/30 mt-12 uppercase tracking-wider">Stand: August 2026</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Tests laufen lassen, Erfolg bestätigen**

Run: `npx vitest run src/pages/Legal.test.tsx`
Expected: PASS (2 Tests)

- [ ] **Step 6: `src/pages/Home.tsx` anlegen**

```tsx
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CVSection from "@/components/CVSection";
import PortfolioSection from "@/components/portfolio/PortfolioSection";
import ContactSection from "@/components/contact/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <CVSection />
        <PortfolioSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 7: `src/App.tsx` final anlegen (ersetzt den Task-1-Platzhalter)**

```tsx
import { Route, Switch } from "wouter";
import { LanguageProvider } from "@/lib/language-context";
import Home from "@/pages/Home";
import Impressum from "@/pages/Impressum";
import Datenschutz from "@/pages/Datenschutz";

export default function App() {
  return (
    <LanguageProvider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/impressum" component={Impressum} />
        <Route path="/datenschutz" component={Datenschutz} />
      </Switch>
    </LanguageProvider>
  );
}
```

- [ ] **Step 8: `src/App.test.tsx` final anlegen (ersetzt den Task-1-Smoke-Test)**

```tsx
// src/App.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("rendert die Startseite mit Hero-Headline unter '/'", () => {
    window.history.pushState({}, "", "/");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Marco Mannschatz");
  });

  it("rendert das Impressum unter '/impressum'", () => {
    window.history.pushState({}, "", "/impressum");
    render(<App />);
    expect(screen.getByRole("heading", { name: "Impressum" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 9: Alle Tests + Typecheck laufen lassen**

Run: `npm test && npm run check`
Expected: alle PASS, keine Typfehler.

- [ ] **Step 10: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/pages
git commit -m "feat: wire up routing and compose Home/Impressum/Datenschutz pages"
```

---

### Task 14: Platzhalter-Assets generieren + finale manuelle Prüfung gegen die Abnahme-Checkliste

**Files:**
- Create: `scripts/generate-placeholders.ts`
- Modify: `package.json` (Script `generate:placeholders`, Dev-Dependency `tsx`)
- Modify: `tsconfig.json` (`include` um `"scripts"` ergänzen)

**Interfaces:**
- Consumes: `content` aus `@/lib/content` (liest die Struktur, um jeden `.svg`-Pfad automatisch zu finden — bei Änderungen an `content.ts` muss das Skript nicht angepasst werden).
- Produces: SVG-Platzhalterdateien unter `public/images/...`, damit im Dev-Server jedes Bild sichtbar ist (Layout, Seitenverhältnisse, Graustufen-Hover lassen sich so wirklich prüfen). Die beiden Video-Pfade (`sportschau-tv/schalke-animation.mp4`, `fubble/logo-animation.mp4`) bleiben bewusst leer — Marco liefert die echten Videos nach (siehe Spec „Offene Punkte").

- [ ] **Step 1: `tsx` als Dev-Dependency ergänzen**

In `package.json` unter `devDependencies` ergänzen:

```json
    "tsx": "^4.19.1",
```

Run: `npm install`

- [ ] **Step 2: `scripts/generate-placeholders.ts` anlegen**

```ts
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { content, PROFILE_IMAGE } from "../src/lib/content";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function svgPlaceholder(label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" role="img" aria-label="${escapeXml(label)}">
  <rect width="400" height="500" fill="#d4d4d4" />
  <text x="200" y="250" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="20" fill="#737373">${escapeXml(label)}</text>
</svg>
`;
}

function writePlaceholder(publicRelativePath: string, label: string) {
  const fullPath = join(PUBLIC_DIR, publicRelativePath.replace(/^\//, ""));
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, svgPlaceholder(label), "utf-8");
}

function collectSvgEntries(): Array<{ path: string; label: string }> {
  const entries: Array<{ path: string; label: string }> = [];

  if (PROFILE_IMAGE.endsWith(".svg")) {
    entries.push({ path: PROFILE_IMAGE, label: "Profilfoto" });
  }

  for (const cat of content.portfolio.categories) {
    if (cat.cover.endsWith(".svg")) entries.push({ path: cat.cover, label: cat.title.de });
    for (const item of cat.media) {
      if (item.url.endsWith(".svg")) entries.push({ path: item.url, label: item.alt });
    }
    for (const client of cat.clients ?? []) {
      if (client.cover.endsWith(".svg")) entries.push({ path: client.cover, label: client.name });
      for (const item of client.media) {
        if (item.url.endsWith(".svg")) entries.push({ path: item.url, label: item.alt });
      }
    }
  }

  return entries;
}

function collectMissingVideoPaths(): string[] {
  const paths: string[] = [];

  for (const cat of content.portfolio.categories) {
    if (cat.cover.endsWith(".mp4")) paths.push(cat.cover);
    for (const item of cat.media) {
      if (item.type === "video") paths.push(item.url);
    }
    for (const client of cat.clients ?? []) {
      for (const item of client.media) {
        if (item.type === "video") paths.push(item.url);
      }
    }
  }

  return paths;
}

const svgEntries = collectSvgEntries();
for (const entry of svgEntries) {
  writePlaceholder(entry.path, entry.label);
}
console.log(`${svgEntries.length} Platzhalter-SVGs erzeugt in public/images/.`);

const missingVideos = collectMissingVideoPaths();
if (missingVideos.length > 0) {
  console.log("\nNoch fehlende Video-Dateien (liefert Marco nach):");
  for (const path of missingVideos) {
    console.log(`  ${path}`);
  }
}
```

- [ ] **Step 3: Script-Aufruf in `package.json` ergänzen**

In `package.json` unter `scripts` ergänzen:

```json
    "generate:placeholders": "tsx scripts/generate-placeholders.ts",
```

- [ ] **Step 4: `tsconfig.json` `include` um `scripts` ergänzen**

Sonst prüft `npm run check` das neue Skript nicht mit. In `tsconfig.json`:

```json
  "include": ["src", "vite.config.ts", "vitest.config.ts", "api", "scripts"]
```

- [ ] **Step 5: Script laufen lassen**

Run: `npm run generate:placeholders`
Expected: Ausgabe „68 Platzhalter-SVGs erzeugt in public/images/." gefolgt von den 2 fehlenden Video-Pfaden. `public/images/profile.svg` sowie die komplette Ordnerstruktur unter `public/images/portfolio/...` existieren danach.

- [ ] **Step 6: Alle Tests + Typecheck + Build laufen lassen**

Run: `npm test && npm run check && npm run build`
Expected: alle Tests PASS, kein Typfehler, `npm run build` erzeugt `dist/` ohne Fehler.

- [ ] **Step 7: Dev-Server starten und gegen die Abnahme-Checkliste prüfen**

Run: `npm run dev` (im Vordergrund laufen lassen, im Browser `http://localhost:5173` öffnen)

Manuell durchgehen (Styleguide Kapitel 12 / Spec Abschnitt 9):

- [ ] Oswald für jede Display-Headline, Inter für UI/Fließtext (Bunny-Fonts-Request in den Dev-Tools prüfen)
- [ ] Headlines immer versal, verdichtet, `line-height: .9`
- [ ] Keine dauerhaften Akzentfarben außerhalb des Portfolio-Materials
- [ ] Keine Schatten, keine weichen Ränder, keine abgerundeten Cards (außer Hero-Porträt)
- [ ] Header fixiert, Desktop rechtsbündig ohne Logo links, Mobil schwarzes Fullscreen-Menü (Browserfenster schmal ziehen)
- [ ] Hero: zweizeiliger Name, Graustufen-Porträt, drei CTA-Stufen
- [ ] Kapitelfolge exakt: Weiß (Header/Hero) → Schwarz (Über mich) → Weiß (Lebenslauf) → Weiß (Arbeiten) → Schwarz (Kontakt/Footer)
- [ ] Portfolio: Kacheln grau im Ruhemodus, farbig + leicht vergrößert bei Hover; Fubble öffnet zuerst das Kunden-Grid
- [ ] Kontakt: transparentes Underline-Formular auf Schwarz, weißer Submit-Button, Formular ohne `BREVO_API_KEY` zeigt die Fehlermeldung (erwartetes Verhalten, solange der Key noch fehlt)
- [ ] Responsive: Fenster auf Mobil-Breite (< 768px) und Tablet-Breite (768–1024px) ziehen, Raster brechen sauber um
- [ ] Motion: ruhige Fade-ups beim Scrollen, keine Bounces außer dem Hero-Scroll-Pfeil

Wenn ein Punkt nicht passt: konkret benennen, welcher Punkt und welche Komponente betroffen ist, dann gezielt nachbessern — nicht pauschal nochmal alles anschauen.

- [ ] **Step 8: Commit**

```bash
git add scripts/generate-placeholders.ts package.json package-lock.json tsconfig.json public/images
git commit -m "chore: generate placeholder assets for all portfolio media"
```

---

## Nach Abschluss dieses Plans — noch offen (bewusst außerhalb dieses Plans)

- Echte Bilder, Profilfoto, CV-PDF von Marco einbauen (Pfade in `content.ts` entsprechend anpassen, betroffene Platzhalter-SVGs können dann gelöscht werden)
- `BREVO_API_KEY` von Marco eintragen (lokal `.env.local`, produktiv Vercel Environment Variable) und Absenderadresse in Brevo verifizieren
- GitHub-Repo für `~/marco-mannschatz-portfolio-v2` anlegen und pushen
- Auf Vercel deployen, Vorschau-Link an Marco zur Freigabe
- DNS bei IONOS auf Vercel umstellen
- Impressum/Datenschutz-Texte von Marco vor Go-Live final prüfen lassen (insbesondere den neu ergänzten Brevo-Passus in der Datenschutzerklärung)
