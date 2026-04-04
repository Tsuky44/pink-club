"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Link2, Check, Trash2 } from "lucide-react";
import Image from "next/image";
import { Photo } from "@/actions/galleryActions";

interface LightboxProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onKudo: () => void;
  onDelete?: () => void;
  hasVoted: boolean;
}

export function Lightbox({
  photo,
  isOpen,
  onClose,
  onKudo,
  onDelete,
  hasVoted,
}: LightboxProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleCopyLink = async () => {
    if (!photo) return;
    try {
      const absoluteUrl = `${window.location.origin}${photo.image_url}`;
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erreur copie:", error);
    }
  };

  if (!photo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Image container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-5xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photo.image_url}
              alt={`${photo.car_model} par ${photo.photographer_name}`}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[85vh] object-contain"
              priority
            />

            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
              <div className="flex flex-col md:flex-row items-end justify-between gap-4">
                <div>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-black text-3xl text-primary uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(255,0,127,0.8)]">
                    {photo.photographer_name}
                  </h3>
                  <p className="font-[family-name:var(--font-manrope)] text-sm text-secondary tracking-widest uppercase font-bold mt-1">
                    {photo.car_model}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Copy link */}
                  <button
                    onClick={handleCopyLink}
                    className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-primary/80 transition-colors"
                  >
                    {copied ? (
                      <Check size={20} className="text-green-400" />
                    ) : (
                      <Link2 size={20} className="text-white" />
                    )}
                  </button>

                  {/* Kudos */}
                  <button
                    onClick={onKudo}
                    className={`flex items-center gap-2 px-6 py-3 transition-all active:scale-95 ${
                      hasVoted
                        ? "bg-secondary/30 border border-secondary shadow-[0_0_15px_rgba(0,238,252,0.2)]"
                        : "bg-secondary/10 border border-secondary/40 hover:bg-secondary/30"
                    }`}
                  >
                    <Heart
                      size={20}
                      className={`text-secondary ${hasVoted ? "fill-secondary" : ""}`}
                    />
                    <span className="font-[family-name:var(--font-space-grotesk)] text-secondary font-bold text-sm tracking-widest">
                      {photo.kudos >= 1000 ? (photo.kudos / 1000).toFixed(1) + "K" : photo.kudos} KUDOS
                    </span>
                  </button>

                  {/* Delete (only for uploader) */}
                  {onDelete && (
                    <button
                      onClick={onDelete}
                      className="w-12 h-12 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/40 flex items-center justify-center hover:bg-red-500/40 transition-colors"
                      title="Supprimer ma photo"
                    >
                      <Trash2 size={20} className="text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
