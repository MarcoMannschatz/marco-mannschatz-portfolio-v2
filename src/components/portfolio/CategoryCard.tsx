import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { CategoryData } from "./types";

function mediaCount(cat: CategoryData): number {
  if (cat.clients) {
    return cat.clients.reduce((sum, client) => sum + client.media.length, 0);
  }
  return cat.media.length;
}

export default function CategoryCard({
  cat,
  idx,
  t,
  onOpen,
}: {
  cat: CategoryData;
  idx: number;
  t: (de: string, en: string) => string;
  onOpen: (id: string) => void;
}) {
  const hasClients = !!cat.clients?.length;
  const isVideo = cat.cover.endsWith(".mp4");
  const total = mediaCount(cat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      className="group relative overflow-hidden cursor-pointer"
      onClick={() => onOpen(cat.id)}
    >
      <div className={`relative aspect-[3/4] overflow-hidden ${isVideo ? "bg-white" : hasClients ? "bg-neutral-900" : ""}`}>
        {isVideo ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              src={cat.cover}
              autoPlay
              loop
              muted
              playsInline
              className="max-w-[85%] max-h-[70%] object-contain grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
            />
          </div>
        ) : hasClients ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
            <img
              src={cat.cover}
              alt={t(cat.title.de, cat.title.en)}
              loading="lazy"
              className="max-w-[90%] max-h-[60%] object-contain grayscale brightness-200 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
            />
          </div>
        ) : (
          <img
            src={cat.cover}
            alt={t(cat.title.de, cat.title.en)}
            loading="lazy"
            className="w-full h-full object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
          />
        )}
        <div
          className={`absolute inset-0 ${
            isVideo ? "bg-transparent" : hasClients ? "bg-black/10 group-hover:bg-black/0" : "bg-black/30 group-hover:bg-black/10"
          } transition-colors duration-700`}
        />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] mb-2 ${isVideo ? "text-neutral-500" : "text-white/60"}`}>
            {cat.subtitle}
          </p>
          <h3
            className={`text-2xl md:text-3xl font-bold uppercase tracking-tight leading-[0.95] ${isVideo ? "text-neutral-900" : "text-white"}`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t(cat.title.de, cat.title.en)}
          </h3>
          <div
            className={`mt-3 flex items-center gap-2 transition-colors duration-500 ${
              isVideo ? "text-neutral-500 group-hover:text-neutral-900" : "text-white/70 group-hover:text-white"
            }`}
          >
            <span className="text-xs uppercase tracking-[0.15em] font-semibold">
              {total} {total === 1 ? "Arbeit" : "Arbeiten"}
            </span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
