import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Pseudo et mot de passe requis." }, { status: 400 });
  }

  if (username.length < 3) {
    return NextResponse.json({ error: "Le pseudo doit faire au moins 3 caractères." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Le mot de passe doit faire au moins 6 caractères." }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existing = await (prisma.user as any).findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ error: "Ce pseudo est déjà pris." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma.user as any).create({ data: { username, name: username, password: hashed, role: "user" } });

  return NextResponse.json({ success: true });
}
