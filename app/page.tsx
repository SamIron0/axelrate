"use client";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import { upload } from "@/lib/cloudinary/cloudinary";
import { useFormState } from "react-dom";
import MapWrapper from "@/components/MapWrapper";
import Map from "@/components/Map";
export default function Home() {
  const [url, formAction] = useFormState(upload, null);
  return (
    <div className="min-h-screen flex-col items-center gap-4 justify-between ">
      <h1>Protest Map</h1>
      <Map />
    </div>
  );
}
