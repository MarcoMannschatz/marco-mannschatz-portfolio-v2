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

        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-[0.9] mb-12 md:mb-16" style={{ fontFamily: "var(--font-display)" }}>
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
