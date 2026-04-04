"use client";

import { motion } from "framer-motion";
import { Tilt_Neon } from "next/font/google";

const tiltNeon = Tilt_Neon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tilt-neon",
});

interface NeonTitleProps {
  text?: string;
  className?: string;
}

export default function NeonTitle({ 
  text = "THE PINK CLUB", 
  className = "" 
}: NeonTitleProps) {
  // Exact flicker pattern:
  // Éteint -> Flash -> Éteint -> Lutte -> Re-flash -> Baisse -> Fixe
  const opacityKeyframes = [0, 1, 0, 0.3, 1, 0.6, 1];
  const timeKeyframes = [0, 0.1, 0.15, 0.3, 0.4, 0.6, 1];

  return (
    <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: opacityKeyframes }}
      transition={{
        duration: 3.5,
        ease: "linear",
        times: timeKeyframes,
      }}
      className={`
        text-6xl sm:text-7xl md:text-8xl lg:text-9xl 
        tracking-tight
        ${tiltNeon.variable}
        font-[family-name:var(--font-tilt-neon)]
        text-center
        ${className}
      `}
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
          0 0 150px rgba(255, 0, 127, 0.3),
          0 0 200px rgba(255, 0, 127, 0.2),
          0 0 300px rgba(255, 0, 127, 0.1)
        `,
      }}
    >
      {text}
    </motion.h1>
  );
}
