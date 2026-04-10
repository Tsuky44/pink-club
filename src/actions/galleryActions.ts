"use server";

import { prisma } from "@/lib/prisma";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";
import { revalidatePath } from "next/cache";
import { existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "gallery");

export interface Photo {
  id: number;
  photographerName: string;
  carModel: string;
  imageUrl: string;
  kudos: number;
  createdAt: Date;
  userId: string | null;
}

// Récupérer les Top Contenders (6 photos avec le plus de kudos)
export async function getTopContenders(): Promise<Photo[]> {
  return prisma.photo.findMany({
    take: 6,
    orderBy: [{ kudos: "desc" }, { createdAt: "desc" }],
  });
}

// Récupérer les photos avec pagination (pour scroll infini)
export async function getPhotos(offset: number = 0, limit: number = 12): Promise<Photo[]> {
  return prisma.photo.findMany({
    take: limit,
    skip: offset,
    orderBy: { createdAt: "desc" },
  });
}

// Ajouter un kudo (+1)
export async function addKudo(photoId: number): Promise<number> {
  const photo = await prisma.photo.update({
    where: { id: photoId },
    data: { kudos: { increment: 1 } },
  });
  revalidatePath("/wall-of-fame");
  return photo.kudos;
}

// Retirer un kudo (-1)
export async function removeKudo(photoId: number): Promise<number> {
  const current = await prisma.photo.findUnique({ where: { id: photoId } });
  const photo = await prisma.photo.update({
    where: { id: photoId },
    data: { kudos: Math.max(0, (current?.kudos ?? 1) - 1) },
  });
  revalidatePath("/wall-of-fame");
  return photo.kudos;
}

// Supprimer une photo
export async function deletePhoto(photoId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const photo = await prisma.photo.findUnique({ where: { id: photoId } });
    
    if (!photo) {
      return { success: false, error: "Photo non trouvée" };
    }
    
    const filepath = join(process.cwd(), "public", photo.imageUrl);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }
    
    await prisma.photo.delete({ where: { id: photoId } });
    
    revalidatePath("/wall-of-fame");
    return { success: true };
  } catch (error) {
    console.error("Erreur suppression:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

// Uploader une photo
export async function uploadPhoto(
  formData: FormData
): Promise<{ success: boolean; photo?: Photo; deleteToken?: string; error?: string }> {
  try {
    const photographerName = formData.get("photographer_name") as string;
    const carModel = formData.get("car_model") as string;
    const imageFile = formData.get("image") as File;

    if (!photographerName || !carModel || !imageFile) {
      return { success: false, error: "Tous les champs sont requis" };
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const timestamp = Date.now();
    const extension = imageFile.name.split(".").pop() || "jpg";
    const filename = `${timestamp}_${photographerName.replace(/\s+/g, "_")}.${extension}`;
    const filepath = join(UPLOAD_DIR, filename);

    const bytes = await imageFile.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const imageUrl = `/uploads/gallery/${filename}`;

    const photo = await prisma.photo.create({
      data: { photographerName, carModel, imageUrl },
    });

    revalidatePath("/wall-of-fame");
    
    return { success: true, photo, deleteToken: photo.id.toString() };
  } catch (error) {
    console.error("Erreur upload:", error);
    return { success: false, error: "Erreur lors de l'upload" };
  }
}
