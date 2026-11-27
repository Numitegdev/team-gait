import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();
export async function getDevices() {
  const { data, error } = await supabase
    .from("ip_management")
    .select(`
      *,
      asset:assets!assets_ip_management_id_fkey!inner (
        id,
        is_active,
        location:locations!assets_location_id_fkey (
          id,
          code,
          name
        )
      )
    `)
    .eq("asset.is_active", true);

  if (error) throw error;

  return data;
}



export async function updateDevice(
  id: number,
  payload: any
) {
  const { error } = await supabase.rpc(
    "update_ip_management_with_history",
    {
      p_ip_management_id: id,
      p_payload: payload,
    }
  );

  if (error) throw error;
}
