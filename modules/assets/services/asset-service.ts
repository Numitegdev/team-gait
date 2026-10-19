import { createClient }
from "@/lib/supabase/client";
import { AssetDetail }
from "../types/AssetDetail";
import {
  CreateAssetPayload,
} from "../types/asset";

import {
  buildAssetHistory,
} from "../utils/build-asset-history";

import {
  createAssetHistory,
} from "./asset-history-service";

import {
  HISTORY_ACTION,
} from "../constants/history-action";

import {
  syncIPManagementDevice,
} from "./ip-management-sync";

const supabase =
  createClient();

export async function getAssets() {

  const { data, error } =
    await supabase
      .from("assets")
      .select("*");

  if (error) throw error;

  return data;
}

export async function getActiveAssets() {

  const { data, error } =
    await supabase
      .from("assets")
      .select("*")
      .eq("is_active", true);

  if (error) throw error;

  return data;
}

export async function getAssetList() {

  const { data, error } =
    await supabase
      .from("assets")
      .select(`
        *,
        company:companies(*),
        location:locations(*),
        category:asset_categories(*),
        model:asset_models(*),
        condition:asset_conditions(*),
        status:asset_statuses(*)
      `)
      .eq("is_active", true)
      .order("asset_code");

  if (error) throw error;

  return data;
}

async function validateIPManagement(

  ipManagementId: number | null,

  currentAssetId?: number,

) {

  if (!ipManagementId) {

    return;

  }

  let query = supabase

    .from("assets")

    .select("id")

    .eq(
      "ip_management_id",
      ipManagementId
    )

    .eq(
      "is_active",
      true
    );

  if (currentAssetId) {

    query = query.neq(
      "id",
      currentAssetId
    );

  }

  const {

    data,

    error,

  } = await query.limit(1);

  if (error) {

    throw error;

  }

  if (
    data &&
    data.length > 0
  ) {

    throw new Error(
      "IP Address sudah digunakan oleh asset lain."
    );

  }

}

export async function createAsset(

  payload:
    CreateAssetPayload

) {

await validateIPManagement(

  payload.ip_management_id

);

const {
  data,
  error,
} = await supabase

  .from("assets")

  .insert([payload])

  .select()

  .single();

if (error)
  throw error;

await syncIPManagementDevice({

  newIPId:
    data.ip_management_id,

  device:
    `${data.asset_code} - ${data.asset_name}`,

});


const {
  data: { user },
} = await supabase.auth.getUser();

await createAssetHistory({

  asset_id: data.id,

  action_type:
    HISTORY_ACTION.CREATE,

  new_company_id:
    data.company_id,

  new_location_id:
    data.location_id,

  new_condition_id:
    data.condition_id,

  new_status_id:
    data.status_id,

  new_ip_management_id:
    data.ip_management_id,

  remarks:
    "Asset berhasil dibuat.",

  created_by:
    user?.id ?? null,

});

return data;

} 


export async function updateAsset(
  id: number,
  payload: any
) {
  // 1. Ambil data aset lama
  const {
    data: oldAsset,
    error: oldError,
  } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .single();

  if (oldError) {
    throw oldError;
  }

  // 2. Ambil user login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Periksa apakah aset sedang dipinjam
  const {
    data: activeLoan,
    error: activeLoanError,
  } = await supabase
    .from("asset_loans")
    .select("id, loan_no, status")
    .eq("asset_id", id)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (activeLoanError) {
    throw activeLoanError;
  }

  // 4. Cegah perubahan status manual saat aset dipinjam
  if (
    activeLoan &&
    payload.status_id !== undefined &&
    Number(payload.status_id) !==
      Number(oldAsset.status_id)
  ) {
    throw new Error(
      `Aset masih dalam status Loan dengan nomor ${activeLoan.loan_no}. Silakan selesaikan pengembalian sebelum mengubah status aset.`
    );
  }

  // 5. Cegah status Loan ditetapkan secara manual
  if (
    payload.status_id !== undefined &&
    Number(payload.status_id) === 4 &&
    Number(oldAsset.status_id) !== 4
  ) {
    throw new Error(
      "Status Loan hanya dapat diatur melalui proses peminjaman aset."
    );
  }

  // 6. Buat riwayat perubahan
  const history = buildAssetHistory(
    oldAsset,
    payload,
    user?.id
  );

  // 7. Simpan perubahan aset
  const {
    data,
    error,
  } = await supabase
    .from("assets")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  // 8. Sinkronisasi IP Management
  console.log({
    oldIP: oldAsset.ip_management_id,
    newIP: data.ip_management_id,
  });

  await syncIPManagementDevice({
    oldIPId: oldAsset.ip_management_id,
    newIPId: data.ip_management_id,
    device: `${data.asset_code} - ${data.asset_name}`,
  });

  // 9. Simpan history
  if (history) {
    await createAssetHistory(history);
  }

  return data;
}

export async function finishAssetMaintenance(id: number) {
  const statusId = await getAssetStatusId("Available");

  return updateAsset(id, {
    status_id: statusId,
  });
}

export async function finishAssetUse(id: number) {
  const statusId = await getAssetStatusId("Available");

  return updateAsset(id, {
    status_id: statusId,
  });
}

export async function deleteAsset(
  id: number
) {

  const { error } =
    await supabase
      .from("assets")
      .update({
        is_active: false,
      })
      .eq("id", id);

  if (error) throw error;
}

export async function getAssetById(
  id: number
): Promise<AssetDetail> {

  const { data, error } =
    await supabase

      .from("assets")

      .select(`
        *,
        company:companies(*),
        location:locations(*),
        category:asset_categories(*),
        model:asset_models(*),
        condition:asset_conditions(*),
        status:asset_statuses(*),
       ip_management:ip_management!assets_ip_management_id_fkey(*)
      `)

      .eq("id", id)

      .single();

  if (error)
    throw error;

  return data;

}

async function getAssetStatusId(statusName: string) {
  const { data, error } = await supabase
    .from("asset_statuses")
    .select("id, name")
    .eq("name", statusName)
    .eq("is_active", true)
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}