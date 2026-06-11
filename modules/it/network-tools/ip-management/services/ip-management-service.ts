import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();
export async function getDevices() {

  const { data, error } =
    await supabase
      .from("ip_management")
      .select("*");

  if (error) throw error;

  return data;
}

export async function createDevice(
  payload: any
) {

  return supabase
    .from("ip_management")
    .insert([payload]);
}

export async function updateDevice(
  id: number,
  payload: any
) {

  return supabase
    .from("ip_management")
    .update(payload)
    .eq("id", id);
}

export async function deleteDevice(
  id: number
) {

  return supabase
    .from("ip_management")
    .delete()
    .eq("id", id);
}

export async function bulkInsertDevices(
  devices: any[]
) {

  const { error } =
    await supabase
      .from("ip_management")
      .insert(devices);

  if (error) {

    throw error;

  }
}