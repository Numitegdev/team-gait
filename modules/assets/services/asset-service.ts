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
  payload: CreateAssetPayload
) {
  const { data, error } = await supabase.rpc(
    "create_asset_with_ip",
    {
      p_payload: {
        asset_code: payload.asset_code,
        asset_name: payload.asset_name,
        company_id: payload.company_id,
        location_id: payload.location_id,
        category_id: payload.category_id,
        model_id: payload.model_id,
        condition_id: payload.condition_id,
        status_id: payload.status_id,
        brand: payload.brand,
        serial_number: payload.serial_number,
        purchase_date: payload.purchase_date,
        purchase_price: payload.purchase_price,
        warranty_until: payload.warranty_until,
        notes: payload.notes,
        spec_json: payload.spec_json,
      },
    }
  );

  if (error) {
    console.error("Gagal membuat asset:", error);
    throw error;
  }

  return data;
}



export async function updateAsset(
  id: number,
  payload: any
) {
  // Relasi IP tidak boleh diubah dari halaman Asset
  const assetPayload = { ...payload };
  delete assetPayload.ip_management_id;
  // 1. Ambil data asset lama
  const {
    data: oldAsset,
    error: oldError,
  } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .single();

  if (oldError) throw oldError;

  // 2. Ambil IP lama sebelum proses update
  const {
    data: oldIP,
    error: oldIPError,
  } = oldAsset.ip_management_id
    ? await supabase
        .from("ip_management")
        .select("ip_terkini")
        .eq("id", oldAsset.ip_management_id)
        .maybeSingle()
    : { data: null, error: null };

  if (oldIPError) throw oldIPError;

  // 3. Ambil user login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Periksa apakah asset sedang dipinjam
  const {
    data: activeLoan,
    error: activeLoanError,
  } = await supabase
    .from("asset_loans")
    .select("id, loan_no, status")
    .eq("asset_id", id)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (activeLoanError) throw activeLoanError;

  // 5. Cegah perubahan status manual saat asset dipinjam
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

  // 6. Cegah status Loan ditetapkan secara manual
  if (
    payload.status_id !== undefined &&
    Number(payload.status_id) === 4 &&
    Number(oldAsset.status_id) !== 4
  ) {
    throw new Error(
      "Status Loan hanya dapat diatur melalui proses peminjaman aset."
    );
  }

  // 7. Simpan perubahan asset
const {
  data,
  error,
} = await supabase
  .from("assets")
  .update(assetPayload)
  .eq("id", id)
  .select()
  .single();

  if (error) throw error;

  // 8. Sinkronisasi IP Management
  await syncIPManagementDevice({
    oldIPId: oldAsset.ip_management_id,
    newIPId: data.ip_management_id,
    device: `${data.asset_code} - ${data.asset_name}`,
  });

  // 9. Ambil IP baru setelah sinkronisasi
  const {
    data: newIP,
    error: newIPError,
  } = data.ip_management_id
    ? await supabase
        .from("ip_management")
        .select("ip_terkini")
        .eq("id", data.ip_management_id)
        .maybeSingle()
    : { data: null, error: null };

  if (newIPError) throw newIPError;

  // 10. Buat history perubahan asset
  const history = buildAssetHistory(
    oldAsset,
    data,
    user?.id
  );

  // 11. Periksa apakah alamat IP berubah
  const oldIPAddress = oldIP?.ip_terkini ?? null;
  const newIPAddress = newIP?.ip_terkini ?? null;

  const ipChanged =
    oldIPAddress !== newIPAddress;

  // 12. Simpan history jika ada perubahan
  if (history || ipChanged) {
    const historyPayload = history ?? {
      asset_id: id,
      action_type: HISTORY_ACTION.UPDATE,
      created_by: user?.id ?? null,
      remarks: "Alamat IP asset diperbarui.",
    };

    historyPayload.old_ip_address = oldIPAddress;
    historyPayload.new_ip_address = newIPAddress;

    historyPayload.old_ip_management_id =
      oldAsset.ip_management_id;

    historyPayload.new_ip_management_id =
      data.ip_management_id;

    await createAssetHistory(historyPayload);
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

export async function deleteAsset(id: number) {
  const { error } = await supabase.rpc("deactivate_asset", {
    p_asset_id: id,
  });

  if (error) {
    throw error;
  }
}

export async function getAssetById(
  id: number
): Promise<AssetDetail> {
  const { data, error } = await supabase
    .from("assets")
    .select(`
      *,
      company:companies(*),
      location:locations(*),
      category:asset_categories(*),
      model:asset_models(*),
      condition:asset_conditions(*),
      status:asset_statuses(*),
      ip_management:ip_management!assets_ip_management_id_fkey(
        *,
        peripheral:peripherals(*)
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
console.log(
  "IP MANAGEMENT DETAIL:",
  JSON.stringify(data.ip_management, null, 2)
);

console.log(
  "MODEL DETAIL:",
  data.model
);
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