"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, Wrench, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function BientotDisponiblePage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="relative min-h-[80vh] flex items-center justify-center px-4 md:px-10 pt-24 md:pt-28">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,0,127,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,0,127,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 flex justify-start"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors font-[family-name:var(--font-space-grotesk)] text-xs uppercase tracking-widest"
            >
              <ArrowLeft size={16} />
              Retour
            </Link>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-8"
          >
            <Clock size={14} className="text-primary" />
            <span className="text-primary font-[family-name:var(--font-space-grotesk)] text-xs uppercase tracking-widest">
              Bientôt disponible
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-[family-name:var(--font-space-grotesk)] text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter mb-6"
          >
            EN <span className="text-primary">CRÉATION</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-on-surface-variant font-[family-name:var(--font-manrope)] text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            Nos mécanos sont en train de régler cette fonctionnalité. 
            Reviens vite pour découvrir ce qui t&apos;attend.
          </motion.p>

          {/* Teaser cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-surface-container p-6 border border-primary/20 rounded-lg">
              <Wrench size={32} className="text-primary mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-white uppercase tracking-wider text-sm mb-2">
                En cours
              </h3>
              <p className="text-on-surface-variant text-xs">
                Nos devs sont sur le coup
              </p>
            </div>
            <div className="bg-surface-container p-6 border border-primary/20 rounded-lg">
              <Sparkles size={32} className="text-primary mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-white uppercase tracking-wider text-sm mb-2">
                Top Secret
              </h3>
              <p className="text-on-surface-variant text-xs">
                On prépare quelque chose de gros
              </p>
            </div>
            <div className="bg-surface-container p-6 border border-primary/20 rounded-lg">
              <Clock size={32} className="text-primary mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-white uppercase tracking-wider text-sm mb-2">
                Patience
              </h3>
              <p className="text-on-surface-variant text-xs">
                Ça arrive très bientôt
              </p>
            </div>
          </motion.div>

          {/* Mystery teaser */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-surface-variant/50 border border-primary/20 rounded-lg p-8 backdrop-blur-sm"
          >
            <p className="text-on-surface-variant font-[family-name:var(--font-manrope)] text-sm uppercase tracking-widest mb-4">
              MYSTÈRE
            </p>
            <div className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-6xl font-black text-primary tracking-tighter">
              ???
            </div>
            <p className="text-on-surface-variant text-xs mt-4">
              Stay tuned...
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
