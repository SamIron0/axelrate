"use client";
import { Tables } from "@/lib/supabase/types";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { toast } from "sonner";

export default function AdminPage({
  pendingProtests,
}: {
  pendingProtests: Tables<"protests">[] | null;
}) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [protests, setProtests] = useState<Tables<"protests">[] | null>(pendingProtests);

  const handleApprove = async (protestId: string) => {
    try {
      const response = await fetch(`/api/protest/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ protestId }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve protest');
      }

      // Remove the approved protest from the list
      setProtests((prevProtests) => 
        prevProtests ? prevProtests.filter(protest => protest.id !== protestId) : null
      );

      toast.success('Protest approved successfully');
    } catch (error) {
      console.error('Error approving protest:', error);
      toast.error('Failed to approve protest');
    }
  };

  return (
    <div className="p-4 max-h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Pending Protests</h1>
      <>{selectedVideo && (
        <VideoPlayer videoUrl={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}</>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {protests?.map((protest) => (
          <div key={protest.id} className="border p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">{protest.title}</h2>
            <button
              onClick={() => setSelectedVideo(protest.video_url)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Watch Video
            </button>
            <button
              onClick={() => handleApprove(protest.id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}