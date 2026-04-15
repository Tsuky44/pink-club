"use client";

import Link from "next/link";
import { Tilt_Neon } from "next/font/google";
import { ArrowRight } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const tiltNeon = Tilt_Neon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tilt-neon",
});

const neonStyle = {
  color: "#ffffff",
  textShadow: `
    0 0 4px rgba(0, 238, 252, 0.6),
    0 0 10px rgba(0, 238, 252, 0.4),
    0 0 20px rgba(0, 238, 252, 0.2)
  `,
};

const stats = [
  { value: "∞", label: "PASSION" },
  { value: "∞", label: "LIMITE DE BRUIT" },
  { value: "12", label: "STANDS VIP" },
  { value: "100%", label: "ADRÉNALINE" },
];

export default function LocationEvents() {
  return (
    <section className="relative py-32 md:py-40 px-4 md:px-10 overflow-hidden">
      <div className="absolute inset-0 bg-surface">
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-low to-black" />
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-full bg-tertiary/5 blur-[150px] rounded-full" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-full bg-primary/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <FadeIn direction="none">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-tertiary" />
            <span className="font-[family-name:var(--font-space-grotesk)] text-tertiary font-black italic tracking-[0.5em] text-sm uppercase">
              PREMIUM ACCESS
            </span>
            <div className="h-[1px] w-12 bg-tertiary" />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2
            className={`text-4xl sm:text-5xl md:text-7xl font-black uppercase mb-8 tracking-tighter leading-tight ${tiltNeon.variable} font-[family-name:var(--font-tilt-neon)]`}
            style={neonStyle}
          >
            ÉVÉNEMENTS PRIVÉS
            <br />
            <span className="text-secondary">& PROFESSIONNELS</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="font-[family-name:var(--font-manrope)] text-on-surface-variant max-w-2xl mx-auto text-base md:text-lg mb-12 uppercase tracking-wide leading-relaxed">
            Élevez le standing de vos rencontres. Nous proposons la privatisation complète
            de la piste pour les entreprises, les clubs privés et les passionnés d&apos;automobile.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-surface-container-highest border-2 border-tertiary/50 hover:border-tertiary transition-all active:scale-95"
          >
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-tertiary" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-tertiary" />
            <span className="font-[family-name:var(--font-space-grotesk)] font-black text-white italic text-lg tracking-[0.2em] uppercase group-hover:text-tertiary transition-colors">
              ORGANISER UN ÉVÉNEMENT
            </span>
            <ArrowRight className="w-6 h-6 text-tertiary group-hover:translate-x-1 transition-transform" />
          </Link>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-[family-name:var(--font-space-grotesk)] text-3xl md:text-4xl font-black text-white italic">
                  {stat.value}
                </span>
                <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] text-tertiary font-bold tracking-widest uppercase mt-2">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
