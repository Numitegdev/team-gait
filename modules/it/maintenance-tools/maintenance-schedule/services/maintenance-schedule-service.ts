import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

export async function getSchedules() {

  const { data, error } =
    await supabase
      .from("maintenance_schedule")
      .select("*")
      .order("tanggal", {
        ascending: true,
      });

  if (error)
    throw error;

  return data;
}

export async function createSchedule(
  payload: any
) {

  const { error } =
    await supabase
      .from("maintenance_schedule")
      .insert([payload]);

  if (error)
    throw error;
}

export async function updateSchedule(
  id: number,
  payload: any
) {

  const { error } =
    await supabase
      .from("maintenance_schedule")
      .update(payload)
      .eq("id", id);

  if (error)
    throw error;
}

export async function deleteSchedule(
  id: number
) {

  const { error } =
    await supabase
      .from(
        "maintenance_schedule"
      )
      .delete()
      .eq("id", id);

  if (error)
    throw error;

}

