import MapWrapper from "@/components/MapWrapper";
import { getAllProtests } from "@/db/protests";
export default async function Home() {
  const protestLocations = await getAllProtests();
  return <MapWrapper protestLocations={protestLocations} />;
}
