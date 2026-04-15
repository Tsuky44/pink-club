import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function getOrCreateActiveEvent() {
  // Priorité : event actif → event le plus récent → créer
  let event = await prisma.event.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { rsvps: true } } },
  });

  if (!event) {
    // Pas d'event actif : prendre le plus récent plutôt qu'en créer un nouveau
    event = await prisma.event.findFirst({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { rsvps: true } } },
    });
  }

  if (!event) {
    const created = await prisma.event.create({
      data: {
        title: "PROCHAIN RASSEMBLEMENT",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    });
    event = { ...created, _count: { rsvps: 0 } };
  }

  return event;
}

export async function GET() {
  const event = await getOrCreateActiveEvent();
  return NextResponse.json({
    count: event._count.rsvps,
    eventId: event.id,
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const body = await request.json();
  const { eventId, guestToken } = body;

  if (!eventId) {
    return NextResponse.json({ error: "eventId requis" }, { status: 400 });
  }

  const userId = session?.user?.id ?? null;

  // Deduplicate: logged-in user by userId, guest by guestToken
  if (userId) {
    const existing = await prisma.eventRsvp.findFirst({
      where: { userId, eventId },
    });
    if (existing) {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { _count: { select: { rsvps: true } } },
      });
      return NextResponse.json({ success: true, count: event?._count.rsvps ?? 0 });
    }
    await prisma.eventRsvp.create({ data: { userId, eventId } });
  } else if (guestToken) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existing = await (prisma.eventRsvp as any).findFirst({
      where: { guestToken, eventId },
    });
    if (existing) {
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { _count: { select: { rsvps: true } } },
      });
      return NextResponse.json({ success: true, count: event?._count.rsvps ?? 0 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma.eventRsvp as any).create({ data: { guestToken, eventId } });
  } else {
    return NextResponse.json({ error: "guestToken ou session requise" }, { status: 400 });
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { rsvps: true } } },
  });

  return NextResponse.json({ success: true, count: event?._count.rsvps ?? 0 });
}
