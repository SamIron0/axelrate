import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const video = formData.get("video") as File;

  if (!video) {
    return NextResponse.json(
      { success: false, message: "No video uploaded" },
      { status: 400 }
    );
  }

  const buffer = await video.arrayBuffer();
  const filename = `${Date.now()}-${video.name}`;
  const filepath = path.join(process.cwd(), "public", "videos", filename);

  try {
    await writeFile(filepath, Buffer.from(buffer));
    return NextResponse.json({
      success: true,
      videoUrl: `/videos/${filename}`,
      location: {
        latitude: 6.5244, // Example latitude (Lagos)
        longitude: 3.3792, // Example longitude (Lagos)
      },
    });
  } catch (error) {
    console.error("Error saving video:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save video" },
      { status: 500 }
    );
  }
}
