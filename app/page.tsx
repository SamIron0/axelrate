"use client";
import "next-cloudinary/dist/cld-video-player.css";
import { upload } from "@/lib/cloudinary/cloudinary";
import { useFormState } from "react-dom";
import MapWrapper from "@/components/MapWrapper";
export default function Home() {
  const [url, formAction] = useFormState(upload, null);
  return (
    <div className="min-h-screen flex-col items-center justify-between ">
      <div className="flex justify-center my-10 items-center">
        <form action={formAction}>
          <input type="file" name="video" accept="video/*" />
          <button className="bg-blue-800 text-white p-2 rounded-md">
            Upload
          </button>
        </form>
      </div>
     
      <MapWrapper />
    </div>
  );
}
