"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

const cards = [
  {
    number: "01",
    title: "RASSEMBLEMENTS",
    description: "Le seul endroit où l'esthétique rencontre la violence pure. Montre ce que tu as sous le capot et impose ton style sur le parking.",
    link: "VOIR LA GALERIE",
    href: "/wall-of-fame",
    image: "/rassemblement.png",
    color: "primary",
  },
  {
    number: "02",
    title: "LOCATION DRIFT",
    description: "Pas de caisse préparée ? Aucun problème. Loue l'un de nos monstres réglés sur mesure pour avaler les virages en crabe.",
    link: "VOIR LA FLOTTE",
    href: "/location",
    image: "/location-drift.png",
    color: "secondary",
  },
  {
    number: "03",
    title: "SESSIONS DRIFT",
    description: "Chaos contrôlé. Maîtrisez la transition sur notre piste intérieure sur mesure.",
    link: "RÉSERVER LA PISTE",
    href: "/bientot-disponible",
    image: "/drift sessions.png",
    color: "tertiary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function Vibe() {
  return (
    <section id="concept" className="py-24 md:py-32 px-4 md:px-10 relative bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 gap-6"
        >
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black italic tracking-tighter font-[family-name:var(--font-space-grotesk)] uppercase">
              NOTRE <span className="text-primary">VIBE</span>
            </h2>
            <p className="text-on-surface-variant max-w-md font-[family-name:var(--font-manrope)] text-sm mt-4">
              L&apos;expérience underground ultime. Drift, tuning et culture automobile nocturne.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="font-[family-name:var(--font-space-grotesk)] text-8xl font-black opacity-5 select-none leading-none -mb-4">
              AUTHENTIC
            </div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {cards.map((card) => {
          const borderClass = card.color === "primary"
            ? "border-primary/10 hover:border-primary/50"
            : card.color === "secondary"
            ? "border-secondary/10 hover:border-secondary/50"
            : "border-tertiary/10 hover:border-tertiary/50";

          const badgeBgClass = card.color === "primary"
            ? "bg-primary"
            : card.color === "secondary"
            ? "bg-secondary"
            : "bg-tertiary";

          const linkTextClass = card.color === "primary"
            ? "text-primary"
            : card.color === "secondary"
            ? "text-secondary"
            : "text-tertiary";

          return (
            <FadeIn key={card.title} delay={cards.indexOf(card) * 0.15}>
              <Link href={card.href} className="block h-full">
                <div
                  className={`group relative overflow-hidden bg-surface-container border transition-all duration-500 cursor-pointer h-full flex flex-col ${borderClass}`}
                >
                {/* Image Container */}
                <div className="h-80 overflow-hidden relative shrink-0">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div className="p-8 relative flex flex-col flex-grow">
                  {/* Number Badge */}
                  <div className={`absolute -top-12 right-8 ${badgeBgClass} w-12 h-12 flex items-center justify-center font-[family-name:var(--font-space-grotesk)] font-black italic text-black`}>
                    {card.number}
                  </div>

                  {/* Title */}
                  <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold uppercase tracking-tighter mb-4">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-on-surface-variant font-[family-name:var(--font-manrope)] text-sm mb-6 leading-relaxed flex-grow">
                    {card.description}
                  </p>

                  {/* Link Button */}
                  <span className={`flex items-center gap-2 font-[family-name:var(--font-space-grotesk)] font-bold text-xs tracking-widest group-hover:gap-4 transition-all mt-auto ${linkTextClass}`}>
                    {card.link}
                    <ArrowRight size={16} />
                  </span>
                </div>
                </div>
              </Link>
            </FadeIn>
          );
        })}
        </div>
    </div>
  </section>
  );
}
