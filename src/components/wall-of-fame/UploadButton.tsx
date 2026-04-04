"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera } from "lucide-react";
import { UploadModal } from "./UploadModal";

export function UploadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-4 bg-primary px-10 py-5 text-on-primary font-[family-name:var(--font-space-grotesk)] font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,127,0.4)] transition-all active:opacity-70 group mx-auto"
      >
        <Camera size={28} />
        <span>UPLOAD TA PHOTO →</span>
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <UploadModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
