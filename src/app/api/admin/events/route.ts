import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { title, date, location } = await request.json();

  if (!title || !date) {
    return NextResponse.json({ error: "Titre et date requis" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: { title, date: new Date(date), location: location || null },
  });

  return NextResponse.json({ event });
}
