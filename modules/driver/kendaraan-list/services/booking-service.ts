import {
  createClient,
}
from "@/lib/supabase/client";

export async function getBookings() {

  const supabase =
    createClient();

  const {
    data,
    error,
  } = await supabase

    .from(
      "vehicle_bookings"
    )

    .select("*")

    .order(
      "booking_date",
      {
        ascending: true,
      }
    );

  if (error)
    throw error;

  return data ?? [];

}

export async function createBooking(
  payload: any
) {

  const supabase =
    createClient();

  const { error } =
    await supabase

      .from(
        "vehicle_bookings"
      )

      .insert(payload);

  if (error)
    throw error;

}
export async function updateBooking(
  id: number,
  payload: any
) {

  const supabase =
    createClient();

  const { error } =
    await supabase

      .from(
        "vehicle_bookings"
      )

      .update(payload)

      .eq("id", id);

  if (error)
    throw error;

}

export async function deleteBooking(
  id: number
) {

  const supabase =
    createClient();

  const { error } =
    await supabase

      .from(
        "vehicle_bookings"
      )

      .delete()

      .eq("id", id);

  if (error)
    throw error;

}