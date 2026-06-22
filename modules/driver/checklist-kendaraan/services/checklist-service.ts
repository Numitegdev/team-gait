import {
  createClient,
}
from "@/lib/supabase/client";

export async function getChecklists() {

  const supabase =
    createClient();

  const {
    data,
    error,
  } = await supabase

    .from(
      "vehicle_checklists"
    )

    .select("*")

    .order(
      "checklist_date",
      {
        ascending: false,
      }
    );

  if (error)
    throw error;

  return data ?? [];

}

export async function createChecklist(
  payload: any
) {

  const supabase =
    createClient();

  const {
    data,
    error,
  } = await supabase

    .from(
      "vehicle_checklists"
    )

    .insert(payload)

    .select()

    .single();

  if (error)
    throw error;

  return data;

}

export async function createChecklistHeader(
  payload: any
) {

  const supabase =
    createClient();

  const {
    data,
    error,
  } = await supabase

    .from(
      "checklist_headers"
    )

    .insert(payload)

    .select()

    .single();

  if (error)
    throw error;

  return data;

}

export async function createChecklistDetail(
  payload: any
) {

  const supabase =
    createClient();

  const {
    error,
  } = await supabase

    .from(
      "checklist_details"
    )

    .insert(payload);

  if (error)
    throw error;

}

export async function checkTodayChecklist(

  vehicleId: number,

  userId: string,

  checklistDate: string

) {

  const supabase =
    createClient();

  const {
    data,
    error,
  } = await supabase

    .from(
      "checklist_headers"
    )

    .select("id")

    .eq(
      "vehicle_id",
      vehicleId
    )

    .eq(
      "user_id",
      userId
    )

    .eq(
      "checklist_date",
      checklistDate
    )

    .maybeSingle();

  if (error)
    throw error;

  return data;

}