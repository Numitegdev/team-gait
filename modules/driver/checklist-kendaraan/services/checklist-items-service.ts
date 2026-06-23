import {
  createClient,
}
from "@/lib/supabase/client";

export async function getChecklistItems() {

  // untuk DRIVER

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

export async function getAllChecklistItems() {

  // untuk MASTER DATA

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

    .order(
      "id"
    );

  if (error)
    throw error;

  return data ?? [];

}