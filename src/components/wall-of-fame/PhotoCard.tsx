"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Link2, Check } from "lucide-react";
import { Photo } from "@/actions/galleryActions";

interface PhotoCardProps {
  photo: Photo;
  rank?: number;
  onClick?: () => void;
  onKudo?: () => void;
  hasVoted?: boolean;
}

// Helper to get voted photos from localStorage
const getVotedPhotos = (): number[] => {
  if (typeof window === "undefined") return [];
  const voted = localStorage.getItem("pink-club-voted-photos");
  return voted ? JSON.parse(voted) : [];
};

// Helper to save voted photo
const saveVotedPhoto = (photoId: number) => {
  const voted = getVotedPhotos();
  if (!voted.includes(photoId)) {
    voted.push(photoId);
    localStorage.setItem("pink-club-voted-photos", JSON.stringify(voted));
  }
};

// Helper to remove voted photo
const removeVotedPhoto = (photoId: number) => {
  const voted = getVotedPhotos();
  const updated = voted.filter((id) => id !== photoId);
  localStorage.setItem("pink-club-voted-photos", JSON.stringify(updated));
};

export function PhotoCard({ photo, rank, onClick, onKudo, hasVoted }: PhotoCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const absoluteUrl = `${window.location.origin}${photo.image_url}`;
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erreur copie:", error);
    }
  };

  const formatKudos = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return (
    <div 
      className="relative group overflow-hidden border border-white/10 hover:border-secondary transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,238,252,0.3)] cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <Image
        src={photo.image_url}
        alt={`${photo.car_model} par ${photo.photographer_name}`}
        width={600}
        height={400}
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Copy Link Button (visible au hover) */}
      <button
        onClick={handleCopyLink}
        className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-primary/80 transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? (
          <Check size={16} className="text-green-400" />
        ) : (
          <Link2 size={16} className="text-white" />
        )}
      </button>

      {/* Info en bas - Style Stitch */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col md:flex-row items-end justify-between gap-4">
        <div>
          <h3 className="font-[family-name:var(--font-space-grotesk)] font-black text-2xl text-primary uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(255,0,127,0.8)] leading-tight">
            {photo.photographer_name}
          </h3>
          <p className="font-[family-name:var(--font-manrope)] text-xs text-secondary tracking-widest uppercase font-bold mt-1">
            {photo.car_model} {rank && `• #${String(rank).padStart(2, "0")}`}
          </p>
        </div>
        
        {/* Bouton Kudos - Style Stitch */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onKudo?.();
          }}
          className={`flex items-center gap-2 px-5 py-2.5 transition-all active:scale-95 ${
            hasVoted
              ? "bg-secondary/30 border border-secondary shadow-[0_0_15px_rgba(0,238,252,0.2)]"
              : "bg-secondary/10 border border-secondary/40 hover:bg-secondary/30"
          }`}
        >
          <Heart 
            size={16} 
            className={`text-secondary ${hasVoted ? "fill-secondary" : ""}`} 
          />
          <span className="font-[family-name:var(--font-space-grotesk)] text-secondary font-bold text-xs tracking-widest">
            {formatKudos(photo.kudos)} KUDOS
          </span>
        </button>
      </div>
    </div>
  );
}
