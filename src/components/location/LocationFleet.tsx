"use client";

import { Tilt_Neon } from "next/font/google";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";

const tiltNeon = Tilt_Neon({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tilt-neon",
});

const neonStyle = {
  color: "#ffffff",
  textShadow: `
    0 0 4px rgba(0, 238, 252, 0.6),
    0 0 10px rgba(0, 238, 252, 0.4),
    0 0 20px rgba(0, 238, 252, 0.2)
  `,
};

const cars = [
  { name: "TAMPA DRIFT BLANCHE", price: "1 000$ 5min", image: "/flotte/tempa-blanche.png", borderClass: "border-secondary", gradientClass: "from-secondary/20", iconClass: "text-secondary/30", textClass: "text-secondary" },
  { name: "TAMPA DRIFT ROUGE",    price: "1 000$ 5min", image: "/flotte/rouge.png", borderClass: "border-primary",   gradientClass: "from-primary/20",   iconClass: "text-primary/30",   textClass: "text-primary" },
  { name: "FUTO DRIFT VIOLET",   price: "500$ 5min", image: "/flotte/violet.png", borderClass: "border-tertiary",  gradientClass: "from-tertiary/20",  iconClass: "text-tertiary/30",  textClass: "text-tertiary" },
  { name: "FUTO DRIFT ROSE",    price: "500$ 5min", image: "/flotte/rose.png", borderClass: "border-secondary", gradientClass: "from-secondary/20", iconClass: "text-secondary/30", textClass: "text-secondary" },
  { name: "FUTO DRIFT ORANGE",      price: "500$ 5min", image: "/flotte/orange.png", borderClass: "border-tertiary",  gradientClass: "from-tertiary/20",  iconClass: "text-tertiary/30",  textClass: "text-tertiary" },
  { name: "FUTO DRIFT JAUNE", price: "500$ 5min", image: "/flotte/jaune.png", borderClass: "border-primary",   gradientClass: "from-primary/20",   iconClass: "text-primary/30",   textClass: "text-primary" },
];

export default function LocationFleet() {
  return (
    <section id="flotte" className="py-24 md:py-32 px-4 md:px-10 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2
            className={`text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 ${tiltNeon.variable} font-[family-name:var(--font-tilt-neon)]`}
            style={neonStyle}
          >
            LA FLOTTE
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-[2px] flex-grow max-w-xs bg-gradient-to-r from-secondary to-transparent" />
            <span className="font-[family-name:var(--font-space-grotesk)] text-xs font-bold text-on-surface-variant tracking-[0.4em] uppercase">
              SÉLECTIONNEZ VOTRE VÉHICULE DE COMPÉTITION
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car, index) => (
            <FadeIn key={car.name} delay={index * 0.08}>
              <div className={`group bg-surface flex flex-col border-b-4 ${car.borderClass} shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(0,238,252,0.15)] transition-all duration-300`}>
                <div className="h-48 bg-surface-container-high relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${car.gradientClass} to-surface-container-high`} />
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Image
                      src={car.image}
                      alt={car.name}
                      width={200}
                      height={120}
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-[family-name:var(--font-space-grotesk)] font-black text-xl italic uppercase text-white">
                      {car.name}
                    </h4>
                    <span className={`font-[family-name:var(--font-space-grotesk)] font-bold text-sm italic ${car.textClass}`}>
                      {car.price}
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
