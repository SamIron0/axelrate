import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function VideoPlayer({
  videoUrl,
  onClose,
}: {
  videoUrl: string;
  onClose: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const video = videoRef.current;
    if (video) {
      const volumeValue = newVolume[0];
      video.volume = volumeValue;
      setVolume(volumeValue);
      setIsMuted(volumeValue === 0);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
      setVolume(isMuted ? 1 : 0);
    }
  };

  const handleSeek = (newTime: number[]) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
    }
  };

  const toggleFullscreen = () => {
    try {
    const player = playerRef.current;
    if (!player) return;

    if (!isFullscreen) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      //console.error(error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      ref={playerRef}
      className="relative h-full w-full max-w-3xl mt-6 mx-auto bg-zinc-900 rounded-lg overflow-hidden"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full  "
        onClick={togglePlay}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={togglePlay} className="text-white">
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <div className="flex items-center">
            <button onClick={toggleMute} className="text-white mr-2">
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <div className="w-24">
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
          <button onClick={toggleFullscreen} className="text-white">
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>
        <div className="flex items-center">
          <span className="text-white text-sm mr-2">
            {formatTime(currentTime)}
          </span>
          <div className="flex-grow">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
            />
          </div>
          <span className="text-white text-sm ml-2">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-md p-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-x"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
