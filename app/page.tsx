"use client";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface ProtestLocation {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
}

const App: React.FC = () => {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [protestLocations, setProtestLocations] = useState<ProtestLocation[]>([]);

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

  // Initial protest data
  const initialProtests: ProtestLocation[] = [
    { id: 1, latitude: 6.5244, longitude: 3.3792, title: "Protest in Lagos" },
    { id: 2, latitude: 9.0765, longitude: 7.3986, title: "Protest in Abuja" },
  ];

  return (
    <div className="h-screen px-8">
      <h1>Protest Map</h1>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      <MapContainer
        center={[9.082, 8.6753]}
        zoom={6}
        style={{ height: "80%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {[...initialProtests, ...protestLocations].map((protest) => (
          <Marker
            key={protest.id}
            position={[protest.latitude, protest.longitude]}
          >
            <Popup>{protest.title}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default App;
