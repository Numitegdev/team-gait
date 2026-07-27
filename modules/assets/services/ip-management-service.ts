import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

export async function getAvailableIPs(

  currentAssetId?: number

) {

  const { data, error } =
    await supabase

      .from("ip_management")

      .select(`
        id,
        ip_terkini,
        device,
        ruangan,
        jenis_network,
        keterangan,
        fungsional,
        whitelist,
        isp_utama,
        isp_backup
      `)

      .order("ip_terkini");

    let query = supabase

      .from("assets")

      .select(`
        ip_management_id
      `)

      .eq("is_active", true)

      .not(
        "ip_management_id",
        "is",
        null
      );

    if (currentAssetId) {

      query = query.neq(
        "id",
        currentAssetId
      );

    }

    const {

      data: usedAssets,

      error: assetError,

    } = await query;

    if (assetError)
      throw assetError;

    const usedIPIds = new Set(

  usedAssets?.map(

    (asset) => asset.ip_management_id

  ) ?? []

);

const availableIPs =

  (data ?? []).filter(

    (ip) =>

      !usedIPIds.has(ip.id)

  );
  if (error)
    throw error;

return availableIPs;

}

export async function getAvailableIPManagement(

  currentAssetId?: number

) {

  let query = supabase

    .from("ip_management")

    .select(`
      *,
      assets!assets_ip_management_id_fkey(
        id,
        asset_code,
        is_active
      )
    `)

    .order("ip_terkini");

  const { data, error } = await query;

  if (error) throw error;

  return data;

}