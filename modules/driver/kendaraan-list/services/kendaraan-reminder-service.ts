import { createClient }
from "@/lib/supabase/client";

export async function getVehicleReminders(
  vehicleId: number
) {

  const supabase =
    createClient();

  const {
    data,
    error,
  } =
    await supabase

      .from(
        "vehicle_reminders"
      )

      .select("*")

      .eq(
        "vehicle_id",
        vehicleId
      )

      .eq(
        "is_active",
        true
      )

      .order(
        "month",
        {
          ascending: true,
        }
      );

  if (error)
    throw error;

  return data ?? [];

}