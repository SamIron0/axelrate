import nc from "next-connect";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadFolder = path.join(process.cwd(), "public/uploads");

// Ensure upload folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configure multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Create Next.js API route handler
const handler = nc()
  .use(upload.single("video"))
  .post((req, res) => {
    // Simulate video verification and geo-tagging
    const videoPath = `/uploads/${req.file.filename}`;
    const responseData = {
      success: true,
      location: {
        latitude: 6.5244,
        longitude: 3.3792,
      },
      videoUrl: videoPath,
      message: "Video uploaded and verified",
    };

    res.status(200).json(responseData);
  });

export const POST = handler;
