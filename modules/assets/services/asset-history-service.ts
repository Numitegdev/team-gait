import { createClient }
from "@/lib/supabase/client";

import {
  CreateAssetHistoryPayload,
} from "../types/CreateAssetHistoryPayload";

const supabase =
  createClient();

export async function createAssetHistory(

  payload:
    CreateAssetHistoryPayload

) {

  const {

    data,

    error,

  } = await supabase

    .from("asset_histories")

    .insert([payload])

    .select()

    .single();

  if (error)
    throw error;

  return data;

}