import { createClient }
from "@/lib/supabase/client";

export async function createReminder(
  payload: {
    vehicle_id: number;
    type: string;
    reminder_name: string;
    month: number;
    day: number;
  }
) {

  const supabase =
    createClient();

  const { error } =
    await supabase

      .from(
        "vehicle_reminders"
      )

      .insert(payload);

  if (error)
    throw error;

}