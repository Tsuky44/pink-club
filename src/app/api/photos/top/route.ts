import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const photos = await prisma.photo.findMany({
    take: 6,
    orderBy: [{ kudos: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(photos);
}
