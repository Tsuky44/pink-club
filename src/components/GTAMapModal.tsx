"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Navigation } from "lucide-react";
import Image from "next/image";

interface GTAMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GTAMapModal({ isOpen, onClose }: GTAMapModalProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 }); // Pan offset in percentage
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and pan when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsZoomed(false);
      setPan({ x: 0, y: 0 });
      setShowInfo(false);
    }
  }, [isOpen]);

  // Coordonnées du parking sur l'image (1268x715px, position: 910, 600)
  const parkingPosition = { x: 71.8, y: 84 }; // Pourcentage sur la map

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
            className="relative w-[90vw] max-w-[1400px] aspect-video bg-black rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_50px_rgba(255,0,127,0.3)]"
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
            <div className="relative w-full h-full overflow-hidden">
              {/* GTA Map Image - with zoom */}
              <motion.div
                ref={mapContainerRef}
                className="absolute inset-0 bg-black cursor-zoom-in select-none"
                animate={{ 
                  scale: isZoomed ? 2 : 1,
                  x: `${pan.x}%`,
                  y: `${pan.y}%`
                }}
                style={{
                  transformOrigin: 'center center'
                }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => {
                  // Don't zoom if clicking on the pin (it has its own handler)
                  if ((e.target as HTMLElement).closest('.z-20')) return;
                  
                  if (!isZoomed && mapContainerRef.current) {
                    const rect = mapContainerRef.current.getBoundingClientRect();
                    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
                    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
                    // Pan so that clicked point is centered
                    setPan({ x: 50 - clickX, y: 50 - clickY });
                    setIsZoomed(true);
                  } else {
                    setIsZoomed(false);
                    setPan({ x: 0, y: 0 });
                  }
                }}
              >
                <Image
                  src="/carte-parking.png"
                  alt="Carte Los Santos - Parking Wardog"
                  fill
                  className="object-contain"
                  priority
                />

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
                  className="absolute group cursor-pointer z-20"
                  style={{ left: `${parkingPosition.x}%`, top: `${parkingPosition.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Center on pin and ensure zoomed
                    // Calculate pan to center the pin (50% is center, so pan = 50 - pinPos)
                    setPan({ x: 50 - parkingPosition.x, y: 50 - parkingPosition.y });
                    if (!isZoomed) {
                      setIsZoomed(true);
                    }
                    setShowInfo(true);
                  }}
                >
                  {/* Pulse effect - centered on pin tip */}
                  <span 
                    className="absolute w-8 h-8 rounded-full bg-primary/40 animate-ping"
                    style={{ 
                      left: '-50%',
                      top: '-95%'
                    }}
                  />
                  
                  {/* Filled pin with dark pink stroke - tip at exact position */}
                  <MapPin 
                    size={32} 
                    className="text-primary relative group-hover:scale-110 transition-transform" 
                    fill="currentColor"
                    stroke="#cc0066"
                    strokeWidth={2}
                    style={{ 
                      transform: 'translate(-50%, -100%)',
                      filter: 'drop-shadow(0 0 8px rgba(255,0,127,0.8))'
                    }}
                  />

                  {/* Label - shows on hover */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="bg-black/80 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                      Pink Club Wardog
                    </span>
                  </div>
                </motion.button>
              </motion.div>

              {/* Click to zoom hint */}
              {!isZoomed && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 pointer-events-none">
                  <span className="text-white/70 text-xs uppercase tracking-wider">Cliquez pour zoomer</span>
                </div>
              )}

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
                          Quartier de Wardog, Los Santos
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-on-surface-variant">
                        Point de rendez-vous officiel du Pink Club. 
                        Stationnement disponible sur place.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowInfo(false);
                        setIsZoomed(false);
                        setPan({ x: 0, y: 0 });
                      }}
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
