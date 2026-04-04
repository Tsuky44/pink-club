"use client";

import { useState } from "react";
import { Tilt_Neon } from "next/font/google";
import { GalleryGrid } from "@/components/wall-of-fame/GalleryGrid";
import { UploadButton } from "@/components/wall-of-fame/UploadButton";
import Navbar from "@/components/Navbar";
import Image from "next/image";

const tiltNeon = Tilt_Neon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tilt-neon",
});

interface WallOfFameClientProps {
  topPhotos: any[];
  initialPhotos: any[];
}

export function WallOfFameClient({ initialPhotos }: WallOfFameClientProps) {
  const [activeFilter, setActiveFilter] = useState<'recent' | 'kudos' | 'drivers'>('recent');

  const filters = [
    { key: 'recent', label: 'Récent' },
    { key: 'kudos', label: 'Plus de Kudos' },
    { key: 'drivers', label: 'Pilotes' },
  ] as const;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24">
        {/* Hero Section */}
        <section className="relative h-[614px] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface" />
          <Image
            src="/zr.png"
            alt="ZR car background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-surface z-[1]" />

        <div className="relative z-10 space-y-4">
          <h1 className={`text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none ${tiltNeon.variable} font-[family-name:var(--font-tilt-neon)]`}
            style={{
              color: "#fff0f5",
              textShadow: `
                0 0 7px rgba(255, 0, 127, 1),
                0 0 10px rgba(255, 0, 127, 1),
                0 0 21px rgba(255, 0, 127, 1),
                0 0 42px rgba(255, 0, 127, 0.9),
                0 0 82px rgba(255, 0, 127, 0.7),
                0 0 92px rgba(255, 0, 127, 0.6),
                0 0 102px rgba(255, 0, 127, 0.5),
                0 0 150px rgba(255, 0, 127, 0.3),
                0 0 200px rgba(255, 0, 127, 0.2),
                0 0 300px rgba(255, 0, 127, 0.1)
              `,
            }}
          >
            WALL OF FAME
          </h1>
          <p className="font-[family-name:var(--font-manrope)] text-secondary tracking-[0.2em] uppercase text-sm md:text-xl max-w-2xl mx-auto font-semibold">
            L'ÉLITE DE LA RUE. VOTE POUR LES MEILLEURES PRÉPAS DE LOS SANTOS.
          </p>
        </div>
      </section>

      {/* Top Contenders Section */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-surface-variant pb-8 gap-6">
          <div className="space-y-1">
            <span className="text-primary font-[family-name:var(--font-space-grotesk)] text-xs tracking-widest uppercase">Choix de la Communauté</span>
            <h2 className="text-4xl font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-tight">Top Contenders</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-6 py-2 font-[family-name:var(--font-space-grotesk)] text-xs uppercase tracking-widest transition-colors ${
                  activeFilter === f.key
                    ? "bg-surface-variant text-secondary border-l-2 border-secondary"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-variant"
                }`}
              >
                {f.label}
                {f.key === 'recent' && (
                  <span className="ml-2 text-primary">({initialPhotos.length})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <GalleryGrid photos={initialPhotos} isTopSection={true} filter={activeFilter} />
      </section>

      {/* Upload Section */}
      <section className="bg-surface-container py-24 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        <div className="max-w-screen-xl mx-auto px-6 text-center space-y-12 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-[family-name:var(--font-space-grotesk)] font-black uppercase tracking-tighter text-on-surface">
              ENVOIE TA PHOTO. <br />
              <span className="text-primary drop-shadow-[0_0_10px_rgba(255,0,127,0.8)]">INSCRIS TON NOM DANS L'HISTOIRE.</span>
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto text-sm md:text-base tracking-wider">
              Télécharge ta capture d&apos;écran, obtiens un lien de suppression sécurisé, et laisse la communauté décider si tu mérites une place au Wall of Fame.
            </p>
          </div>
          <UploadButton />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-surface py-8">
        <div className="max-w-screen-2xl mx-auto px-6 text-center">
          <p className="text-on-surface-variant text-xs tracking-widest uppercase">
            THE PINK CLUB © 2026 • LOS SANTOS
          </p>
        </div>
      </footer>
    </main>
    </>
  );
}
