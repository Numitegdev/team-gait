import { createClient }
from "@/lib/supabase/client";

export async function deleteReminder(
  id: number
) {

  const supabase =
    createClient();

  const { error } =
    await supabase

      .from(
        "vehicle_reminders"
      )

      .delete()

      .eq(
        "id",
        id
      );

  if (error)
    throw error;

}

export async function updateReminder(

  id: number,

  payload: {

    reminder_name: string;

    type: string;

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

      .update(
        payload
      )

      .eq(
        "id",
        id
      );

  if (error)
    throw error;

}