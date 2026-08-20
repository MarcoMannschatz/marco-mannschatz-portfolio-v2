import { motion } from "framer-motion";
import type { MediaItem } from "./types";
import VideoCard from "./VideoCard";

export default function MediaGallery({
  items,
  aspectRatio,
  onOpen,
}: {
  items: MediaItem[];
  aspectRatio?: string;
  onOpen: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {items.map((item, i) =>
        item.type === "video" ? (
          <VideoCard key={i} item={item} onClick={() => onOpen(i)} aspectRatio={aspectRatio} />
        ) : (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="group relative overflow-hidden cursor-pointer"
            style={{ aspectRatio: aspectRatio || "4/5" }}
            onClick={() => onOpen(i)}
          >
            <img
              src={item.url}
              alt={item.alt}
              loading="lazy"
              className="w-full h-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </motion.div>
        )
      )}
    </div>
  );
}
