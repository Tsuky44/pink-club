import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

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
  description: "L'événement exclusif Élite Auto. Drift, tuning et culture automobile nocturne dans notre parking souterrain d'élite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${manrope.variable} dark antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-[family-name:var(--font-manrope)]">
        {children}
      </body>
    </html>
  );
}
