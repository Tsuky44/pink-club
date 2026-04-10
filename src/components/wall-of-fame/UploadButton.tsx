"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Lock } from "lucide-react";
import { UploadModal } from "./UploadModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function UploadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login?callbackUrl=/wall-of-fame");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          disabled={status === "loading"}
          className="flex items-center gap-4 bg-primary px-10 py-5 text-on-primary font-[family-name:var(--font-space-grotesk)] font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(255,0,127,0.4)] transition-all active:opacity-70 group mx-auto disabled:opacity-50"
        >
          <Camera size={28} />
          <span>UPLOAD TA PHOTO →</span>
        </motion.button>

        {!session && status !== "loading" && (
          <p className="flex items-center gap-2 text-on-surface-variant text-xs uppercase tracking-widest">
            <Lock size={12} />
            Connexion requise pour uploader
          </p>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <UploadModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
