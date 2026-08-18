# Design-Spec: marcomannschatz.de Neubau

Status: zur Freigabe · Datum: 2026-08-18

## 1. Ziel

Portfolio-Website `marcomannschatz.de` komplett neu bauen: **inhaltlich gleich, visuell 1:1 zur aktuell laufenden Seite**, aber technisch radikal vereinfacht — keine Datenbank, kein Admin-Login, kein Datei-Upload-Backend. Marco pflegt die Seite künftig, indem er Claude Code bittet, Inhalte direkt im Code zu ändern.

Wichtig: Das ist **kein** Redesign. Die Design-Richtung wurde im Gespräch zunächst offen exploriert, dann aber verworfen zugunsten eines originalgetreuen Nachbaus der Live-Seite (Referenz: `Marco Mannschatz – Homepage Styleguide.md`, ergänzt durch Sichtung der echten Live-Seite per Screenshot und des Original-Codes im alten Repo). Verbindliche Quelle für alle visuellen Entscheidungen ist das Styleguide-Dokument.

## 2. Technischer Rahmen

| Bereich | Entscheidung |
|---|---|
| Stack | Vite + React + Tailwind CSS |
| Rendering | Statische Seite, alle Inhalte direkt im Code (`content.ts`-Muster wie im alten Projekt) |
| Bilder | Liegen als Dateien im Projekt (`public/images/...`), kein separater Storage-Dienst |
| CV | Fertige PDF-Datei zum Download verlinkt (`public/cv/Lebenslauf_MARCO_MANNSCHATZ.pdf`), keine serverseitige Generierung |
| Kontaktformular | Vercel Serverless Function `api/contact.ts` → Brevo Transactional-Email-API (siehe Abschnitt 6) |
| Sprache | Zweisprachig DE/EN wie bisher (Client-seitiger Language-Context, kein Routing-Split) |
| Fonts | Bunny Fonts (Oswald, Inter) — kein Google Fonts, kein Tracking |
| Rechtliches | Impressum + Datenschutzerklärung als eigene Seiten |
| Hosting | Vercel (kostenlos, Git-Push = automatisches Deployment) |
| Projektordner | `~/marco-mannschatz-portfolio-v2` (lokal neu, GitHub-Repo folgt später; altes Repo bleibt als Archiv unangetastet) |

### 2.1 Explizit nicht übernommen

- Admin-Panel / Login
- Datenbank (Drizzle/Postgres) — Portfolio-Kategorien, Kunden und Medien werden **statisch** in `content.ts` gepflegt statt über tRPC-Queries aus der DB geladen
- Datei-Upload-Backend
- E-Mail-Benachrichtigungs-Service (ersetzt durch Brevo, siehe unten)
- Manus „Forge"-API / OAuth

## 3. Content-Struktur

Quelle: `client/src/lib/content.ts` aus dem alten Repo, textlich übernommen und wo nötig redaktionell angepasst. Struktur bleibt erhalten:

- **Hero**: Name, Claim, Titel, Intro, CTAs (Lebenslauf ansehen / Arbeiten entdecken / CV Download)
- **Über mich**: Fließtext (2 Absätze DE/EN), 6 Schwerpunkt-Tags, 2 Kennzahlen (6+ Jahre Erfahrung, 3 Sprachen)
- **Lebenslauf**: 5 Berufsstationen (Zeitraum, Ort, Rolle, Unternehmen, Tags, Bulletpoints), 1 Ausbildung, 6 Skills, 4 Sprachen mit Level-Balken
- **Arbeiten** (Portfolio, 3-stufig): 5 Kategorien —
  - *Sportschau Social* (10 Bilder, flache Galerie)
  - *Sportschau TV* (6 Bilder + 1 Video, flache Galerie)
  - *Fubble* (13 Kunden-Kacheln → jeweils eigene Bildergalerie; Cover ist ein Logo-Video)
  - *Print* (3 Bilder, flache Galerie, Seitenverhältnis 4/3)
  - *Die Gedanken sind frei* (7 Bilder, flache Galerie, Seitenverhältnis 4/3)
