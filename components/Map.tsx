import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ProtestLocation } from "@/types";
import { useState } from "react";
// import { uploadVideo } from "@/lib/cloudinary/cloudinary";
// import { postData } from "@/lib/utils";

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
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };
  return (
    <div className="h-screen px-8">
      <h1>Protest Map</h1>
      <div className="flex justify-center my-10 items-center">
        <form >
          <input type="file" name="video" accept="video/*" />
          <button className="bg-blue-800 text-white p-2 rounded-md">
            Upload
          </button>
        </form>
      </div>{" "}
      <MapContainer bounds={bounds} style={{ height: "80%", width: "100%" }}>
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
}
