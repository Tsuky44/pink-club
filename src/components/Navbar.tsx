"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tilt_Neon } from "next/font/google";

const tiltNeon = Tilt_Neon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tilt-neon",
});

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "WALL OF FAME", href: "/wall-of-fame" },
  { name: "LOCATION DRIFT", href: "/bientot-disponible" },
  { name: "CONTACT", href: "/bientot-disponible" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 z-50 w-full flex justify-between items-center px-6 md:px-10 py-5 md:py-6 bg-background/80 backdrop-blur-md border-b border-secondary/15 shadow-[0_4px_20px_rgba(227,0,113,0.1)]"
    >
      {/* Logo - absolute left */}
      <Link
        href="/"
        className={`absolute left-6 md:left-10 text-2xl md:text-3xl tracking-tight ${tiltNeon.variable} font-[family-name:var(--font-tilt-neon)] uppercase`}
        style={{
          color: "#fff0f5",
          textShadow: `
            0 0 7px rgba(255, 0, 127, 1),
            0 0 10px rgba(255, 0, 127, 1),
            0 0 21px rgba(255, 0, 127, 1),
            0 0 42px rgba(255, 0, 127, 0.9),
            0 0 82px rgba(255, 0, 127, 0.7),
            0 0 92px rgba(255, 0, 127, 0.6),
            0 0 102px rgba(255, 0, 127, 0.5),
            0 0 150px rgba(255, 0, 127, 0.4),
            0 0 200px rgba(255, 0, 127, 0.3),
            0 0 300px rgba(255, 0, 127, 0.2),
            0 0 400px rgba(255, 0, 127, 0.1)
          `,
        }}
      >
        THE PINK CLUB
      </Link>

      {/* Nav Links - centered */}
      <div className="hidden md:flex gap-8 lg:gap-12 items-center mx-auto">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`font-[family-name:var(--font-space-grotesk)] uppercase tracking-tighter font-bold text-sm transition-all hover:text-secondary hover:drop-shadow-[0_0_5px_#00eefc] ${
              isActive(link.href) ? "text-primary border-b-2 border-primary pb-1" : "text-white/70"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Placeholder for balance - right side */}
      <div className="hidden md:block w-[180px]" />
    </motion.nav>
  );
}
