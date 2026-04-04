"use client";

import { motion } from "framer-motion";
import { Car, Key, Gauge, ArrowRight } from "lucide-react";

const cards = [
  {
    icon: Car,
    title: "Rassemblements",
    description: "Le seul endroit où l'esthétique rencontre la violence pure. Montre ce que tu as sous le capot et impose ton style sur le parking.",
    link: "VOIR LA GALERIE",
    color: "primary",
  },
  {
    icon: Key,
    title: "LOCATION DRIFT",
    description: "Pas de caisse préparée ? Aucun problème. Loue l'un de nos monstres réglés sur mesure pour avaler les virages en crabe.",
    link: "VOIR LA FLOTTE",
    color: "secondary",
  },
  {
    icon: Gauge,
    title: "Sessions Drift",
    description: "Chaos contrôlé. Maîtrisez la transition sur notre piste intérieure sur mesure.",
    link: "RÉSERVER LA PISTE",
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
    <section id="concept" className="py-24 md:py-32 px-4 md:px-10 max-w-7xl mx-auto relative">
      {/* Background glow */}
      <div className="absolute -left-20 top-40 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 gap-6"
      >
        <div>
          <span className="text-secondary font-[family-name:var(--font-space-grotesk)] font-bold tracking-[0.4em] text-xs md:text-sm uppercase">
            01 // IDENTITÉ
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black italic tracking-tighter font-[family-name:var(--font-space-grotesk)] uppercase mt-4">
            NOTRE AMBIANCE
          </h2>
        </div>
        <p className="text-on-surface-variant max-w-xs font-[family-name:var(--font-manrope)] text-xs md:text-sm uppercase tracking-wider leading-relaxed pb-2">
          Là où la précision rencontre l&apos;asphalte. Nous ne sommes pas qu&apos;un garage ; nous sommes le pouls de la scène underground.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          const colorClasses = {
            primary: "text-primary hover:border-primary/50",
            secondary: "text-secondary hover:border-secondary/50",
            tertiary: "text-tertiary hover:border-tertiary/50",
          };
          const lineColors = {
            primary: "bg-primary",
            secondary: "bg-secondary",
            tertiary: "bg-tertiary",
          };

          return (
            <motion.div
              key={card.title}
              variants={itemVariants}
              className={`glass-panel p-6 md:p-10 group transition-all duration-500 relative overflow-hidden cursor-pointer h-full flex flex-col ${colorClasses[card.color as keyof typeof colorClasses]}`}
            >
              {/* Animated line on hover */}
              <div
                className={`absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-700 ${lineColors[card.color as keyof typeof lineColors]}`}
              />

              {/* Icon */}
              <div className={`mb-6 md:mb-8 ${card.color === "primary" ? "text-primary" : card.color === "secondary" ? "text-secondary" : "text-tertiary"}`}>
                <Icon size={40} strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-space-grotesk)] font-bold italic uppercase tracking-tighter mb-4">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-on-surface-variant font-[family-name:var(--font-manrope)] text-xs md:text-sm leading-relaxed mb-6 md:mb-8 flex-grow">
                {card.description}
              </p>

              {/* Link */}
              <div
                className={`flex items-center gap-2 font-[family-name:var(--font-space-grotesk)] font-bold text-xs tracking-widest group-hover:gap-4 transition-all mt-auto ${
                  card.color === "primary" ? "text-primary" : card.color === "secondary" ? "text-secondary" : "text-tertiary"
                }`}
              >
                {card.link}
                <ArrowRight size={16} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
