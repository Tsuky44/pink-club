"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocationHero from "@/components/location/LocationHero";
import LocationProtocol from "@/components/location/LocationProtocol";
import LocationFleet from "@/components/location/LocationFleet";
import LocationEvents from "@/components/location/LocationEvents";

export default function LocationClient() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <LocationHero />
      <LocationProtocol />
      <LocationFleet />
      <LocationEvents />
      <Footer />
    </main>
  );
}
