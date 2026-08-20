import { useRef } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { MediaItem } from "./types";

export default function VideoCard({
  item,
  onClick,
  aspectRatio,
}: {
  item: MediaItem;
  onClick: () => void;
  aspectRatio?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden cursor-pointer"
      style={{ aspectRatio: aspectRatio || "4/5" }}
      onClick={onClick}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <video
        ref={videoRef}
        src={item.url}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-70 group-hover:opacity-0 transition-opacity duration-500">
          <Play className="w-5 h-5 md:w-6 md:h-6 text-white fill-white ml-0.5" />
        </div>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
    </motion.div>
  );
}
