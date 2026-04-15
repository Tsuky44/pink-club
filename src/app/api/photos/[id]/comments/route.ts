import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Récupérer les commentaires d'une photo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const photoId = parseInt(id);

  if (isNaN(photoId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { photoId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ comments });
}

// POST - Ajouter un commentaire
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  const photoId = parseInt(id);

  if (isNaN(photoId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const { content } = await request.json();

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Commentaire vide" }, { status: 400 });
  }

  if (content.length > 500) {
    return NextResponse.json({ error: "Commentaire trop long (max 500 caractères)" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      photoId,
      userId: session.user.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });

  return NextResponse.json({ comment });
}
