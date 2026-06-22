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

export async function createChecklistItem(
  payload: any
) {

  const supabase =
    createClient();

  const {
    error,
  } = await supabase

    .from(
      "checklist_items"
    )

    .insert(
      payload
    );

  if (error)
    throw error;

}

export async function updateChecklistItem(
  id: number,
  payload: any
) {

  const supabase =
    createClient();

  const {
    error,
  } = await supabase

    .from(
      "checklist_items"
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

export async function deactivateChecklistItem(
  id: number
) {

  const supabase =
    createClient();

  const {
    error,
  } = await supabase

    .from(
      "checklist_items"
    )

    .update({

      active:
        false,

    })

    .eq(
      "id",
      id
    );

  if (error)
    throw error;

}