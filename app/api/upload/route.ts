import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { uploadVideo } from "@/lib/cloudinary/cloudinary";

export async function POST(request: NextRequest) {
  const video = request.body;
  if (!video) {
    return NextResponse.json(
      { success: false, message: "No video uploaded" },
      { status: 400 }
    );
  }

  const cloudinaryUrl = await uploadVideo(video);

  return NextResponse.json({ success: true, url: cloudinaryUrl });
}
