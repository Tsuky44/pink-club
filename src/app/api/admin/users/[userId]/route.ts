import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { userId } = await params;
  const { role } = await request.json();

  if (!["user", "admin"].includes(role)) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id: userId }, data: { role } });
  return NextResponse.json({ user });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { userId } = await params;

  // Prevent self-deletion
  if (session.user.id === userId) {
    return NextResponse.json({ error: "Tu ne peux pas supprimer ton propre compte" }, { status: 400 });
  }

  // Delete related data first (cascade isn't set up in schema)
  await prisma.vote.deleteMany({ where: { userId } });
  await prisma.photo.deleteMany({ where: { userId } });
  await prisma.eventRsvp.deleteMany({ where: { userId } });
  await prisma.session.deleteMany({ where: { userId } });
  await prisma.account.deleteMany({ where: { userId } });

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ success: true });
}
