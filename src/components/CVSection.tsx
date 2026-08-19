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
