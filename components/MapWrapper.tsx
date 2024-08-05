"use client";
import dynamic from 'next/dynamic';
import { ProtestLocation } from "@/types";

const MapWithNoSSR = dynamic(() => import('./Map'), {
  ssr: false,
});

export default function MapWrapper() {
  return <MapWithNoSSR />;
}