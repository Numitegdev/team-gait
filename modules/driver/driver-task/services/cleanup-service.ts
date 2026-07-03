import {
  createClient,
}
from "@/lib/supabase/client";

export async function cleanupDriverPhotos() {

  const supabase =
    createClient();

  const limitDate =
    new Date();

  limitDate.setDate(
    limitDate.getDate() - 7
  );

  

// limitDate.setMinutes(
//   limitDate.getMinutes() - 1
// );

 const { data, error } =
  await supabase

    .from("driver_tasks")

    .select(`
      id,
      status,
      completed_at,
      task_photo_url,
      completion_photo_url
    `)

      // .not(
      //   "completion_photo_url",
      //   "is",
      //   null
      // )
      ;

  if (error)
    throw error;

  // const expiredTasks =

  //   data?.filter(
  //     (task) => {

  //       const completedDate =
  //         new Date(
  //           task.completed_at
  //         );

  //       return (
  //         completedDate <
  //         limitDate
  //       );

  //     }
  //   ) || [];

const expiredTasks =

  data?.filter(
    (task) => {

      if (
        task.status !==
        "completed"
      ) {
        return false;
      }

      if (
        !task.completed_at
      ) {
        return false;
      }

      const completedDate =
        new Date(
          task.completed_at
        );

      return (
        completedDate <
        limitDate
      );

    }
  ) || [];

for (
  const task
  of expiredTasks
) {

  const photos = [

    task.task_photo_url,

    task.completion_photo_url,

  ].filter(Boolean);

  for (
    const photoUrl
    of photos
  ) {

    const path =
      decodeURIComponent(

        photoUrl
          ?.split(
            "/driver_photos/"
          )[1] || ""

      );

    if (path) {

      await supabase.storage

        .from(
          "driver_photos"
        )

        .remove([
          path
        ]);

    }

  }

  await supabase

    .from(
      "driver_tasks"
    )

    .update({

      task_photo_url:
        null,

      completion_photo_url:
        null,

    })

    .eq(
      "id",
      task.id
    );

}

}

