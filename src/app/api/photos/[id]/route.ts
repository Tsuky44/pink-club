import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;
  const photoId = parseInt(id);

  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (!photo) {
    return NextResponse.json({ error: "Photo non trouvée" }, { status: 404 });
  }

  const isOwner = session?.user?.id && photo.userId === session.user.id;
  const isAdmin = session?.user?.role === "admin";

  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const filepath = join(process.cwd(), "public", photo.imageUrl);
  if (existsSync(filepath)) {
    await unlink(filepath);
  }

  await prisma.photo.delete({ where: { id: photoId } });

  return NextResponse.json({ success: true });
}
