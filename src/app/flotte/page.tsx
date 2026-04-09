"use client";

import { Car, Clock, Sparkles } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function FlottePage() {
  return (
    <ComingSoon
      title="LA"
      titleHighlight="FLOTTE"
      highlightColor="secondary"
      subtitle="Nos monstres réglés sur mesure attendent. Prépare-toi à dominer Los Santos."
      badgeText="Bientôt disponible"
      features={[
        {
          icon: Car,
          title: "Véhicules Premium",
          description: "Drift, race, show - tous réglés sur mesure",
        },
        {
          icon: Sparkles,
          title: "Tuning Ultime",
          description: "Performance et esthétique sans compromis",
        },
        {
          icon: Clock,
          title: "Location 24/7",
          description: "Réserve quand tu veux, où tu veux",
        },
      ]}
      footerText="Reviens bientôt pour découvrir notre collection exclusive"
      backLink="/"
      backText="Retour"
    />
  );
}
