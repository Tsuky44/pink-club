import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const GUEST_COOKIE = "pk_guest_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 an

async function getOrCreateGuestId(): Promise<{ guestId: string; isNew: boolean }> {
  const jar = await cookies();
  const existing = jar.get(GUEST_COOKIE)?.value;
  if (existing) return { guestId: existing, isNew: false };
  const guestId = randomUUID();
  return { guestId, isNew: true };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const session = await auth();
  const { photoId } = await params;
  const id = parseInt(photoId);

  if (session?.user?.id) {
    // Utilisateur connecté
    const userId = session.user.id;
    const existing = await prisma.vote.findUnique({
      where: { userId_photoId: { userId, photoId: id } },
    });

    if (existing) {
      await prisma.vote.delete({ where: { userId_photoId: { userId, photoId: id } } });
      const photo = await prisma.photo.update({
        where: { id },
        data: { kudos: { decrement: 1 } },
      });
      return NextResponse.json({ kudos: Math.max(0, photo.kudos), voted: false });
    } else {
      await prisma.vote.create({ data: { userId, photoId: id } });
      const photo = await prisma.photo.update({
        where: { id },
        data: { kudos: { increment: 1 } },
      });
      return NextResponse.json({ kudos: photo.kudos, voted: true });
    }
  }

  // Guest — cookie UUID
  const { guestId, isNew } = await getOrCreateGuestId();
  const existing = await prisma.vote.findUnique({
    where: { guestId_photoId: { guestId, photoId: id } },
  });

  let result: NextResponse;
  if (existing) {
    await prisma.vote.delete({ where: { guestId_photoId: { guestId, photoId: id } } });
    const photo = await prisma.photo.update({
      where: { id },
      data: { kudos: { decrement: 1 } },
    });
    result = NextResponse.json({ kudos: Math.max(0, photo.kudos), voted: false });
  } else {
    await prisma.vote.create({ data: { guestId, photoId: id } });
    const photo = await prisma.photo.update({
      where: { id },
      data: { kudos: { increment: 1 } },
    });
    result = NextResponse.json({ kudos: photo.kudos, voted: true });
  }

  if (isNew) {
    result.cookies.set(GUEST_COOKIE, guestId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }
  return result;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const session = await auth();
  const { photoId } = await params;
  const id = parseInt(photoId);

  if (session?.user?.id) {
    const [photo, vote] = await Promise.all([
      prisma.photo.findUnique({ where: { id } }),
      prisma.vote.findUnique({
        where: { userId_photoId: { userId: session.user.id, photoId: id } },
      }),
    ]);
    return NextResponse.json({ kudos: photo?.kudos ?? 0, voted: !!vote });
  }

  // Guest
  const jar = await cookies();
  const guestId = jar.get(GUEST_COOKIE)?.value;
  if (!guestId) {
    const photo = await prisma.photo.findUnique({ where: { id } });
    return NextResponse.json({ kudos: photo?.kudos ?? 0, voted: false });
  }

  const [photo, vote] = await Promise.all([
    prisma.photo.findUnique({ where: { id } }),
    prisma.vote.findUnique({
      where: { guestId_photoId: { guestId, photoId: id } },
    }),
  ]);
  return NextResponse.json({ kudos: photo?.kudos ?? 0, voted: !!vote });
}
