import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ProtestLocation } from "@/types";
import { useFormState } from "react-dom";
import { upload } from "@/lib/cloudinary/cloudinary";

export default function Map() {
  const [protestLocations, setProtestLocations] = useState<ProtestLocation[]>(
    []
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Initial protest data
  const initialProtests: ProtestLocation[] = [
    { id: 1, latitude: 6.5244, longitude: 3.3792, title: "Protest in Lagos" },
    { id: 2, latitude: 9.0765, longitude: 7.3986, title: "Protest in Abuja" },
  ];

  const bounds = [
    [4.3161, 3.3941], // Southwest corner (near Lagos)
    [13.1514, 14.7225], // Northeast corner (near Borno)
  ] as [[number, number], [number, number]];

  const startRecording = async () => {
    try {
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
      console.error("Error accessing camera:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadRecordedVideo = async () => {
    if (recordedVideo) {
      const formData = new FormData();
      formData.append("video", recordedVideo, "recorded-video.webm");

      try {
        const response = await upload(null, formData);
        
        // Handle the response
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  const [url, formAction] = useFormState(upload, null);

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
