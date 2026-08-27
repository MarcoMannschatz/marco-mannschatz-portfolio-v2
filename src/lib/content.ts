export const PROFILE_IMAGE = "/images/profile.jpg";
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
            "Kundenbetreuung namhafter Kunden: Allianz, Bayer 04 Leverkusen, Coca-Cola, Commerzbank Direktservice, Paulaner u. v. m.",
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
        cover: "/images/portfolio/sportschau-social/cover.jpg",
        media: [
          { type: "image" as const, url: "/images/portfolio/sportschau-social/01.webp", alt: "Eintracht Frankfurt Champions League" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/02.webp", alt: "Schalke 04 Talfahrt Infografik" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/03.webp", alt: "Messi & Putellas Ballon d'Or" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/04.webp", alt: "Moritz Seider NHL" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/05.webp", alt: "Europameister Grafik" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/06.webp", alt: "Filip Kostić Transfer zu Juventus Turin" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/07.webp", alt: "Johannes Thingnes Bø Biathlon" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/08.webp", alt: "Thomas Delaney BVB" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/09.webp", alt: "Alexander Zverev Tennis" },
          { type: "image" as const, url: "/images/portfolio/sportschau-social/10.webp", alt: "Marktwert-Statistik" },
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
        cover: "/images/portfolio/sportschau-tv/cover.jpg",
        media: [
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/01.webp", alt: "Ferrari Monza F1 Studiografik" },
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/02.webp", alt: "Bayer Leverkusen vs PSG Ergebnisgrafik" },
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/03.webp", alt: "Randal Kolo Muani Eintracht Frankfurt" },
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/04.webp", alt: "Borussia Mönchengladbach Ergebnisübersicht" },
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/05.webp", alt: "Sumo Wrestling Studiografik" },
          { type: "image" as const, url: "/images/portfolio/sportschau-tv/06.webp", alt: "El Clásico Real Madrid vs FC Barcelona" },
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
            cover: "/images/portfolio/fubble/kalkhoff/logo.png",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/kalkhoff/01.webp", alt: "Kalkhoff – Produktionsmitarbeiter (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/kalkhoff/02.webp", alt: "Kalkhoff – Teamkoordinator Materiallager (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/kalkhoff/03.webp", alt: "Kalkhoff – Staplerfahrer (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/kalkhoff/04.webp", alt: "Kalkhoff – Staplerfahrer (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/kalkhoff/05.webp", alt: "Kalkhoff – Industrial Engineer (m/w/d)" },
            ],
          },
          {
            id: "coca-cola-europacific-partners",
            name: "Coca-Cola Europacific Partners",
            cover: "/images/portfolio/fubble/coca-cola-europacific-partners/logo.webp",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/coca-cola-europacific-partners/01.jpg", alt: "CCEP – Trainee Sales & Commercial Development (Entwurf 1)" },
              { type: "image" as const, url: "/images/portfolio/fubble/coca-cola-europacific-partners/02.jpg", alt: "CCEP – Trainee Sales & Commercial Development (Entwurf 2)" },
              { type: "image" as const, url: "/images/portfolio/fubble/coca-cola-europacific-partners/03.jpg", alt: "CCEP – Trainee Sales & Commercial Development (Entwurf 3)" },
              { type: "image" as const, url: "/images/portfolio/fubble/coca-cola-europacific-partners/04.jpg", alt: "CCEP – Auslieferungsfahrer (all genders)" },
            ],
          },
          {
            id: "commerz-direktservice",
            name: "Commerz Direktservice",
            cover: "/images/portfolio/fubble/commerz-direktservice/logo.webp",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/commerz-direktservice/01.webp", alt: "Commerz Direktservice – Sachbearbeiter Zahlungsrecherche (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/commerz-direktservice/02.webp", alt: "Commerz Direktservice – Systemadministrator Server (m/w/d)" },
            ],
          },
          {
            id: "makita",
            name: "Makita",
            cover: "/images/portfolio/fubble/makita/logo.png",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/makita/01.webp", alt: "Makita – Anwendungstechniker Region West (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/makita/02.webp", alt: "Makita – Servicemonteur (m/w/d)" },
            ],
          },
          {
            id: "irs-intelligent-repairs",
            name: "IRS Intelligent Repairs",
            cover: "/images/portfolio/fubble/irs-intelligent-repairs/logo.webp",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/irs-intelligent-repairs/01.webp", alt: "IRS Intelligent Repairs – Kfz-Meister / Kfz-Sachverständiger (m/w/d)" },
              { type: "image" as const, url: "/images/portfolio/fubble/irs-intelligent-repairs/02.webp", alt: "IRS Intelligent Repairs – Kfz-Lackierermeister (m/w/d)" },
            ],
          },
          {
            id: "bayerische-staatsforsten",
            name: "Bayerische Staatsforsten",
            cover: "/images/portfolio/fubble/bayerische-staatsforsten/logo.png",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/bayerische-staatsforsten/01.jpg", alt: "Bayerische Staatsforsten – SAP Business Intelligence Spezialist (m/w/d)" },
            ],
          },
          {
            id: "kietzmann-consulting",
            name: "Kietzmann Consulting",
            cover: "/images/portfolio/fubble/kietzmann-consulting/logo.png",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/kietzmann-consulting/01.webp", alt: "Kietzmann Consulting – Kapitäne und Co-Piloten (m/w/d)" },
            ],
          },
          {
            id: "hugendubel-digital",
            name: "Hugendubel Digital",
            cover: "/images/portfolio/fubble/hugendubel-digital/logo.webp",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/hugendubel-digital/01.jpg", alt: "Hugendubel Digital – Backend-IT-Entwickler (m/w/d)" },
            ],
          },
          {
            id: "pylones",
            name: "Pylones",
            cover: "/images/portfolio/fubble/pylones/logo.png",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/pylones/01.webp", alt: "Pylones – Verkäufer (m/w/d)" },
            ],
          },
          {
            id: "sparkradiance",
            name: "SparkRadiance",
            cover: "/images/portfolio/fubble/sparkradiance/logo.webp",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/sparkradiance/01.webp", alt: "SparkRadiance – Fachinformatiker IT Servicedesk (m/w/d)" },
            ],
          },
          {
            id: "guentner",
            name: "Güntner",
            cover: "/images/portfolio/fubble/guentner/logo.png",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/guentner/01.webp", alt: "Güntner – Servicetechniker (m/w/d)" },
            ],
          },
          {
            id: "riedel-communications",
            name: "RIEDEL Communications",
            cover: "/images/portfolio/fubble/riedel-communications/logo.jpg",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/riedel-communications/01.webp", alt: "RIEDEL Communications – Social Recruiting Ad" },
            ],
          },
          {
            id: "kohlpharma",
            name: "kohlpharma",
            cover: "/images/portfolio/fubble/kohlpharma/logo.png",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/kohlpharma/01.webp", alt: "kohlpharma – Softwareentwickler (m/w/d)" },
            ],
          },
          {
            id: "bergischlaender",
            name: "Bergischländer",
            cover: "/images/portfolio/fubble/bergischlaender/logo.png",
            media: [
              { type: "image" as const, url: "/images/portfolio/fubble/bergischlaender/01.webp", alt: "Bergischländer – Fleischfachverkäufer (m/w/d)" },
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
        cover: "/images/portfolio/print/cover.webp",
        aspectRatio: "4/3",
        media: [
          { type: "image" as const, url: "/images/portfolio/print/01.webp", alt: "Knock-Out Charity Part 1 – Event-Broschüre" },
          { type: "image" as const, url: "/images/portfolio/print/02.webp", alt: "NARU – Traditions of Japan – Speisekarte & Visitenkarte" },
          { type: "image" as const, url: "/images/portfolio/print/03.webp", alt: "Black Saturday Saarlouis – City-Light-Plakat" },
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
        cover: "/images/portfolio/gedanken-sind-frei/cover.webp",
        aspectRatio: "4/3",
        media: [
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/01.webp", alt: "Wilkinson Sword – Samurai-Kampagne (Mockup)" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/02.webp", alt: "Wilkinson Sword – Samurai-Kampagne (Textseite)" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/03.webp", alt: "Wilkinson Sword – Samurai-Kampagne (Coupon)" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/04.webp", alt: "Lieferando – Fiktive Kampagne (Mousse i denn zum Städtele hinaus?)" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/05.webp", alt: "Spreads 'N' Breads – Pausenbrotdiebstahl" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/06.webp", alt: "Spreads 'N' Breads – 100% biologisch abbeissbar" },
          { type: "image" as const, url: "/images/portfolio/gedanken-sind-frei/07.webp", alt: "Der Postillon – Ice Bucket Challenge Satire-Artikel" },
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
