import { createClient }
from "@/lib/supabase/client";

export async function verifyReminder(
  reminderId: number,
  reminderYear: number
) {

  const supabase =
    createClient();

  const { error } =
    await supabase

      .from(
        "vehicle_reminder_logs"
      )

      .insert({

        reminder_id:
          reminderId,

        reminder_year:
          reminderYear,

        verified_at:
          new Date()
            .toISOString(),

      });

  if (error)
    throw error;

}
export async function getReminderLogs() {

  const supabase =
    createClient();

  const {
    data,
    error,
  } =
    await supabase

      .from(
        "vehicle_reminder_logs"
      )

      .select("*");

  if (error)
    throw error;

  return data ?? [];

}