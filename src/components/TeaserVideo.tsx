"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface TeaserVideoProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function TeaserVideo({ 
  src, 
  poster = "/parking.png",
  className = "" 
}: TeaserVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  
  // Detect when video enters viewport
  const isInView = useInView(containerRef, { 
    once: false, 
    amount: 0.3 
  });

  // Play video when it enters viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView) {
      video.play().catch(() => {
        // Autoplay blocked by browser, keep muted and try again
        video.muted = true;
        video.play().catch(() => {});
      });
      setHasPlayed(true);
    } else {
      video.pause();
    }
  }, [isInView]);

  // Toggle mute/unmute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{
        boxShadow: "0 0 40px rgba(255, 0, 127, 0.3), 0 0 80px rgba(255, 0, 127, 0.1)",
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="none"
        muted={isMuted}
        loop
        playsInline
        controls={false}
        className="w-full h-full object-cover"
      />

      {/* Mute toggle button */}
      <motion.button
        onClick={toggleMute}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-primary/30 flex items-center justify-center cursor-pointer transition-all hover:border-primary hover:shadow-[0_0_15px_rgba(255,0,127,0.5)]"
      >
        {isMuted ? (
          <VolumeX size={18} className="text-primary" />
        ) : (
          <Volume2 size={18} className="text-primary" />
        )}
      </motion.button>

      {/* Loading overlay - shown before first play */}
      {!hasPlayed && (
        <div className="absolute inset-0 bg-surface flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}
