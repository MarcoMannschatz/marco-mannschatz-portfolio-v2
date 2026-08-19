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
