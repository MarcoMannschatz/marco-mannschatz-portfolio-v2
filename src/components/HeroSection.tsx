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
            Marco{" "}
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
            <div className="relative w-40 h-40 md:w-52 md:h-52 lg:w-56 lg:h-56 flex-shrink-0 rounded-full overflow-hidden aspect-square self-start bg-secondary">
              <img
                src={PROFILE_IMAGE}
                alt="Marco Mannschatz"
                className="absolute inset-0 w-full h-full object-cover grayscale"
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
