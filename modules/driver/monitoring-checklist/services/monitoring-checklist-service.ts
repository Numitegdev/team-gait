import {
  createClient,
}
from "@/lib/supabase/client";

export async function getChecklistHeaders() {

  const supabase =
    createClient();

  const {
    data,
    error,
  } = await supabase

    .from(
      "checklist_headers"
    )

   .select(`
  *,
  vehicles(
    plat_nomor,
    nama_kendaraan
  ),
  profiles(
    full_name
  )
`)

    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error)
    throw error;

  return data ?? [];

}

export async function getChecklistDetails(
  checklistId: number
) {

  const supabase =
    createClient();

  const {
    data,
    error,
  } = await supabase

    .from(
      "checklist_details"
    )

    .select(`
      *,
      checklist_items(
        name,
          input_type
      )
    `)

    .eq(
      "checklist_id",
      checklistId
    );

  if (error)
  
    throw error;

  return data ?? [];

}

export async function verifyChecklist(
  checklistId: number,
  userId: string
) {

  const supabase =
    createClient();

  const {
    error,
  } = await supabase

    .from(
      "checklist_headers"
    )

    .update({

      status:
        "verified",

      verified_by:
        userId,

      verified_at:
        new Date()
          .toISOString(),

    })

    .eq(
      "id",
      checklistId
    );

  if (error)
    throw error;

}