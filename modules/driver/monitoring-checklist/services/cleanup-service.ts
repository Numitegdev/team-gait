import {
  createClient,
}
from "@/lib/supabase/client";

export async function cleanupChecklistPhotos() {
 
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

  const {

    data,

    error,

  } = await supabase
  

    .from(
      "checklist_details"
    )

    .select(`
      id,
      photo_url,
      created_at
    `)

    .not(
      "photo_url",
      "is",
      null
    );

  if (error)
    throw error;

  const expiredPhotos =

    data?.filter(
      (item: any) =>

        new Date(
          item.created_at
        ) < limitDate

    )

    || [];

  

  for (
    const item
    of expiredPhotos
  ) {



   const fileName =

  decodeURIComponent(

    item.photo_url
      .split("/")
      .pop() || ""

  );

if (
  fileName
) {

  const {
  error: deleteError,
}
=
await supabase.storage

  .from(
    "checklist_photo"
  )

  .remove([
    fileName
  ]);
const {
  data: remainingFiles,
}
=
await supabase.storage

  .from(
    "checklist_photo"
  )

  .list();

}

    await supabase

      .from(
        "checklist_details"
      )

      .update({

        photo_url:
          null,

      })

      .eq(
        "id",
        item.id
      );

  }

}