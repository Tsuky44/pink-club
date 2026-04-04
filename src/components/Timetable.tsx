"use client";

import { motion } from "framer-motion";

const scheduleItems = [
  {
    days: "LUN - MAR",
    activity: "Atelier Privé & Tuning de Précision",
    status: "MEMBRES UNIQUEMENT",
    statusColor: "secondary",
    isDim: true,
  },
  {
    days: "MER - JEU",
    activity: "Sessions Piste Ouverte & Pratique Drift",
    status: "CRÉNEAUX RÉSERVABLES",
    statusColor: "primary",
    isDim: false,
    glow: true,
  },
  {
    days: "VEN - SAM",
    activity: "The Pink Club Night : Événement Principal",
    status: "20:00 - TARD",
    statusColor: "secondary",
    isDim: false,
  },
  {
    days: "DIMANCHE",
    activity: "Restauration & Expo Esthétique Détail",
    status: "CLEAN ONLY",
    statusColor: "tertiary",
    isDim: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function Timetable() {
  return (
    <section id="timetable" className="py-24 md:py-32 px-4 md:px-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12 md:mb-20 text-center"
      >
        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black italic tracking-tighter font-[family-name:var(--font-space-grotesk)] uppercase">
          PLANNING HEBDOMADAIRE
        </h2>
        <div className="h-1 w-20 md:w-24 bg-secondary mx-auto mt-4 md:mt-6" />
      </motion.div>

      {/* Schedule */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 gap-1"
      >
        {scheduleItems.map((item, index) => {
          const bgClass = index % 2 === 1 ? "bg-surface-container-high" : "bg-surface-container";
          const statusColors = {
            primary: "text-primary",
            secondary: "text-secondary",
            tertiary: "text-tertiary",
          };

          return (
            <motion.div
              key={item.days}
              variants={itemVariants}
              className={`grid grid-cols-1 md:grid-cols-4 items-center ${bgClass} p-6 md:p-8 border-l-2 border-outline/20 hover:border-${item.statusColor} transition-all group cursor-pointer`}
            >
              <div
                className={`text-2xl md:text-3xl font-[family-name:var(--font-space-grotesk)] font-black tracking-tighter uppercase ${
                  item.isDim ? "text-on-surface/30 group-hover:text-white" : "text-white"
                } transition-colors`}
              >
                {item.days}
              </div>
              <div
                className={`col-span-2 ${
                  item.isDim ? "text-on-surface-variant" : "text-on-surface"
                } font-[family-name:var(--font-manrope)] uppercase tracking-[0.2em] text-xs md:text-sm py-3 md:py-0`}
              >
                {item.activity}
              </div>
              <div
                className={`text-right font-[family-name:var(--font-space-grotesk)] font-bold text-xs tracking-widest italic ${
                  statusColors[item.statusColor as keyof typeof statusColors]
                } ${item.glow ? "neon-text-glow" : ""}`}
              >
                {item.status}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
