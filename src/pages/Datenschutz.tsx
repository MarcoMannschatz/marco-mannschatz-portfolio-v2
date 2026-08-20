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

        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight leading-[0.9] mb-12 md:mb-16" style={{ fontFamily: "var(--font-display)" }}>
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

          {/* TODO(Marco): Vor Go-Live final prüfen — Rechtsgrundlage, Formulierung und Brevo-Firmierung/-Sitz bestätigen. */}
          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              3. Brevo (E-Mail-Versand Kontaktformular)
            </h2>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Für den Versand der Benachrichtigung über Anfragen aus dem Kontaktformular nutzen wir den E-Mail-Dienstleister{" "}
              <strong>Brevo</strong> (Sendinblue SAS, Frankreich). Dabei werden die von Ihnen im Formular angegebenen Daten — Name,
              E-Mail-Adresse und Nachrichteninhalt — an Brevo übermittelt, damit die Nachricht zugestellt werden kann.
            </p>
            <p className="text-sm text-foreground/60 leading-relaxed mt-2">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
              an einer funktionierenden Kommunikation mit Anfragenden). Brevo hat seinen Sitz in Frankreich und damit innerhalb der EU,
              es findet keine Datenübertragung in Drittstaaten außerhalb der EU statt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
              4. Allgemeine Hinweise und Pflichtinformationen
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
              5. Datenerfassung auf dieser Website
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
              6. Schriftarten
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
