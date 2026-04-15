"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tilt_Neon } from "next/font/google";

const tiltNeon = Tilt_Neon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tilt-neon",
});

const neonStyle = {
  color: "#ffffff",
  textShadow: `
    0 0 5px rgba(0, 238, 252, 0.8),
    0 0 10px rgba(0, 238, 252, 0.6),
    0 0 20px rgba(0, 238, 252, 0.4),
    0 0 40px rgba(0, 238, 252, 0.2)
  `,
};

export default function LocationHero() {
  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-start px-4 md:px-10 pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/location-drift.png"
          alt="Location drift background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/50 to-surface" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 238, 252, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(0, 238, 252, 0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border-l-2 border-secondary font-[family-name:var(--font-space-grotesk)] text-secondary font-bold italic tracking-widest text-xs uppercase">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            CIRCUIT OUVERT
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none ${tiltNeon.variable} font-[family-name:var(--font-tilt-neon)] mb-6`}
          style={neonStyle}
        >
          CIRCUIT
          <br />
          <span className="text-secondary">& LOCATION</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-[family-name:var(--font-space-grotesk)] text-xl md:text-2xl font-light italic tracking-widest text-white/80 max-w-2xl mb-10"
        >
          DOMINEZ L&apos;ASPHALTE. PAS DE VOITURE ?{" "}
          <span className="text-primary font-bold">PAS DE PROBLÈME.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            href="#flotte"
            className="px-8 py-4 bg-secondary text-on-secondary font-[family-name:var(--font-space-grotesk)] font-black italic tracking-widest text-sm uppercase transition-all hover:shadow-[0_0_30px_rgba(0,238,252,0.5)] hover:bg-secondary/90 active:scale-95"
          >
            VOIR LA FLOTTE
          </Link>
          <Link
            href="#protocole"
            className="px-8 py-4 border border-white/30 text-white font-[family-name:var(--font-space-grotesk)] font-black italic tracking-widest text-sm uppercase hover:bg-white/5 transition-all active:scale-95"
          >
            COMMENT ÇA MARCHE
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-10 left-4 md:left-10 flex items-center gap-4"
      >
        <div className="w-12 h-[2px] bg-secondary shadow-[0_0_10px_#00eefc]" />
        <span className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold text-secondary tracking-[0.3em] uppercase italic">
          EST. 2026 / DISTRICT DE LOS SANTOS
        </span>
      </motion.div>
    </section>
  );
}
