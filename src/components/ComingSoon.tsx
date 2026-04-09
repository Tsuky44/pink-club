"use client";

import { motion } from "framer-motion";
import { ArrowLeft, LucideIcon } from "lucide-react";
import Link from "next/link";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ComingSoonProps {
  title: string;
  titleHighlight: string;
  highlightColor: "primary" | "secondary" | "tertiary";
  subtitle: string;
  badgeText: string;
  features: Feature[];
  footerText?: string;
  backLink?: string;
  backText?: string;
}

const colorClasses = {
  primary: {
    text: "text-primary",
    bg: "bg-primary",
    border: "border-primary",
    bgLight: "bg-primary/10",
    borderLight: "border-primary/20",
    gradient: "from-primary/5",
    grid: "rgba(255,0,127,0.3)",
  },
  secondary: {
    text: "text-secondary",
    bg: "bg-secondary",
    border: "border-secondary",
    bgLight: "bg-secondary/10",
    borderLight: "border-secondary/20",
    gradient: "from-secondary/5",
    grid: "rgba(0,255,255,0.3)",
  },
  tertiary: {
    text: "text-tertiary",
    bg: "bg-tertiary",
    border: "border-tertiary",
    bgLight: "bg-tertiary/10",
    borderLight: "border-tertiary/20",
    gradient: "from-tertiary/5",
    grid: "rgba(189,0,255,0.3)",
  },
};

export function ComingSoon({
  title,
  titleHighlight,
  highlightColor,
  subtitle,
  badgeText,
  features,
  footerText = "Reviens bientôt pour découvrir cette fonctionnalité",
  backLink = "/",
  backText = "Retour",
}: ComingSoonProps) {
  const colors = colorClasses[highlightColor];

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 md:px-10">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradient} via-transparent to-transparent`} />
        
        {/* Animated grid background */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(${colors.grid} 1px, transparent 1px),
              linear-gradient(90deg, ${colors.grid} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link 
              href={backLink}
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors font-[family-name:var(--font-space-grotesk)] text-xs uppercase tracking-widest"
            >
              <ArrowLeft size={16} />
              {backText}
            </Link>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bgLight} ${colors.borderLight} border rounded-full mb-8`}
          >
            <span className={`${colors.text} font-[family-name:var(--font-space-grotesk)] text-xs uppercase tracking-widest`}>
              {badgeText}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-[family-name:var(--font-space-grotesk)] text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter mb-6"
          >
            {title} <span className={colors.text}>{titleHighlight}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-on-surface-variant font-[family-name:var(--font-manrope)] text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            {subtitle}
          </motion.p>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={`bg-surface-container p-6 ${colors.borderLight} border rounded-lg`}>
                  <Icon size={32} className={`${colors.text} mx-auto mb-4`} />
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-white uppercase tracking-wider text-sm mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-on-surface-variant text-xs">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </motion.div>

          {/* Countdown teaser */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className={`bg-surface-variant/50 ${colors.borderLight} border rounded-lg p-8 backdrop-blur-sm`}
          >
            <p className="text-on-surface-variant font-[family-name:var(--font-manrope)] text-sm uppercase tracking-widest mb-4">
              OUVERTURE PRÉVUE
            </p>
            <div className={`font-[family-name:var(--font-space-grotesk)] text-4xl md:text-6xl font-black ${colors.text} tracking-tighter`}>
              ???
            </div>
            <p className="text-on-surface-variant text-xs mt-4">
              {footerText}
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
