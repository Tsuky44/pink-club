"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, AtSign } from "lucide-react";

const footerLinks = [
  { name: "PARTENAIRES", href: "#" },
  { name: "CONDITIONS", href: "#" },
  { name: "CONTACT", href: "#" },
];

const socialLinks = [
  { icon: MessageCircle, href: "#", label: "Discord" },
  { icon: AtSign, href: "#", label: "Social" },
];

export default function Footer() {
  return (
    <footer className="bg-background w-full">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-12 md:py-16 w-full max-w-screen-2xl mx-auto border-t border-surface-variant bg-surface-container">
        {/* Logo and partner */}
        <div className="flex flex-col gap-4 text-center md:text-left">
          <div className="text-base md:text-lg font-bold text-outline font-[family-name:var(--font-manrope)] uppercase tracking-widest">
            <p className="text-on-surface-variant text-xs tracking-widest uppercase">
              THE PINK CLUB 2026 • LOS SANTOS
            </p>
            <span className="text-outline font-normal text-xs opacity-50 hidden sm:inline">
              PERFORMANCES SOUTERRAINES.
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-6 justify-center md:justify-start">
            <div className="text-[10px] tracking-[0.2em] text-outline uppercase font-[family-name:var(--font-manrope)]">
              Partenaire : Elite Auto
            </div>
            <div className="flex gap-3 md:gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="text-outline hover:text-white transition-colors opacity-80 hover:opacity-100"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-8 md:mt-0">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-[family-name:var(--font-manrope)] text-xs tracking-[0.2em] uppercase text-outline hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 md:mt-0 text-[10px] tracking-[0.2em] text-outline font-[family-name:var(--font-manrope)] uppercase text-center md:text-right"
        >
          OCT 24. 2026 THE PINK CLUB. TOUS DROITS RÉSERVÉS.
        </motion.div>
      </div>
    </footer>
  );
}
