import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { upload } from "@/lib/cloudinary/cloudinary";
import { Tables } from "@/lib/supabase/types";
import L from "leaflet";

export default function Map({
  protestLocations,
}: {
  protestLocations: Tables<"protests">[];
}) {
  const [protests, setProtests] =
    useState<Tables<"protests">[]>(protestLocations);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const icon = L.icon({
    iconUrl: "/marker.png",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const bounds: [[number, number], [number, number]] = [
    [4.3161, 3.3941], // Southwest corner (near Lagos)
    [13.1514, 14.7225], // Northeast corner (near Borno)
  ];

  const handleCaptureClick = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && userLocation) {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("latitude", userLocation[0].toString());
      formData.append("longitude", userLocation[1].toString());

      try {
        const video_url = await upload(formData);

        const result = await fetch("/api/protest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            video_url,
            latitude: userLocation[0],
            longitude: userLocation[1],
          }),
        });

        const protest = await result.json();
        setProtests([...protests, protest]);
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  function ChangeView({ center }: { center: [number, number] | null }) {
    const map = useMap();
    React.useEffect(() => {
      if (center) {
        map.setView(center, 13);
      }
    }, [center, map]);
    return null;
  }

  return (
    <div className="h-screen px-8">
      <div className="flex flex-col items-center">
        <button
          onClick={handleCaptureClick}
          className="bg-blue-800 text-white p-2 rounded-md mb-2"
        >
          Capture Protest
        </button>
        <input
          type="file"
          accept="video/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <MapContainer
        center={[9.082, 8.6753]}
        zoom={6}
        style={{ height: "80%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {userLocation && <ChangeView center={userLocation} />}
        {protests.map((protest) => (
          <Marker
            key={protest.id}
            position={[
              parseFloat(protest.latitude),
              parseFloat(protest.longitude),
            ]}
            icon={icon}
          >
            <Popup>{protest.title}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
