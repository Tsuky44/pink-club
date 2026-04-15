"use client";

import Link from "next/link";
import { ExternalLink, AlertCircle } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 71 55" fill="currentColor">
    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39893 45.468 0.440969 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.401552 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9143 10.8048 4.9426 10.7825 4.9797C1.5779 18.7309 -0.943537 32.1443 0.293158 45.3934C0.299005 45.4565 0.335387 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3634 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9292 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2817 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2789 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9292 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.4596 70.6946 45.3964C72.1747 30.0791 68.2147 16.7757 60.1968 4.9826C60.1772 4.9429 60.1437 4.9146 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7637 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
  </svg>
);

const DISCORD_INVITE_URL = "https://discord.gg/D7h7XU2C28";

export default function ContactDiscord() {
  return (
    <section className="py-24 md:py-32 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-[2px] flex-1 max-w-xs bg-gradient-to-r from-secondary to-transparent" />
            <span className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold text-on-surface-variant tracking-[0.4em] uppercase">
              NOUS REJOINDRE
            </span>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Discord card */}
          <FadeIn delay={0.1}>
            <div className="relative group bg-surface-container border border-surface-variant hover:border-secondary/50 transition-all duration-300 p-8 h-full flex flex-col">
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#5865F2]/10 border border-[#5865F2]/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#5865F2]"><DiscordIcon /></span>
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-black text-2xl uppercase tracking-tight text-white">
                    DISCORD
                  </h3>
                  <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-secondary tracking-widest uppercase">
                    ELITE AUTO
                  </p>
                </div>
              </div>

              <p className="font-[family-name:var(--font-manrope)] text-on-surface-variant text-sm leading-relaxed mb-8 flex-grow">
                Rejoins le serveur Discord de l&apos;Elite Auto pour rester connecté avec la communauté, suivre les annonces et échanger avec les membres.
              </p>

              <Link
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-[family-name:var(--font-space-grotesk)] font-black italic tracking-widest text-sm uppercase transition-all active:scale-95"
              >
                <DiscordIcon />
                REJOINDRE LE DISCORD
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>

          {/* Intranet notice card */}
          <FadeIn delay={0.2}>
            <div className="relative group bg-surface-container border border-surface-variant hover:border-primary/50 transition-all duration-300 p-8 h-full flex flex-col">
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-black text-2xl uppercase tracking-tight text-white">
                    DEMANDES
                  </h3>
                  <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-primary tracking-widest uppercase">
                    PARKING & LOCATION
                  </p>
                </div>
              </div>

              <div className="border-l-2 border-primary/40 pl-5 mb-6">
                <p className="font-[family-name:var(--font-manrope)] text-on-surface-variant text-sm leading-relaxed">
                  Pour toute demande concernant la{" "}
                  <span className="text-white font-semibold">location du parking</span>,
                  les{" "}
                  <span className="text-white font-semibold">réservations</span> ou toute autre
                  question, merci de passer exclusivement par{" "}
                  <span className="text-primary font-bold">l&apos;intranet de l&apos;Elite Auto</span>.
                </p>
              </div>

              <div className="mt-auto bg-surface p-4 border border-primary/20">
                <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-on-surface-variant tracking-widest uppercase text-center leading-relaxed">
                  Aucune demande ne sera traitée <br />
                  <span className="text-primary font-bold">en dehors de l&apos;intranet</span>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
