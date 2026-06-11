import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

export async function getProfile() {

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user)
    return null;

  const { data, error } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  if (error)
    throw error;

  return data;
}

export async function createMaintenance(
  payload: any
) {

  const { error } =
    await supabase
      .from(
        "maintenance_history"
      )
      .insert([payload]);

  if (error)
    throw error;
}