import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = createClient(cookies());
    const { data, error } = await supabase.from("protests").select("*");
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
