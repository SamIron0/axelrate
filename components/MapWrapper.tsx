"use client";
import { Tables } from "@/lib/supabase/types";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("./Dashboard"), {
  ssr: false,
});

export default function MapWrapper({
  protestLocations,
}: {
  protestLocations: Tables<"protests">[] | null;
}) {
  return <MapWithNoSSR protestLocations={protestLocations || []} />;
}