- **Kontakt**: E-Mail, Formular (Name, E-Mail, Betreff optional, Nachricht, DSGVO-Checkbox, Honeypot)
- **Footer**: Name, Tagline, Impressum-/Datenschutz-Links, Copyright

Bilder, Profilfoto und CV-PDF liefert Marco separat nach; bis dahin Platzhalter-Pfade in `content.ts` mit klar erkennbaren Dummy-Dateien.

## 4. Design-System

Verbindlich nach `Marco Mannschatz – Homepage Styleguide.md`, verifiziert gegen den echten Code (`index.css`, `HeroSection.tsx`, `Header.tsx` etc.) im alten Repo und gegen Screenshots der Live-Seite.

**Kernregeln (Kurzfassung, Details im Styleguide-Dokument):**

- Farben: nur Schwarz, Weiß, neutrale Graustufen (`oklch`-Werte siehe Styleguide 2.1). Keine Akzentfarbe, keine Farbverläufe, keine weichen Schatten, keine runden Cards. Border-Radius durchgehend `0`.
- Typografie: Oswald 700 Uppercase für alle Headlines (`line-height: .9`, `letter-spacing: -.02em`), Inter für UI/Fließtext. Beide via Bunny Fonts, Gewichte 300–700.
- Raster: Container max. `1320px`, Innenabstand `20px` / `32px` (≥640px) / `48px` (≥1024px). Sektionsabstand `96px` mobil / `128px` ab `768px`.
- Flächen-Dramaturgie (fix, nicht verwässern): **Weiß → Schwarz → Weiß → Weiß → Schwarz → Schwarz** = Header (Weiß) → Hero (Weiß) → Über mich (Schwarz) → Lebenslauf (Weiß) → Arbeiten (Weiß) → Kontakt (Schwarz) → Footer (Schwarz).
- Bilder: Graustufen im Ruhezustand, Farbe + `scale(1.05)` bei Hover (500–700ms, ease-out). Einzige bewusst farbige Elemente der Seite sind die Portfolio-Medien im Hover-/Lightbox-Zustand.
- Motion: ruhige Fade-ups (`opacity 0→1`, `translateY(30px)→0`, 500–600ms, gestaffelt 80–120ms), keine Bounces außer dem kleinen Scroll-Pfeil im Hero.

