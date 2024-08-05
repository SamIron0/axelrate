import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ProtestLocation } from "@/types";
import { useState } from "react";
import { uploadVideo } from "@/lib/cloudinary/cloudinary";

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
    const cloudinaryUrl = await uploadVideo(file);
    console.log(cloudinaryUrl);
  };

//   const uploadToCloudinary = async (file: File) => {
//     const url = `https://api.cloudinary.com/v1_1/ddhg7gunr/image/upload`
//     const formData = new FormData()

//     formData.append("file", file)
//     formData.append("upload_preset", "ml_default")

//     const res = await fetch(url, {
//       method: "POST",
//       body: formData
//     })

//     if (!res.ok) {
//       throw new Error("Failed to upload file to Cloudinary")
//     }

//     const data = await res.json()
//     return data.secure_url
//   }
  return (
    <div className="h-screen px-8">
      <h1>Protest Map</h1>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
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