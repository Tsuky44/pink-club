import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/auth";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "gallery");

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const limit = parseInt(searchParams.get("limit") ?? "12");
  const sort = searchParams.get("sort") ?? "recent";

  const orderBy =
    sort === "kudos"
      ? { kudos: "desc" as const }
      : { createdAt: "desc" as const };

  const photos = await prisma.photo.findMany({
    take: limit,
    skip: offset,
    orderBy,
  });

  return NextResponse.json(photos);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const formData = await request.formData();

  const photographerName = formData.get("photographer_name") as string;
  const carModel = formData.get("car_model") as string;
  const imageFile = formData.get("image") as File;

  if (!photographerName || !carModel || !imageFile) {
    return NextResponse.json(
      { error: "Tous les champs sont requis" },
      { status: 400 }
    );
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
    data: {
      photographerName,
      carModel,
      imageUrl,
      userId: session?.user?.id ?? null,
    },
  });

  return NextResponse.json({ success: true, photo, deleteToken: photo.id.toString() });
}
