import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Vibe from "@/components/Vibe";
import VideoTeaser from "@/components/VideoTeaser";
import Timetable from "@/components/Timetable";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Vibe />
        <VideoTeaser />
        <Timetable />
      </main>
      <Footer />
    </>
  );
}
