import { Tables } from "@/lib/supabase/types";

export default function AdminPage({
  pendingProtests,
}: {
  pendingProtests: Tables<"protests">[] | null;
}) {
  return <div>{pendingProtests?.map((protest) => protest.title)}</div>;
}
