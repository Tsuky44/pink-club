"use client";

import { useEffect, useRef, ReactNode } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

export default function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.5,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const directionOffset = {
    up:    { y: 30, x: 0 },
    down:  { y: -30, x: 0 },
    left:  { y: 0, x: -30 },
    right: { y: 0, x: 30 },
    none:  { y: 0, x: 0 },
  };

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        x: 0,
        transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] },
      });
    }
  }, [inView, controls, delay, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
}
