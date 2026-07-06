"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { apiClient } from "@/app/utils/api-client";
import { IVideo } from "@/models/video";
import VideoFeed from "@/app/components/VideoFeed";
import { Home, Upload, LogIn, UserPlus, LogOut, PlaySquare, Sparkles } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data as IVideo[]);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-300 to-base-100 font-sans selection:bg-primary selection:text-white">
      
      {/* PREMIUM NAVBAR (Glassmorphism)
        Note: If you want this on every single page, you can copy just this <nav> 
        block and put it in your app/layout.tsx file!
      */}
      <nav className="sticky top-0 z-50 w-full bg-base-100/70 backdrop-blur-lg border-b border-base-300 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo area */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <PlaySquare className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Reels<span className="text-primary">Pro</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-3">
              {status === "loading" ? (
                <span className="loading loading-spinner loading-sm text-primary"></span>
              ) : session ? (
                /* Logged In State */
                <>
                  <Link 
                    href="/upload" 
                    className="btn btn-sm btn-primary gap-2 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/30"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload Reel</span>
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="btn btn-sm btn-ghost gap-2 rounded-full hover:bg-error/10 hover:text-error transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                  {/* Optional Profile Avatar */}
                  <div className="avatar placeholder ml-2 border-l border-base-300 pl-4">
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                      <span className="text-xs uppercase">{session.user?.email?.[0] || 'U'}</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Logged Out State */
                <>
                  <Link 
                    href="/login" 
                    className="btn btn-sm btn-ghost gap-2 rounded-full"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="btn btn-sm btn-primary gap-2 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/30"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        
        {/* Sleek Hero Section */}
        <div className="text-center mb-16 mt-8 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200 border border-base-300 text-sm font-medium text-base-content/80 mb-4 shadow-inner">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI-Powered Video Streaming</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Discover the next <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x">
              Viral Moment
            </span>
          </h1>
          
          <p className="text-base-content/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Scroll through a seamless feed of high-quality reels uploaded by the community. 
            Sign in to share your own creations with the world.
          </p>
        </div>

        {/* Video Feed Section */}
        <div className="w-full max-w-7xl mx-auto min-h-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <span className="relative loading loading-infinity w-16 text-primary"></span>
              </div>
              <p className="text-base-content/50 font-medium animate-pulse tracking-wide">
                Curating your feed...
              </p>
            </div>
          ) : videos.length > 0 ? (
            <VideoFeed videos={videos} />
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center p-12 bg-base-200/50 rounded-3xl border border-base-300 border-dashed max-w-lg mx-auto text-center gap-4">
              <PlaySquare className="w-16 h-16 text-base-content/20" />
              <h3 className="text-xl font-bold">No videos yet</h3>
              <p className="text-base-content/60">Be the first to share a moment with the community!</p>
              {!session && (
                <Link href="/register" className="btn btn-primary mt-4 rounded-full">
                  Create an Account
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}