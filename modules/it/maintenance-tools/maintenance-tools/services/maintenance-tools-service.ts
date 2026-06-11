import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();
export async function getTools() {

  const { data, error } =
    await supabase
      .from("maintenance_tools")
      .select("*")
      .order("id", {
        ascending: false,
      });

  if (error)
    throw error;

  return data;
}

export async function createTool(
  payload: any
) {

  const { error } =
    await supabase
      .from("maintenance_tools")
      .insert([payload]);

  if (error)
    throw error;
}

export async function updateTool(
  id: number,
  payload: any
) {

  const { error } =
    await supabase
      .from("maintenance_tools")
      .update(payload)
      .eq("id", id);

  if (error)
    throw error;
}

export async function deleteTool(
  id: number
) {

  const { error } =
    await supabase
      .from("maintenance_tools")
      .delete()
      .eq("id", id);

  if (error)
    throw error;
}