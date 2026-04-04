"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import NeonTitle from "./NeonTitle";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay z-0" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />

      {/* Background image - parking */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div
          className="w-full h-full bg-cover bg-center mix-blend-screen"
          style={{
            backgroundImage: `url('/parking.png')`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center flex flex-col items-center px-4">
        {/* Partnership badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-4 md:mb-6 inline-flex items-center gap-3 px-4 py-2 border border-secondary/30 bg-secondary/5 backdrop-blur-sm"
        >
          <span className="text-secondary text-[10px] tracking-[0.3em] font-bold uppercase">
            En partenariat avec
          </span>
          <span className="text-white text-xs tracking-widest font-black uppercase italic">
            Elite Auto
          </span>
        </motion.div>

        {/* Main title with neon effect */}
        <NeonTitle />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-4 md:mt-6 text-on-surface-variant font-[family-name:var(--font-manrope)] text-sm md:text-lg tracking-[0.2em] max-w-2xl uppercase"
        >
          L'ÉLITE DU DRIFT • LE CŒUR DE LA NUIT
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 md:mt-12 group"
        >
          <Link href="#garage">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 md:px-12 py-4 md:py-5 bg-primary text-white font-[family-name:var(--font-space-grotesk)] font-black text-base md:text-xl uppercase tracking-tighter overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(255,0,127,0.5)] animate-pulse-glow cursor-pointer"
            >
              REJOINDRE L&apos;AVENTURE
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
