import { connDB } from "@/app/utils/db";
import Video from "@/models/video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connDB();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Failed to fetch videos", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, videoUrl, controls } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: "Title and video URL are required" },
        { status: 400 }
      );
    }

    await connDB();

    const newVideo = await Video.create({
      title,
      description,
      videoUrl,
      controls: controls ?? true,
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Failed to create video", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}