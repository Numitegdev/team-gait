import { createClient }
from "@/lib/supabase/client";

import {
  AssetHistoryDetail,
} from "../types/AssetHistoryDetail";

const supabase =
  createClient();

export async function getAssetHistory(

  assetId: number

) {

  const {

    data,

    error,

  } = await supabase

    .from("asset_histories")

    .select(`
      *,
      old_company:companies!asset_histories_old_company_id_fkey(name),
      new_company:companies!asset_histories_new_company_id_fkey(name),

      old_location:locations!asset_histories_old_location_id_fkey(name),
      new_location:locations!asset_histories_new_location_id_fkey(name),

      old_condition:asset_conditions!asset_histories_old_condition_id_fkey(name),
      new_condition:asset_conditions!asset_histories_new_condition_id_fkey(name),

      old_status:asset_statuses!asset_histories_old_status_id_fkey(name),
      new_status:asset_statuses!asset_histories_new_status_id_fkey(name),
 
      old_ip:ip_management!asset_histories_old_ip_management_id_fkey(

        ip_terkini

        ),

        new_ip:ip_management!asset_histories_new_ip_management_id_fkey(

        ip_terkini

        ),
         created_user:profiles!asset_histories_created_by_fkey(
            full_name
        )

        
    `)

    .eq(
      "asset_id",
      assetId
    )

    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error)
    throw error;

 return data as AssetHistoryDetail[];

}