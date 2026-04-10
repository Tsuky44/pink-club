import { redirect } from "next/navigation";
import { getTopContenders, getPhotos } from "@/actions/galleryActions";
import { WallOfFameClient } from "@/components/wall-of-fame/WallOfFameClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "MUR DES LÉGENDES | THE PINK CLUB",
  description: "L'élite. L'inoubliable. Vote pour les meilleures machines de Los Santos.",
};

export default async function WallOfFamePage() {
  if (process.env.NEXT_PUBLIC_FEATURE_WALL_OF_FAME !== "true") {
    redirect("/bientot-disponible");
  }

  const topPhotos = await getTopContenders();
  const initialPhotos = await getPhotos(0, 12);

  return (
    <WallOfFameClient topPhotos={topPhotos} initialPhotos={initialPhotos} />
  );
}
