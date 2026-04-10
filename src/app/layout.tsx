import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "THE PINK CLUB | L'Élite du Drift",
  description: "L'événement Élite Auto.",
  openGraph: {
    title: "THE PINK CLUB | L'Élite du Drift",
    description: "L'événement exclusif Élite Auto. Drift et Rassemblement auto.",
    url: "https://pinkclub.tsuky.ovh",
    siteName: "THE PINK CLUB",
    images: [
      {
        url: "/parking.png",
        width: 1200,
        height: 630,
        alt: "THE PINK CLUB - Parking souterrain de l'élite",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "THE PINK CLUB | L'Élite du Drift",
    description: "L'événement exclusif Élite Auto. Drift et Rassemblement auto.",
    images: ["/parking.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${manrope.variable} dark antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-[family-name:var(--font-manrope)]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