Alle Zahlenwerte, Komponenten-Detailtabellen und die Implementierungsreihenfolge sind 1:1 aus dem Styleguide-Dokument zu übernehmen (dort Kapitel 2–9 sowie 11 „Implementierungsreihenfolge").

## 5. Komponenten — Abweichungen vom Original-Code

Der alte Code (`Header.tsx`, `HeroSection.tsx`, `AboutSection.tsx`, `CVSection.tsx`, `PortfolioSection.tsx`, `ContactSection.tsx`, `Footer.tsx`) wird als Vorlage 1:1 für Markup, Klassen, Timings und Copy übernommen. Funktional geändert werden nur die Stellen, die von DB/Backend abhingen:

| Original | Neu |
|---|---|
| `PortfolioSection.tsx` lädt Kategorien/Kunden/Medien per `trpc.portfolio.*.useQuery(...)` aus der DB | Kategorien/Kunden/Medien kommen direkt aus dem statischen `content.ts`-Array (Struktur bereits identisch zum alten `content.ts`-Fallback, siehe dortiges Feld `portfolio.categories`). Die 3-stufige Navigation (Kategorie-Übersicht → Kunden-Grid → Kunden-Galerie bzw. Kategorie → flache Galerie) sowie die Lightbox bleiben in Verhalten und Optik unverändert. |
| `href="/api/cv-download"` (serverseitige PDF-Generierung) | Direkter Link auf statische Datei, z. B. `href="/cv/Lebenslauf_MARCO_MANNSCHATZ.pdf"` mit `download`-Attribut |
| `ContactSection.tsx` nutzt `trpc.contact.submit.useMutation(...)` | `fetch("/api/contact", { method: "POST", body: ... })` gegen die neue Vercel Function (Abschnitt 6). UI (Felder, Honeypot, DSGVO-Checkbox, Erfolgs-/Fehlerzustand) bleibt exakt gleich. |
| `Footer.tsx` nutzt `Link` von `wouter` | Beibehalten, sofern `wouter` (oder vergleichbares leichtes Routing für die 3 Zusatzseiten Home/Impressum/Datenschutz) auch im neuen Projekt eingesetzt wird; alternativ normale `<a>`-Tags, falls kein Client-Router nötig ist — Entscheidung fällt beim Aufsetzen des Grundgerüsts. |

## 6. Kontaktformular: Brevo Serverless Function

- `api/contact.ts` (Vercel Serverless Function, Node-Runtime)
- Nimmt POST mit `{ name, email, subject?, message }` entgegen
- Serverseitige Validierung (Pflichtfelder, einfache E-Mail-Form-Prüfung) + Honeypot-Check (identisch zur alten Logik: gefülltes Honeypot-Feld → stiller Erfolg ohne Versand)
- Versendet über Brevo Transactional-Email-API (`POST https://api.brevo.com/v3/smtp/email`) eine E-Mail an `hallo@marcomannschatz.de`
- API-Key aus Umgebungsvariable `BREVO_API_KEY` (liefert Marco nach; lokal via `.env.local`, produktiv als Vercel Environment Variable — **niemals im Code oder Repo**)
- Rate-Limiting/Abuse-Schutz: einfache Prüfung reicht (Honeypot + Pflichtfeld-Validierung); kein zusätzlicher Dienst nötig
- Response an Frontend: einfacher Erfolgs-/Fehlerstatus, den `ContactSection` wie bisher in `submitted`/`error`-State abbildet

## 7. Rechtliches

- `/impressum` und `/datenschutz` als eigene, statische Seiten (Texte liegen bereits im alten Repo vor bzw. werden von Marco geliefert/geprüft)
- Kein Tracking, keine Cookie-Banner nötig (keine Analytics, keine Drittanbieter-Skripte außer Bunny Fonts und der Brevo-Function serverseitig)

## 8. Offene Punkte

- Bilder, Profilfoto, CV-PDF: liefert Marco nach, werden dann in `public/images/` bzw. `public/cv/` eingebaut
- `BREVO_API_KEY`: liefert Marco nach
- GitHub-Repo für `~/marco-mannschatz-portfolio-v2`: wird erst kurz vor Deployment angelegt
- Exakter Text von Impressum/Datenschutz: aus altem Repo übernehmen, von Marco vor Go-Live prüfen lassen

## 9. Abnahme-Checkliste (aus Styleguide, verbindlich für die visuelle Prüfung)

- Oswald für jede Display-Headline, Inter für UI/Fließtext
- Headlines immer versal, verdichtet, `line-height: .9`
- Keine dauerhaften Akzentfarben außerhalb des Portfolio-Materials
- Keine Schatten, keine weichen Ränder, keine abgerundeten Cards
- Header fixiert, Desktop rechtsbündig ohne Logo links, Mobil schwarzes Fullscreen-Menü
- Hero: zweizeiliger Name, Graustufen-Porträt, drei CTA-Stufen
- Kapitelfolge exakt: Weiß → Schwarz → Weiß → Weiß → Schwarz → Schwarz
- Portfolio: Kacheln grau im Ruhemodus, farbig + leicht vergrößert bei Hover
- Kontakt: transparentes Underline-Formular auf Schwarz, weißer Submit-Button
- Responsive: Desktopraster brechen mobil sauber in vertikale Reihen um
- Motion: ruhige Fade-ups, keine Bounces/übertriebenen Parallax-Effekte
