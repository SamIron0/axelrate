"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ProtestLocation } from "@/types";
import { useState } from "react";

export default function Map() {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [protestLocations, setProtestLocations] = useState<ProtestLocation[]>(
    []
  );

  // Initial protest data
  const initialProtests: ProtestLocation[] = [
    { id: 1, latitude: 6.5244, longitude: 3.3792, title: "Protest in Lagos" },
    { id: 2, latitude: 9.0765, longitude: 7.3986, title: "Protest in Abuja" },
  ];
  const bounds = [
    [4.3161, 3.3941], // Southwest corner (near Lagos)
    [13.1514, 14.7225], // Northeast corner (near Borno)
  ] as [[number, number], [number, number]];

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setUploadedVideo(data.videoUrl);
        setProtestLocations((prev) => [
          ...prev,
          {
            id: Date.now(),
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            title: "New Protest",
          },
        ]);
      } else {
        console.error("Video upload failed");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div className="h-screen px-8">
      <h1>Protest Map</h1>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      
    </div>
  );
}
