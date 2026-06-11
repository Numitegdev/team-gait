import {
  addWatermark,
}
from "../utils/add-watermark";


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

      .eq(
        "aktif",
        true
      )

      .order(
        "nama_lokasi"
      );

  if (error)
    throw error;

  return data;

}

export async function createCheck(
  payload: any
) {

  const { data, error } =
    await supabase

      .from(
        "security_checks"
      )

      .insert([payload])

      .select()

      .single();

  if (error)
    throw error;

  return data;

}

export async function createCheckDetail(
  payload: any[]
) {

  const { error } =
    await supabase

      .from(
        "security_check_details"
      )

      .insert(payload);

  if (error)
    throw error;

}

export async function uploadPhoto(
  file: File
) {

  const supabase =
    createClient();

  const safeName =
    file.name.replaceAll(
      " ",
      "_"
    );

  const fileName =
    `${Date.now()}-${safeName}`;


const watermarkedFile =
  await addWatermark(
    file,
    "Security Check"
  );
    
  const { error } =
  await supabase.storage
    .from("security_photos")
    .upload(
      fileName,
      watermarkedFile,
      {
        upsert: true,
      }
    );

  if (error)
    throw error;

  const {
    data: publicUrlData,
  } = supabase.storage
    .from("security_photos")
    .getPublicUrl(
      fileName
    );

  return publicUrlData.publicUrl;
}