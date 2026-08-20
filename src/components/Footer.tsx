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
