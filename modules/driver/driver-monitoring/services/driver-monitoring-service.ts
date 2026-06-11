import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

export async function getMonitoring() {

  const { data, error } =
    await supabase

      .from(
        "driver_tasks"
      )

     .select(`
  *,
  profiles(
    full_name
  ),
  driver_task_logs(*),
  driver_task_photos(*)
`)

      .order(
        "created_at",
        {
          ascending: false,
        }
      );
if (error) {

  console.log(error);

  throw new Error(
    error.message
  );

}

  return data || [];

}