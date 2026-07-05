import {connDB} from "@/app/utils/db";
import Video from "@/models/video";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {IVideo} from "@/models/video";
export async function GET(){
    try{
        await connDB();
       const videos = await Video.find({}).sort({createdAt: -1}).
        lean()

        if(!videos || videos.length === 0){
            return NextResponse.json({message: "No videos found"}, {status: 404})
        }

    }
    catch(error){
        console.error("Error connecting to the database:", error);
        return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
    }
}

export async function POST(request: NextRequest){
    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                {
                    error: "Unauthorized access. Please log in to upload videos."
                },
                {status: 401}
            )
        }

        await connDB();

        const body: IVideo = await request.json();

        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                {
                    error: "Missing required fields. Please provide title, description, videoUrl, and thumbnailUrl."
                },
                {status: 400}
            )
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: body.transformation?.height ?? 1920,
                width: body.transformation?.width ?? 1080,
                quality: body.transformation?.quality ?? 100
            }

        }
        const newVideo = await Video.create(videoData);
    }

    catch (error){

    }
}