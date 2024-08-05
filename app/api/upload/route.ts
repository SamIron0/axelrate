import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { uploadVideo } from "@/lib/cloudinary/cloudinary";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const video = formData.get("video") as File;

  if (!video) {
    return NextResponse.json(
      { success: false, message: "No video uploaded" },
      { status: 400 }
    );
  }

  const cloudinaryUrl = await uploadVideo(video);

  return NextResponse.json({ success: true, url: cloudinaryUrl });
}
