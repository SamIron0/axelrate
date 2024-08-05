import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const getAllProtests = async () => {
  const supabase = createClient(cookies());
  const { data, error } = await supabase.from("protests").select("*");
  return data;
};