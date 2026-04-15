"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Tilt_Neon } from "next/font/google";

const tiltNeon = Tilt_Neon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tilt-neon",
});

export default function ContactHero() {
  return (
    <section className="relative pt-40 pb-24 px-4 md:px-10 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/equipe.png"
          alt="Equipe background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/50 to-surface" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 0, 127, 0.15) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 0, 127, 0.15) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border-l-2 border-primary font-[family-name:var(--font-space-grotesk)] text-primary font-bold italic tracking-widest text-xs uppercase">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            ELITE AUTO
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter leading-none ${tiltNeon.variable} font-[family-name:var(--font-tilt-neon)] mb-6`}
          style={{
            color: "#ffffff",
            textShadow: `
              0 0 5px rgba(255, 0, 127, 0.8),
              0 0 10px rgba(255, 0, 127, 0.6),
              0 0 20px rgba(255, 0, 127, 0.4),
              0 0 40px rgba(255, 0, 127, 0.2)
            `,
          }}
        >
          CONTACT
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-[family-name:var(--font-manrope)] text-on-surface-variant max-w-2xl text-base md:text-lg uppercase tracking-widest leading-relaxed"
        >
          Pour toute demande concernant la location du parking ou autre,{" "}
          <span className="text-primary font-bold">passez par l&apos;intranet de l&apos;Elite Auto.</span>
        </motion.p>
      </div>
    </section>
  );
}
