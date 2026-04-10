import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const session = await auth();
  const { photoId } = await params;
  const id = parseInt(photoId);

  if (!session?.user?.id) {
    // Guest vote — fallback to increment without tracking user
    const photo = await prisma.photo.update({
      where: { id },
      data: { kudos: { increment: 1 } },
    });
    return NextResponse.json({ kudos: photo.kudos, voted: true });
  }

  const userId = session.user.id;

  const existing = await prisma.vote.findUnique({
    where: { userId_photoId: { userId, photoId: id } },
  });

  if (existing) {
    // Toggle off
    await prisma.vote.delete({
      where: { userId_photoId: { userId, photoId: id } },
    });
    const photo = await prisma.photo.update({
      where: { id },
      data: { kudos: { decrement: 1 } },
    });
    return NextResponse.json({ kudos: Math.max(0, photo.kudos), voted: false });
  } else {
    // Vote
    await prisma.vote.create({ data: { userId, photoId: id } });
    const photo = await prisma.photo.update({
      where: { id },
      data: { kudos: { increment: 1 } },
    });
    return NextResponse.json({ kudos: photo.kudos, voted: true });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const session = await auth();
  const { photoId } = await params;
  const id = parseInt(photoId);

  if (!session?.user?.id) {
    const photo = await prisma.photo.findUnique({ where: { id } });
    return NextResponse.json({ kudos: photo?.kudos ?? 0, voted: false });
  }

  const [photo, vote] = await Promise.all([
    prisma.photo.findUnique({ where: { id } }),
    prisma.vote.findUnique({
      where: { userId_photoId: { userId: session.user.id, photoId: id } },
    }),
  ]);

  return NextResponse.json({ kudos: photo?.kudos ?? 0, voted: !!vote });
}
