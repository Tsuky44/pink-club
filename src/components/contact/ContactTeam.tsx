"use client";

import Image from "next/image";
import { User } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const team = [
  {
    name: "STEEVE PETIT",
    role: "PATRON ELITE AUTO",
    photo: "/steeve.png",
  },
  {
    name: "RAVEN WALKER",
    role: "RESPONSABLE PARKING",
    photo: "/raven.png",
  },
  {
    name: "AIDEN CHESTER",
    role: "EMPLOYE",
    photo: "/aiden.png",
  },
];

export default function ContactTeam() {
  return (
    <section className="py-24 md:py-32 px-4 md:px-10 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[2px] w-12 bg-primary shadow-[0_0_10px_#ff007f]" />
              <span className="font-[family-name:var(--font-space-grotesk)] text-primary font-black italic tracking-[0.4em] text-xs uppercase">
                L&apos;EQUIPE
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-space-grotesk)] font-black text-4xl md:text-6xl uppercase tracking-tighter text-white">
              QUI GERE LE <span className="text-primary">PARKING</span>
            </h2>
            <p className="font-[family-name:var(--font-manrope)] text-on-surface-variant max-w-lg mt-4 text-sm uppercase tracking-widest leading-relaxed">
              Les membres de l&apos;Elite Auto responsables de la gestion du circuit et de la location.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="group bg-surface border border-surface-variant hover:border-primary/40 transition-all duration-300">
                {/* Photo */}
                <div className="relative h-72 bg-surface-container-high overflow-hidden">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface-container">
                      <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center border border-primary/20">
                        <User className="w-10 h-10 text-primary/40" />
                      </div>
                      <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] text-on-surface-variant tracking-widest uppercase">
                        PHOTO A VENIR
                      </span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-70" />
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left shadow-[0_0_10px_#ff007f]" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-black text-xl uppercase tracking-tight text-white group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="font-[family-name:var(--font-space-grotesk)] text-xs text-on-surface-variant tracking-[0.3em] uppercase mt-1">
                    {member.role}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
