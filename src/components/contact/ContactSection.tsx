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
