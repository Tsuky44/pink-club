"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Link2, Check, Trash2, MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Photo } from "@/actions/galleryActions";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}

interface LightboxProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onKudo: () => void;
  onDelete?: () => void;
  hasVoted: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Lightbox({
  photo,
  isOpen,
  onClose,
  onKudo,
  onDelete,
  hasVoted,
}: LightboxProps) {
  const [copied, setCopied] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  // Polling des commentaires toutes les 5 secondes (pas de WebSocket!)
  const { data: commentsData, mutate: mutateComments } = useSWR<{ comments: Comment[] }>(
    photo ? `/api/photos/${photo.id}/comments` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

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
      const absoluteUrl = `${window.location.origin}${photo.imageUrl}`;
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erreur copie:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !photo || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch(`/api/photos/${photo.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      setNewComment("");
      mutateComments(); // Rafraîchir les commentaires
    } catch (err) {
      console.error("Erreur envoi commentaire:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!photo) return null;

  const comments = commentsData?.comments || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Main container - Layout desktop: image à gauche, commentaires à droite */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-6xl max-h-[95vh] mx-4 flex flex-col lg:flex-row bg-black lg:bg-transparent gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image section */}
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div className="relative">
                <Image
                  src={photo.imageUrl}
                  alt={`${photo.carModel} par ${photo.photographerName}`}
                  width={1200}
                  height={800}
                  className="w-full h-auto max-h-[60vh] lg:max-h-[85vh] object-contain"
                  priority
                />

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <div className="flex flex-col sm:flex-row items-end justify-between gap-3">
                    <div>
                      <h3 className="font-[family-name:var(--font-space-grotesk)] font-black text-2xl text-primary uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(255,0,127,0.8)]">
                        {photo.photographerName}
                      </h3>
                      <p className="font-[family-name:var(--font-manrope)] text-sm text-secondary tracking-widest uppercase font-bold mt-1">
                        {photo.carModel}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle comments */}
                      <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-2 px-3 py-2 transition-all active:scale-95 ${
                          showComments
                            ? "bg-primary/30 border border-primary"
                            : "bg-surface-variant/60 border border-white/20 hover:bg-primary/20"
                        }`}
                      >
                        <MessageCircle size={18} className="text-primary" />
                        <span className="font-[family-name:var(--font-space-grotesk)] text-primary font-bold text-sm tracking-widest">
                          {comments.length > 0 ? comments.length : "COM"}
                        </span>
                        {showComments ? (
                          <ChevronUp size={16} className="text-primary" />
                        ) : (
                          <ChevronDown size={16} className="text-primary" />
                        )}
                      </button>

                      {/* Copy link */}
                      <button
                        onClick={handleCopyLink}
                        className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-primary/80 transition-colors"
                      >
                        {copied ? (
                          <Check size={18} className="text-green-400" />
                        ) : (
                          <Link2 size={18} className="text-white" />
                        )}
                      </button>

                      {/* Kudos */}
                      <button
                        onClick={onKudo}
                        className={`flex items-center gap-2 px-4 py-2 transition-all active:scale-95 ${
                          hasVoted
                            ? "bg-secondary/30 border border-secondary shadow-[0_0_15px_rgba(0,238,252,0.2)]"
                            : "bg-secondary/10 border border-secondary/40 hover:bg-secondary/30"
                        }`}
                      >
                        <Heart
                          size={18}
                          className={`text-secondary ${hasVoted ? "fill-secondary" : ""}`}
                        />
                        <span className="font-[family-name:var(--font-space-grotesk)] text-secondary font-bold text-sm tracking-widest">
                          {photo.kudos >= 1000 ? (photo.kudos / 1000).toFixed(1) + "K" : photo.kudos}
                        </span>
                      </button>

                      {/* Delete */}
                      {onDelete && (
                        <button
                          onClick={onDelete}
                          className="w-10 h-10 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-500/40 flex items-center justify-center hover:bg-red-500/40 transition-colors"
                          title="Supprimer ma photo"
                        >
                          <Trash2 size={18} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments section - Collapsible */}
            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0, width: 0 }}
                  animate={{ opacity: 1, height: "auto", width: "auto" }}
                  exit={{ opacity: 0, height: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="lg:w-[350px] lg:max-h-[85vh] flex flex-col bg-surface-container/95 lg:bg-black/40 lg:backdrop-blur-md border border-surface-variant lg:border-white/10 rounded-lg overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-surface-variant flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle size={18} className="text-primary" />
                      <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm uppercase tracking-widest">
                        Commentaires ({comments.length})
                      </span>
                    </div>
                    <button
                      onClick={() => setShowComments(false)}
                      className="text-on-surface-variant hover:text-white transition-colors lg:hidden"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Comments list */}
                  <div 
                    ref={commentsRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[40vh] lg:max-h-[60vh]"
                  >
                    {comments.length === 0 ? (
                      <p className="text-on-surface-variant text-sm text-center py-8">
                        Aucun commentaire. Sois le premier !
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                            {(comment.user.name || comment.user.username || "?")[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm text-white truncate">
                                {comment.user.name || comment.user.username || "Anonyme"}
                              </span>
                              <span className="text-on-surface-variant text-xs flex-shrink-0">
                                {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-on-surface break-words">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Comment input */}
                  {session?.user ? (
                    <form onSubmit={handleSubmitComment} className="p-4 border-t border-surface-variant">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Ajouter un commentaire..."
                          maxLength={500}
                          className="flex-1 bg-surface-variant border border-white/10 text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-primary transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={!newComment.trim() || isSubmitting}
                          className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                      <p className="text-on-surface-variant text-xs mt-2 text-right">
                        {newComment.length}/500
                      </p>
                    </form>
                  ) : (
                    <div className="p-4 border-t border-surface-variant">
                      <p className="text-on-surface-variant text-sm text-center">
                        <button onClick={onClose} className="text-primary hover:underline">
                          Connecte-toi
                        </button>{" "}
                        pour commenter
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
