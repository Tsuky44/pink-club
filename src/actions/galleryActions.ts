"use server";

import { getDb } from "@/lib/db";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";
import { revalidatePath } from "next/cache";
import { existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "gallery");

export interface Photo {
  id: number;
  photographer_name: string;
  car_model: string;
  image_url: string;
  kudos: number;
  created_at: string;
}

// Récupérer les Top Contenders (6 photos avec le plus de kudos)
export async function getTopContenders(): Promise<Photo[]> {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM photos ORDER BY kudos DESC, created_at DESC LIMIT 6"
  );
  return stmt.all() as Photo[];
}

// Récupérer les photos avec pagination (pour scroll infini)
export async function getPhotos(offset: number = 0, limit: number = 12): Promise<Photo[]> {
  const db = getDb();
  const stmt = db.prepare(
    "SELECT * FROM photos ORDER BY created_at DESC LIMIT ? OFFSET ?"
  );
  return stmt.all(limit, offset) as Photo[];
}

// Ajouter un kudo (+1)
export async function addKudo(photoId: number): Promise<number> {
  const db = getDb();
  const stmt = db.prepare(
    "UPDATE photos SET kudos = kudos + 1 WHERE id = ? RETURNING kudos"
  );
  const result = stmt.get(photoId) as { kudos: number };
  revalidatePath("/wall-of-fame");
  return result.kudos;
}

// Retirer un kudo (-1)
export async function removeKudo(photoId: number): Promise<number> {
  const db = getDb();
  const stmt = db.prepare(
    "UPDATE photos SET kudos = MAX(0, kudos - 1) WHERE id = ? RETURNING kudos"
  );
  const result = stmt.get(photoId) as { kudos: number };
  revalidatePath("/wall-of-fame");
  return result.kudos;
}

// Supprimer une photo
export async function deletePhoto(photoId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getDb();
    
    // Récupérer l'URL de l'image avant suppression
    const getStmt = db.prepare("SELECT image_url FROM photos WHERE id = ?");
    const photo = getStmt.get(photoId) as { image_url: string } | undefined;
    
    if (!photo) {
      return { success: false, error: "Photo non trouvée" };
    }
    
    // Supprimer le fichier physique
    const filepath = join(process.cwd(), "public", photo.image_url);
    if (existsSync(filepath)) {
      await unlink(filepath);
    }
    
    // Supprimer de la DB
    const deleteStmt = db.prepare("DELETE FROM photos WHERE id = ?");
    deleteStmt.run(photoId);
    
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

    // Créer le dossier uploads s'il n'existe pas
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const extension = imageFile.name.split(".").pop() || "jpg";
    const filename = `${timestamp}_${photographerName.replace(/\s+/g, "_")}.${extension}`;
    const filepath = join(UPLOAD_DIR, filename);

    // Sauvegarder le fichier
    const bytes = await imageFile.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    // URL relative pour la DB
    const imageUrl = `/uploads/gallery/${filename}`;

    // Insérer en DB
    const db = getDb();
    const stmt = db.prepare(
      "INSERT INTO photos (photographer_name, car_model, image_url) VALUES (?, ?, ?) RETURNING *"
    );
    const photo = stmt.get(photographerName, carModel, imageUrl) as Photo;

    revalidatePath("/wall-of-fame");
    
    // Retourner le token de suppression (l'ID de la photo)
    return { success: true, photo, deleteToken: photo.id.toString() };
  } catch (error) {
    console.error("Erreur upload:", error);
    return { success: false, error: "Erreur lors de l'upload" };
  }
}
