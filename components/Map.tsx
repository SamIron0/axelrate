import { Tables } from "@/lib/supabase/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { upload } from "@/lib/cloudinary/cloudinary";
import L from "leaflet";

export default function Map({
  protestLocations,
  onSetVideo,
}: {
  protestLocations: Tables<"protests">[];
  onSetVideo: (video_url: string) => void;
}) {
  const [protests, setProtests] =
    useState<Tables<"protests">[]>(protestLocations);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCaptureClick = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    if (fileInputRef.current) {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        // For mobile devices
        //toast.info("Please use your camera to capture the protest video");
      } else {
        // For desktop
        //toast.info("Please select a video file from your device");
      }
      fileInputRef.current.click();
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(
              "Location access denied. Please enable location services."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out. Please try again.");
            break;
          default:
            toast.error("An unknown error occurred while getting location.");
            break;
        }
      },
      options
    );
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const toastId = toast.loading("Uploading...");
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
        toast.dismiss(toastId);
        toast.success("Submitted for review");
      } catch (error: any) {
        toast.dismiss(toastId);
        toast.error(error.message);
      }
    }
  };

  function ChangeView({ center }: { center: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, 13);
      }
    }, [center, map]);
    return null;
  }
  const icon = L.icon({
    iconUrl: "/marker.png",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
  const pendingIcon = L.icon({
    iconUrl: "/marker-pending.png",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const bounds: [[number, number], [number, number]] = [
    [4.3161, 3.3941], // Southwest corner (near Lagos)
    [13.1514, 14.7225], // Northeast corner (near Borno)
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Protest Map</h1>
        <span className="flex items-center justify-center gap-4">
          <button
            onClick={handleCaptureClick}
            className="bg-accent hover:bg-accent/80 focus:outline-none focus:ring-0 text-white p-2 rounded-md text-sm "
          >
            Capture Protest
          </button>
          <Link href="https://github.com/SamIron0/axelrate">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
            </svg>
          </Link>
        </span>
      </div>
      <div className="flex flex-col items-center">
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
        style={{
          height: "80%",
          width: "100%",
          border: "2px solid #a1a1aa",
          borderRadius: "10px",
        }}
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
            icon={protest.status === "approved" ? icon : pendingIcon}
          >
            <Popup>
              <button
                onClick={() => onSetVideo(protest.video_url)}
                className="bg-accent hover:bg-accent/80 focus:outline-none focus:ring-0 text-white p-2 rounded-md text-sm mb-4"
              >
                Watch video
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
