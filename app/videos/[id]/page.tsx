import { connDB } from "@/app/utils/db";
import Video from "@/models/video";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type LeanVideo = {
  title: string;
  videoUrl: string;
  description: string;
  controls?: boolean;
};

export default async function VideoDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the dynamic URL parameters (Required in Next.js 15+)
  const { id } = await params;

  // Connect to DB and fetch the single video by its ID
  await connDB();
  const video = (await Video.findById(id).lean()) as LeanVideo | null;

  // If the video doesn't exist or the ID is wrong, trigger the 404 page
  if (!video) {
    notFound();
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-base-300 to-base-100 py-8 font-sans">
      <main className="container mx-auto px-4 max-w-2xl flex flex-col items-center">
        
        {/* Navigation Bar */}
        <div className="w-full flex items-center mb-8">
          <Link 
            href="/" 
            className="btn btn-sm btn-ghost gap-2 rounded-full hover:bg-base-200 transition-colors border border-transparent hover:border-base-content/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Feed</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        {/* Video Player (Elevated) */}
        <div className="rounded-3xl overflow-hidden bg-black relative w-full max-w-sm shadow-2xl border border-base-200/50 mb-10 transform hover:scale-[1.01] transition-transform duration-300">
          <video
            src={video.videoUrl}
            controls={video.controls !== false}
            autoPlay
            loop
            className="w-full h-full object-cover aspect-[9/16]"
          />
        </div>

        {/* Details Card (Glassmorphism) */}
        <div className="w-full p-8 bg-base-100/60 backdrop-blur-lg rounded-3xl border border-base-content/5 shadow-xl">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {video.title}
          </h1>
          
          <div className="divider my-2 opacity-30"></div>
          
          <h2 className="text-xs font-bold mb-3 text-base-content/50 uppercase tracking-widest">
            Description
          </h2>
          <p className="text-base-content/80 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
            {video.description}
          </p>
        </div>

      </main>
    </div>
  );
}