import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const session = await auth();
  
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { commentId } = await params;

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return NextResponse.json({ success: true });
}
