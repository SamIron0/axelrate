"use client";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import { upload } from "@/lib/cloudinary/cloudinary";
import { useFormState } from "react-dom";
export default function Home() {
  const [url, formAction] = useFormState(upload, null);
  return (
    <div className="min-h-screen flex-col items-center justify-between p-10 mt-20">
      <h1 className="text-xl font-bold text-center pb-10">
        How to upload a video to Cloudinary in Next.js App Router
      </h1>
      <div className="flex justify-center my-10 items-center">
        <form action={formAction}>
          <input type="file" name="video" accept="video/*" />
          <button className="bg-blue-800 text-white p-2 rounded-md">
            Upload
          </button>
        </form>
      </div>
      {url && <CldVideoPlayer width="860" height="470" src={url} />}
    </div>
  );
}
