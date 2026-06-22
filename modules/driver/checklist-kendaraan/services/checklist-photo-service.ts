import {
  createClient,
}
from "@/lib/supabase/client";

export async function uploadChecklistPhoto(
  file: File
) {

  const supabase =
    createClient();

  const fileName =
    `${Date.now()}-${file.name}`;

  const {
    error,
  } = await supabase.storage

    .from(
      "checklist_photo"
    )

    .upload(
      fileName,
      file
    );

  if (error)
    throw error;

  const {
    data,
  } = supabase.storage

    .from(
      "checklist_photo"
    )

    .getPublicUrl(
      fileName
    );

  return data.publicUrl;

}