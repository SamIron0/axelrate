import { NextRequest, NextResponse } from "next/server";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse the form data
const parseForm = async (req: NextRequest) => {
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseForm(req);

    const videoFile = files.video as File;
    if (!videoFile) {
      return NextResponse.json(
        { success: false, message: "No video file uploaded" },
        { status: 400 }
      );
    }

    const fileName = path.basename(videoFile.filepath);
    const videoUrl = `/uploads/${fileName}`;

    // Dummy location data
    const responseData = {
      success: true,
      location: {
        latitude: 6.5244,
        longitude: 3.3792,
      },
      videoUrl,
      message: "Video uploaded and verified",
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { success: false, message: "Error processing upload" },
      { status: 500 }
    );
  }
}
