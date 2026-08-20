import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ClientData } from "./types";

export default function ClientGrid({ clients, onOpen }: { clients: ClientData[]; onOpen: (clientId: string) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {clients.map((client, i) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="group relative overflow-hidden cursor-pointer"
          onClick={() => onOpen(client.id)}
        >
          <div className="relative aspect-square overflow-hidden bg-neutral-900 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4 md:p-5">
              <img
                src={client.cover}
                alt={client.name}
                loading="lazy"
                className="max-w-[85%] max-h-[75%] object-contain grayscale brightness-200 transition-all duration-500 ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110"
              />
            </div>
            <div className="px-3 pb-3 md:px-4 md:pb-4">
              <h4 className="text-sm md:text-base font-bold uppercase tracking-tight text-white/80 group-hover:text-white leading-tight transition-colors duration-300">
                {client.name}
              </h4>
              <div className="mt-1 flex items-center gap-1 text-white/40 group-hover:text-white/70 transition-colors duration-300">
                <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
