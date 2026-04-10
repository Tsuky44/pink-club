"use client";

import { motion } from "framer-motion";
import { Users, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import TeaserVideo from "./TeaserVideo";
import { GTAMapModal } from "./GTAMapModal";

export default function VideoTeaser() {
  const [rsvpCount, setRsvpCount] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);
  const [eventId, setEventId] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const fetchRsvp = async () => {
    try {
      const res = await fetch("/api/rsvp");
      const data = await res.json();
      setRsvpCount(data.count ?? 0);
      setEventId(data.eventId ?? null);
    } catch { /* ignore */ }
  };

  // Initial load + setup
  useEffect(() => {
    fetchRsvp();

    const clicked = localStorage.getItem("pinkClubRsvp");
    if (clicked === "true") setHasClicked(true);

    // Generate persistent guest token if not exists
    if (!localStorage.getItem("pinkClubGuestToken")) {
      localStorage.setItem("pinkClubGuestToken", crypto.randomUUID());
    }

    // Poll every 15s to stay in sync with other browsers
    const interval = setInterval(fetchRsvp, 15000);

    // Refresh when tab becomes visible again
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchRsvp();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return (
    <section id="garage" className="py-16 md:py-24 px-4 md:px-10 bg-surface-container-low">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Video */}
        <div className="lg:col-span-8">
          <TeaserVideo 
            src="/teaser.mp4" 
            poster="/parking.png"
            className="aspect-video w-full"
          />
        </div>

        {/* Event card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-4"
        >
          <div className="bg-surface-variant p-6 md:p-10 border-l-4 border-primary neon-box-glow">
            <span className="text-[10px] tracking-[0.5em] text-primary font-[family-name:var(--font-space-grotesk)] font-black uppercase">
              Prochain Événement
            </span>
            <h3 className="text-3xl md:text-4xl font-[family-name:var(--font-space-grotesk)] font-black italic uppercase tracking-tighter mt-4 mb-2">
              GRANDE OUVERTURE
            </h3>
            <p className="text-on-surface-variant font-[family-name:var(--font-manrope)] text-xs uppercase tracking-widest mb-6 md:mb-8">
              Phase 1 : OUVERTURE DES PORTES
            </p>

            {/* Event details */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface/50 text-[10px] uppercase font-bold tracking-widest">
                  DATE
                </span>
                <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-white tracking-tighter">
                  17 AVR. 2026
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface/50 text-[10px] uppercase font-bold tracking-widest">
                  OUVERTURE
                </span>
                <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-white tracking-tighter">
                  21:00
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-on-surface/50 text-[10px] uppercase font-bold tracking-widest">
                  LIEU
                </span>
                <button 
                  onClick={() => setIsMapOpen(true)}
                  className="font-[family-name:var(--font-space-grotesk)] font-bold text-white tracking-tighter hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <MapPin size={14} className="text-primary group-hover:animate-bounce" />
                  PARKING DU PINK CLUB WARDOG
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 md:mt-10 flex items-center gap-4">
              {hasClicked ? (
                <div className="flex-1 py-4 bg-surface-container border border-primary/30 font-[family-name:var(--font-space-grotesk)] font-black uppercase tracking-widest text-sm text-primary text-center">
                  TU ES INSCRIT
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    setRsvpCount(c => c + 1);
                    localStorage.setItem("pinkClubRsvp", "true");
                    setHasClicked(true);
                    if (eventId) {
                      try {
                        const guestToken = localStorage.getItem("pinkClubGuestToken");
                        const res = await fetch("/api/rsvp", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ eventId, guestToken }),
                        });
                        const data = await res.json();
                        if (data.count !== undefined) setRsvpCount(data.count);
                      } catch { /* keep optimistic count */ }
                    }
                  }}
                  className="flex-1 py-4 bg-primary font-[family-name:var(--font-space-grotesk)] font-black uppercase tracking-widest text-sm text-white hover:shadow-[0_0_30px_rgba(255,0,127,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <span>PRÉSENT</span>
                </motion.button>
              )}
              <div className="flex flex-col items-center justify-center px-4 py-3 bg-surface-container border border-primary/30 min-w-[70px]">
                <Users size={18} className="text-primary mb-1" />
                <span className="font-[family-name:var(--font-space-grotesk)] font-black text-2xl text-white leading-none">
                  {rsvpCount}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <GTAMapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </section>
  );
}
