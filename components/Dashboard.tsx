import React, { useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Tables } from "@/lib/supabase/types";
import Map from "./Map";
import VideoPlayer from "./VideoPlayer";

export default function Dashboard({
  protestLocations,
}: {
  protestLocations: Tables<"protests">[];
}) {
 const [videoUrl, setVideoUrl] = useState<string | null>(null);
 
  return (
    <div className="h-screen p-4 lg:px-8">
      {videoUrl ? <VideoPlayer onSetVideo={setVideoUrl}/> : <Map protestLocations={protestLocations} onSetVideo={setVideoUrl}/>}
      </div>
  );
}
