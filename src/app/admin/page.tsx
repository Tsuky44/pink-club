import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const session = await auth();

  const [photos, users, events] = await Promise.all([
    prisma.photo.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { rsvps: true } } },
    }),
  ]);

  return (
    <AdminClient
      photos={photos}
      users={users}
      events={events}
      adminName={session?.user?.name ?? "Admin"}
    />
  );
}
