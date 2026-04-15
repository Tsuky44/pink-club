import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Vibe from "@/components/Vibe";
import VideoTeaser from "@/components/VideoTeaser";
import Timetable from "@/components/Timetable";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

async function getRsvpCount(): Promise<{ count: number; eventId: string | null }> {
  try {
    const event = await prisma.event.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { rsvps: true } } },
    });
    if (!event) return { count: 0, eventId: null };
    return { count: event._count.rsvps, eventId: event.id };
  } catch {
    return { count: 0, eventId: null };
  }
}

export default async function Home() {
  const { count: initialRsvpCount, eventId: initialEventId } = await getRsvpCount();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Vibe />
        <VideoTeaser initialCount={initialRsvpCount} initialEventId={initialEventId} />
        <Timetable />
      </main>
      <Footer />
    </>
  );
}
