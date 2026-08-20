import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { content } from "@/lib/content";
import CategoryCard from "./CategoryCard";
import ClientGrid from "./ClientGrid";
import MediaGallery from "./MediaGallery";
import Lightbox from "./Lightbox";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

export default function PortfolioSection() {
  const { t } = useLanguage();
  const c = content.portfolio;
  const categories = c.categories;

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [activeClientId, setActiveClientId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeCat = activeCategoryId ? categories.find((cat) => cat.id === activeCategoryId) ?? null : null;
  const activeClient = activeCat?.clients?.find((cl) => cl.id === activeClientId) ?? null;
  const hasClients = !!activeCat?.clients?.length;

  const activeMedia = activeClient ? activeClient.media : activeCat ? activeCat.media : [];

  const scrollToPortfolio = useCallback(() => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const openCategory = useCallback(
    (id: string) => {
      setActiveCategoryId(id);
      setActiveClientId(null);
      setLightboxIndex(null);
      scrollToPortfolio();
    },
    [scrollToPortfolio]
  );

  const openClient = useCallback(
    (clientId: string) => {
      setActiveClientId(clientId);
      setLightboxIndex(null);
      scrollToPortfolio();
    },
    [scrollToPortfolio]
  );

  const backToCategory = useCallback(() => {
    setActiveClientId(null);
    setLightboxIndex(null);
    scrollToPortfolio();
  }, [scrollToPortfolio]);

  const closeCategory = useCallback(() => {
    setActiveCategoryId(null);
    setActiveClientId(null);
    setLightboxIndex(null);
  }, []);

  const navigateLightbox = useCallback(
    (direction: "prev" | "next") => {
      setLightboxIndex((current) => {
        if (current === null || activeMedia.length === 0) return current;
        return direction === "next" ? (current + 1) % activeMedia.length : (current - 1 + activeMedia.length) % activeMedia.length;
      });
    },
    [activeMedia.length]
  );

  const view: "overview" | "clients" | "clientDetail" | "gallery" = !activeCat
    ? "overview"
    : activeClient
    ? "clientDetail"
    : hasClients
    ? "clients"
    : "gallery";

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container">
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
          className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[0.9] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t(c.title.de, c.title.en)}
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={1.5}
          variants={fadeUp}
          className="text-sm md:text-base text-foreground/50 max-w-xl mb-12 md:mb-16"
        >
          {t(c.subtitle.de, c.subtitle.en)}
        </motion.p>

        <AnimatePresence mode="wait">
          {view === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {categories.map((cat, idx) => (
                <CategoryCard key={cat.id} cat={cat} idx={idx} t={t} onOpen={openCategory} />
              ))}
            </motion.div>
          ) : view === "clients" && activeCat ? (
            <motion.div
              key={`clients-${activeCategoryId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <BackButton onClick={closeCategory} label={t(c.back.de, c.back.en)} />
              <CategoryHeader subtitle={activeCat.subtitle} title={t(activeCat.title.de, activeCat.title.en)} description={t(activeCat.description.de, activeCat.description.en)} />
              <ClientGrid clients={activeCat.clients ?? []} onOpen={openClient} />
            </motion.div>
          ) : view === "clientDetail" && activeCat && activeClient ? (
            <motion.div
              key={`client-${activeClientId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <BackButton onClick={backToCategory} label={`${t("Zurück zu", "Back to")} ${t(activeCat.title.de, activeCat.title.en)}`} />
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-2">{activeCat.subtitle}</p>
                <h3
                  className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.9] mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {activeClient.name}
                </h3>
              </div>
              <MediaGallery items={activeClient.media} aspectRatio={activeCat.aspectRatio} onOpen={setLightboxIndex} />
            </motion.div>
          ) : activeCat ? (
            <motion.div
              key={`gallery-${activeCategoryId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <BackButton onClick={closeCategory} label={t(c.back.de, c.back.en)} />
              <CategoryHeader subtitle={activeCat.subtitle} title={t(activeCat.title.de, activeCat.title.en)} description={t(activeCat.description.de, activeCat.description.en)} />
              <MediaGallery items={activeCat.media} aspectRatio={activeCat.aspectRatio} onOpen={setLightboxIndex} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && activeMedia.length > 0 && (
          <Lightbox
            items={activeMedia}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={navigateLightbox}
            closeLabel={t(c.detailClose.de, c.detailClose.en)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors mb-8 group">
      <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
      <span className="text-xs font-semibold uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function CategoryHeader({ subtitle, title, description }: { subtitle: string; title: string; description: string }) {
  return (
    <div className="mb-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-2">{subtitle}</p>
      <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-[0.9] mb-4" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h3>
      <p className="text-sm md:text-base text-foreground/60 max-w-2xl leading-relaxed">{description}</p>
    </div>
  );
}
