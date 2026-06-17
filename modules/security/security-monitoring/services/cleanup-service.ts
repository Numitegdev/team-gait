import { createClient }
from "@/lib/supabase/client";

export async function cleanupOldPhotos() {

  const supabase =
    createClient();

  const limitDate =
    new Date();

  limitDate.setDate(
    limitDate.getDate() - 3
  );

// limitDate.setMinutes(
//   limitDate.getMinutes() - 1
// );

  const { data, error } =
    await supabase

      .from(
        "security_check_details"
      )

      .select(`
        id,
        foto_url,
        security_checks!inner(
          tanggal
        )
      `);

  if (error)
    throw error;

  const expiredPhotos =
    data?.filter(
      (item: any) => {

        const checkDate =
          new Date(
            item.security_checks
              .tanggal
          );

        return (
          checkDate <
            limitDate &&
          item.foto_url
        );

      }
    ) || [];

  for (
    const item
    of expiredPhotos
  ) {

    await supabase.storage

      .from(
        "security_photos"
      )

      const fileName =
  item.foto_url
    .split("/")
    .pop();

if (
  fileName
) {

  await supabase.storage

    .from(
      "security_photos"
    )

    .remove([
      fileName
    ]);

}

    await supabase

      .from(
        "security_check_details"
      )

      .update({
        foto_url: null,
      })

      .eq(
        "id",
        item.id
      );

  }

}