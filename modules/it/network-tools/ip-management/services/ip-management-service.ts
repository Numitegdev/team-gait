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

  const { error } =
    await supabase
      .from("ip_management")
      .insert([payload]);

  if (error) {
    throw error;
  }

}
export async function updateDevice(
  id: number,
  payload: any
) {

  const { error } =
    await supabase
      .from("ip_management")
      .update(payload)
      .eq("id", id);

  if (error) {
    throw error;
  }

}

export async function deleteDevice(
  id: number
) {

  const { error } =
    await supabase
      .from("ip_management")
      .delete()
      .eq("id", id);

  if (error) {
    throw error;
  }

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