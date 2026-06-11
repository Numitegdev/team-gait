import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

export async function getLocations() {

  const { data, error } =
    await supabase

      .from(
        "security_locations"
      )

      .select("*")

      .order(
        "nama_lokasi"
      );

  if (error)
    throw error;

  return data;

}

export async function createLocation(
  nama_lokasi: string
) {

  const { error } =
    await supabase

      .from(
        "security_locations"
      )

      .insert([
        {
          nama_lokasi,
          aktif: true,
        },
      ]);

  if (error)
    throw error;

}

export async function updateLocation(
  id: number,
  nama_lokasi: string
) {

  const { error } =
    await supabase

      .from(
        "security_locations"
      )

      .update({
        nama_lokasi,
      })

      .eq(
        "id",
        id
      );

  if (error)
    throw error;

}

export async function toggleLocation(
  id: number,
  aktif: boolean
) {

  const { error } =
    await supabase

      .from(
        "security_locations"
      )

      .update({
        aktif,
      })

      .eq(
        "id",
        id
      );

  if (error)
    throw error;

}