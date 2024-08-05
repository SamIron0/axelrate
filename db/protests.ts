import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/lib/supabase/types";
import { cookies } from "next/headers";

export const getAllProtests = async () => {
  const supabase = createClient(cookies());
  const { data, error } = await supabase.from("protests").select("*");
  return data;
};
export const addProtest = async (protest: Tables<"protests">) => {
  const supabase = createClient(cookies());
  const { data, error } = await supabase
    .from("protests")
    .insert(protest)
    .select();
  return data;
};