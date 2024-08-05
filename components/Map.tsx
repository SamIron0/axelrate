import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { upload } from "@/lib/cloudinary/cloudinary";
import { Tables } from "@/lib/supabase/types";

export default function Map({
  protestLocations,
}: {
  protestLocations: Tables<"protests">[];
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const bounds = [
    [4.3161, 3.3941], // Southwest corner (near Lagos)
    [13.1514, 14.7225], // Northeast corner (near Borno)
  ] as [[number, number], [number, number]];

  const startRecording = async () => {
    try {
      // First, get the user's location
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      setUserLocation([position.coords.latitude, position.coords.longitude]);

      // Then start recording
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedVideo(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing camera or location:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadRecordedVideo = async () => {
    if (recordedVideo && userLocation) {
      const formData = new FormData();
      formData.append("video", recordedVideo, "recorded-video.webm");
      formData.append("latitude", userLocation[0].toString());
      formData.append("longitude", userLocation[1].toString());

      try {
        const response = await upload(null, formData);
        // Handle the response
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  // Custom component to update map view when userLocation changes
  function ChangeView({ center }: { center: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, 13);
      }
    }, [center, map]);
    return null;
  }

  return (
    <div className="h-screen px-8">
      <div className="flex flex-col items-center my-10">
        <video ref={videoRef} autoPlay muted className="mb-4" />
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-blue-800 text-white p-2 rounded-md mb-2"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-800 text-white p-2 rounded-md mb-2"
          >
            Stop Recording
          </button>
        )}
        {recordedVideo && (
          <button
            onClick={uploadRecordedVideo}
            className="bg-green-800 text-white p-2 rounded-md"
          >
            Upload
          </button>
        )}
      </div>
      <MapContainer bounds={bounds} style={{ height: "80%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {userLocation && <ChangeView center={userLocation} />}
        {protestLocations.map((protest) => (
          <Marker
            key={protest.id}
            position={[protest.latitude, protest.longitude]}
          >
            <Popup>{protest.title}</Popup>
          </Marker>
        ))}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
