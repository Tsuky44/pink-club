"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactHero from "@/components/contact/ContactHero";
import ContactTeam from "@/components/contact/ContactTeam";
import ContactDiscord from "@/components/contact/ContactDiscord";

export default function ContactClient() {
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <ContactHero />
      <ContactTeam />
      <ContactDiscord />
      <Footer />
    </main>
  );
}
