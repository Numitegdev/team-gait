import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

export async function getHistory() {

  const { data, error } =
    await supabase
      .from("maintenance_history")
      .select("*")
      .order("tanggal", {
        ascending: false,
      });

  if (error)
    throw error;

  return data;
}

export async function deleteHistory(
  id: number
) {

  const { error } =
    await supabase
      .from("maintenance_history")
      .delete()
      .eq("id", id);

  if (error)
    throw error;
}