import React, { useState, useRef, useEffect } from "react";
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const icon = L.icon({
    iconUrl: "/marker.png",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
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

  const uploadProtest = async () => {
    if (recordedVideo && userLocation) {
      const formData = new FormData();
      formData.append("video", recordedVideo, "recorded-video.webm");
      formData.append("latitude", userLocation[0].toString());
      formData.append("longitude", userLocation[1].toString());

      try {
        //Upload the video to cloudinary and  get the url
        const video_url = await upload(formData);
        // use the video_url to create a protest

        const result = await fetch("/api/protest ", {
          method: "POST",
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
      <div className="flex flex-col items-center ">
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
            onClick={uploadProtest}
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
