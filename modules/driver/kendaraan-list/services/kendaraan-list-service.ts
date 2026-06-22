import { createClient }
from "@/lib/supabase/client";

export async function getVehicles() {

  const supabase =
    createClient();

  const {
    data,
    error,
  } = await supabase

    .from(
      "vehicles"
    )

    .select("*")

    .eq(
      "active",
      true
    );

  if (error)
    throw error;

  return data ?? [];

}

export async function createVehicle(
  payload: {
   plat_nomor: string;
    nama_kendaraan: string;
    foto_url?: string;
  }
) {

  const supabase =
    createClient();

  const { error } =
    await supabase

      .from("vehicles")

      .insert(payload);

  if (error)
    throw error;

}

export async function updateVehicle(
  id: number,
  payload: {
   plat_nomor: string;
    nama_kendaraan: string;
    foto_url?: string;
  }
) {

  const supabase =
    createClient();

  const { error } =
    await supabase

      .from("vehicles")

      .update(payload)

      .eq("id", id);

  if (error)
    throw error;

}

export async function deleteVehicle(
  id: number
) {

  const supabase =
    createClient();

  await supabase

    .from("vehicles")

    .update({

      active: false,

    })

    .eq(
      "id",
      id
    );

}

export async function uploadVehiclePhoto(
  file: File
) {

  const supabase =
    createClient();

  const fileName =
    `${Date.now()}-${file.name}`;

  const { error } =
    await supabase.storage

      .from(
        "kendaraan_photos"
      )

      .upload(
        fileName,
        file
      );

  if (error)
    throw error;

  const {
    data,
  } =
    supabase.storage

      .from(
        "kendaraan_photos"
      )

      .getPublicUrl(
        fileName
      );

  return data.publicUrl;

}
export async function getVehicleReminders() {

  const supabase =
    createClient();

  const {
    data,
    error,
  } =
    await supabase

      .from(
        "vehicle_reminders"
      )

      .select("*");

      

  if (error)
    throw error;

  return data ?? [];

}
export async function getVehicleBookings() {

  const supabase =
    createClient();

  const {
    data,
    error,
  } =
    await supabase

      .from(
        "vehicle_bookings"
      )

      .select("*");

  if (error)
    throw error;

  return data ?? [];

}
