import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { protestId } = await request.json();
  
  try {
    const supabase = createClient(cookies());
    
    const { data, error } = await supabase
      .from("protests")
      .update({ status: "approved" })
      .eq("id", protestId);

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Protest approved successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error approving protest:", error);
    return new Response(JSON.stringify({ error: "Failed to approve protest" }), {
      status: 500,
    });
  }
}
