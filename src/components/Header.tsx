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
