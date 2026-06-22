import {
  createClient,
}
from "@/lib/supabase/client";

export async function getChecklistItems() {

  const supabase =
    createClient();

  const {
    data,
    error,
  } = await supabase

    .from(
      "checklist_items"
    )

    .select("*")

    .eq(
      "active",
      true
    )

    .order(
      "id"
    );

  if (error)
    throw error;

  return data ?? [];

}