import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

export async function uploadCompletionPhoto(
  file: File
) {

  const fileName =
    `${Date.now()}-${file.name}`;

  const { error } =
    await supabase.storage

      .from(
        "driver_photos"
      )

      .upload(
        fileName,
        file,
        {
          upsert: true,
        }
      );

  if (error)
    throw error;

  const { data } =
    supabase.storage

      .from(
        "driver_photos"
      )

      .getPublicUrl(
        fileName
      );

  return data.publicUrl;

}

