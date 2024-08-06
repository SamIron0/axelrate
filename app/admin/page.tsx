import AdminPage from "@/components/AdminPage";
import { getPendingProtests } from "@/db/protests";

export default async function Admin() {
  const pendingProtests = await getPendingProtests();
  return <AdminPage pendingProtests={pendingProtests} />;
}
