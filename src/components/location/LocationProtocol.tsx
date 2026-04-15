"use client";

import { Tilt_Neon } from "next/font/google";
import { Car, Timer, Flame } from "lucide-react";
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

const steps = [
  {
    number: "01",
    icon: Car,
    title: "SÉLECTIONNEZ VOTRE VOITURE",
    description:
      "Faites votre choix parmi notre flotte haute performance. Des chassis optimisées aux FD de compétition. La location inclut carburant et assistance technique complète.",
    borderClass: "border-secondary/20 hover:border-secondary",
    numberClass: "text-secondary/10 group-hover:text-secondary/20",
    iconClass: "text-secondary",
    titleClass: "group-hover:text-secondary",
    cornerClass: "from-secondary/20",
  },
  {
    number: "02",
    icon: Timer,
    title: "RÉSERVEZ VOTRE CRÉNEAU",
    description:
      "Sécurisez votre place sur notre circuit. Sessions libres ou coaching privé disponibles pour tous niveaux.",
    borderClass: "border-primary/20 hover:border-primary",
    numberClass: "text-primary/10 group-hover:text-primary/20",
    iconClass: "text-primary",
    titleClass: "group-hover:text-primary",
    cornerClass: "from-primary/20",
  },
  {
    number: "03",
    icon: Flame,
    title: "ENTREZ DANS LA LÉGENDE",
    description:
      "Donnez tout sur la piste. Perfectionnez vos trajectoires et rejoignez le cercle fermé des pilotes d'exception. Photos et vidéos de votre session incluses.",
    borderClass: "border-tertiary/20 hover:border-tertiary",
    numberClass: "text-tertiary/10 group-hover:text-tertiary/20",
    iconClass: "text-tertiary",
    titleClass: "group-hover:text-tertiary",
    cornerClass: "from-tertiary/20",
  },
];

export default function LocationProtocol() {
  return (
    <section id="protocole" className="py-24 md:py-32 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2
              className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${tiltNeon.variable} font-[family-name:var(--font-tilt-neon)]`}
              style={neonStyle}
            >
              LE PROTOCOLE
            </h2>
            <div className="h-1 w-32 bg-primary shadow-[0_0_15px_#ff007f] mt-3" />
          </div>
          <p className="font-[family-name:var(--font-manrope)] text-on-surface-variant max-w-md text-right uppercase text-xs tracking-widest leading-relaxed">
            UNE EXPÉRIENCE DE DRIFT SANS COMPROMIS. SUIVEZ CHAQUE ÉTAPE POUR
            MAÎTRISER L&apos;ASPHALTE DU PINK CLUB.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.1}>
              <div
                className={`group relative p-8 bg-surface-container border-l-2 border-t-2 ${step.borderClass} transition-all duration-300`}
              >
              <div
                className={`absolute top-4 right-4 font-[family-name:var(--font-space-grotesk)] font-black text-7xl italic tracking-tighter ${step.numberClass} transition-colors`}
              >
                {step.number}
              </div>
              <step.icon className={`w-12 h-12 ${step.iconClass} mb-6`} />
              <h3
                className={`font-[family-name:var(--font-space-grotesk)] font-black text-2xl text-white italic uppercase tracking-widest mb-4 ${step.titleClass} transition-colors`}
              >
                {step.number}. {step.title}
              </h3>
              <p className="font-[family-name:var(--font-manrope)] text-on-surface-variant text-sm leading-relaxed">
                {step.description}
              </p>
              <div
                className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl ${step.cornerClass} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
              />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
