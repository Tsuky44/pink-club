"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Navigation } from "lucide-react";
import Image from "next/image";

interface GTAMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GTAMapModal({ isOpen, onClose }: GTAMapModalProps) {
  const [showInfo, setShowInfo] = useState(false);

  // Coordonnées approximatives du parking (à ajuster selon l'image)
  const parkingPosition = { x: 50, y: 55 }; // Pourcentage sur la map

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl aspect-video bg-surface rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_50px_rgba(255,0,127,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                <MapPin className="text-primary" size={24} />
                <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-lg text-white uppercase tracking-wider">
                  Los Santos - Parking Wardog
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Map Container */}
            <div className="relative w-full h-full">
              {/* GTA Map Image - Using a placeholder, you can replace with actual GTA map image */}
              <div className="absolute inset-0 bg-surface-variant">
                {/* Placeholder for GTA map - replace src with actual GTA Los Santos map image */}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-on-surface-variant text-sm mb-2">CARTE DE LOS SANTOS</p>
                    <p className="text-white/50 text-xs">Importe une image de la map GTA ici</p>
                  </div>
                </div>
              </div>

              {/* Grid overlay for GTA style */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,0,127,0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,0,127,0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }}
              />

              {/* Parking Marker */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${parkingPosition.x}%`, top: `${parkingPosition.y}%` }}
                onClick={() => setShowInfo(!showInfo)}
              >
                {/* Pulse effect */}
                <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                
                {/* Marker */}
                <div className="relative w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,0,127,0.8)] border-2 border-white hover:scale-110 transition-transform">
                  <MapPin size={24} className="text-white" />
                </div>

                {/* Label */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap">
                  <span className="bg-black/80 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                    Pink Club Wardog
                  </span>
                </div>
              </motion.button>

              {/* Info Panel */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="absolute right-4 top-20 w-80 bg-surface/95 backdrop-blur-md border border-primary/30 rounded-lg p-6 shadow-[0_0_30px_rgba(255,0,127,0.2)]"
                  >
                    <h4 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl text-primary mb-2 uppercase">
                      Parking Wardog
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-secondary mt-1 shrink-0" />
                        <span className="text-white/80">
                          Quartier de Strawberry, Los Santos
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Navigation size={16} className="text-secondary mt-1 shrink-0" />
                        <span className="text-white/80">
                          GPS : [142.5, -1920.3, 21.0]
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-on-surface-variant">
                        Point de rendez-vous officiel du Pink Club. 
                        Stationnement disponible pour 50+ véhicules.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowInfo(false)}
                      className="mt-4 w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary font-bold text-xs uppercase tracking-wider transition-colors rounded"
                    >
                      Fermer
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Point de rendez-vous</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
