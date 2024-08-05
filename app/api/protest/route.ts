import { addProtest } from "@/db/protests";
import { createClient } from "@/lib/supabase/server";
import { Tables, TablesInsert } from "@/lib/supabase/types";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
export async function POST(request: Request) {
  const { video_url, latitude, longitude } = await request.json();
  try {
    const supabase = createClient(cookies());
    const user = await supabase.auth.getUser();
    const protest: Tables<"protests"> = {
      id: uuidv4(),
      video_url,
      latitude,
      longitude,
      status: "pending",
      title: "Protest",
      user_id: user.data.user?.id || "",
    };
    const data = await addProtest(protest);
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
