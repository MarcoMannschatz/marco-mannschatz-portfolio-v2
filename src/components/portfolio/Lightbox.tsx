import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { MediaItem } from "./types";

export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
  closeLabel,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  closeLabel: string;
}) {
  const current = items[index];
  if (!current) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] text-white/70 hover:text-white transition-colors"
        aria-label={closeLabel}
      >
        <X className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("prev");
            }}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-[110] text-white/50 hover:text-white transition-colors p-2"
            aria-label="Previous"
          >
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate("next");
            }}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-[110] text-white/50 hover:text-white transition-colors p-2"
            aria-label="Next"
          >
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
          </button>
        </>
      )}

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {current.type === "video" ? (
          <video key={current.url} src={current.url} controls autoPlay playsInline className="max-w-full max-h-[85vh] object-contain" />
        ) : (
          <img src={current.url} alt={current.alt} className="max-w-full max-h-[85vh] object-contain" />
        )}
      </motion.div>

      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-semibold uppercase tracking-[0.2em]">
        {index + 1} / {items.length}
      </div>
    </motion.div>
  );
}
