import { createClient }
from "@/lib/supabase/client";

import {
  CreateAssetMutationPayload,
} from "../types/CreateAssetMutationPayload";

import {
  MUTATION_STATUS,
} from "../constants/mutation-status";

import {
  generateAssetCode,
} from "@/modules/assets/services/asset-code-service";

import {
  generateMutationNumber,
} from "../utils/generate-mutation-number";

import {
  createAssetHistory,
} from "@/modules/assets/services/asset-history-service";

import {
  HISTORY_ACTION,
} from "@/modules/assets/constants/history-action";

const supabase =
  createClient();



export async function createMutation(

  payload:
    CreateAssetMutationPayload

) {

  // ======================
  // Tentukan tujuan akhir
  // ======================

  const finalToLocationId =
    payload.to_location_id ||
    payload.from_location_id;


  // ======================
  // Validasi
  // ======================

  if (
    payload.from_company_id ===
      payload.to_company_id &&
    payload.from_location_id ===
      finalToLocationId
  ) {

    throw new Error(
      "Company dan lokasi tujuan sama dengan posisi saat ini."
    );

  }


  // ======================
  // Cek pending mutation
  // ======================

  const {

    data: pendingMutation,

    error: pendingError,

  } = await supabase

    .from("asset_mutations")

    .select("id")

    .eq(
      "asset_id",
      payload.asset_id
    )

    .eq(
      "status",
      MUTATION_STATUS.PENDING
    )

    .maybeSingle();


  if (pendingError)
    throw pendingError;


  if (pendingMutation) {

    throw new Error(

      "Asset masih memiliki permintaan mutasi yang belum diproses."

    );

  }


  // ======================
  // Ambil User
  // ======================

  const {

    data: { user },

  } =
    await supabase.auth.getUser();


  if (!user) {

    throw new Error(
      "User tidak ditemukan."
    );

  }


  // ======================
  // Generate Mutation No
  // ======================

  const mutationNo =
    await generateMutationNumber();


  // ======================
  // Insert Mutation
  // ======================

  const {

    data,

    error,

  } = await supabase

    .from(
      "asset_mutations"
    )

    .insert({

      ...payload,

      // Kalau location kosong,
      // gunakan location asset sekarang

      to_location_id:
        finalToLocationId,

      mutation_no:
        mutationNo,

      status:
        MUTATION_STATUS.PENDING,

      requested_by:
        user.id,

    })

    .select()

    .single();


  if (error)
    throw error;


  return data;

}

export async function getMutations({

  page,

  pageSize,

  search = "",

  status = "ALL",

  fromCompanyId = null,

  toCompanyId = null,

}: GetMutationsParams) {

  const from =
    (page - 1) * pageSize;

  const to =
    from + pageSize - 1;


  let query = supabase

    .from("asset_mutations")

    .select(`

      *,

  asset:assets(

  asset_code,

  asset_name

),

      from_company:companies!asset_mutations_from_company_id_fkey(

        name

      ),

      to_company:companies!asset_mutations_to_company_id_fkey(

        name

      ),

      from_location:locations!asset_mutations_from_location_id_fkey(

        name

      ),

      to_location:locations!asset_mutations_to_location_id_fkey(

        name

      ),

      requester:profiles!asset_mutations_requested_by_fkey(

        full_name

      )

    `, {

      count: "exact",

    });


 // ==========================
// SEARCH
// ==========================

const keyword =
  search.trim();

if (keyword) {

  // Cari asset berdasarkan
  // asset code atau asset name

  const {
    data: matchingAssets,
    error: assetSearchError,
  } = await supabase

    .from("assets")

    .select("id")

    .or(
      `asset_code.ilike.%${keyword}%,asset_name.ilike.%${keyword}%`
    );

  if (assetSearchError)
    throw assetSearchError;


  const assetIds =
    matchingAssets?.map(
      (asset) => asset.id
    ) ?? [];


  // Cari berdasarkan:
  // 1. mutation_no
  // 2. asset_id hasil pencarian

  if (assetIds.length > 0) {

    query = query.or(

      `mutation_no.ilike.%${keyword}%,asset_id.in.(${assetIds.join(",")})`

    );

  } else {

    query = query.ilike(

      "mutation_no",

      `%${keyword}%`

    );

  }

}


  // ==========================
  // STATUS
  // ==========================

  if (status !== "ALL") {

    query = query.eq(

      "status",

      status

    );

  }


  // ==========================
  // FROM COMPANY
  // ==========================

  if (
    fromCompanyId !== null
  ) {

    query = query.eq(

      "from_company_id",

      fromCompanyId

    );

  }


  // ==========================
  // TO COMPANY
  // ==========================

  if (
    toCompanyId !== null
  ) {

    query = query.eq(

      "to_company_id",

      toCompanyId

    );

  }


  // ==========================
  // ORDER
  // ==========================

  query = query.order(

    "created_at",

    {
      ascending: false,
    }

  );


  // ==========================
  // PAGINATION
  // ==========================

  query = query.range(

    from,

    to

  );


  const {

    data,

    error,

    count,

  } = await query;


  if (error)
    throw error;


  return {

    data: data ?? [],

    total: count ?? 0,

  };

}

export async function getMutationById(

  id: number

) {

  const {

    data,

    error,

  } = await supabase

    .from("asset_mutations")

    .select(`

      *,

      asset:assets(

        id,

        asset_code,

        asset_name

      ),

      from_company:companies!asset_mutations_from_company_id_fkey(

        name

      ),

      to_company:companies!asset_mutations_to_company_id_fkey(

        name

      ),

      from_location:locations!asset_mutations_from_location_id_fkey(

        name

      ),

      to_location:locations!asset_mutations_to_location_id_fkey(

        name

      ),

      requester:profiles!asset_mutations_requested_by_fkey(

        full_name,

        email

      )

    `)

    .eq(

      "id",

      id

    )

    .single();

  if (error)
    throw error;

  return data;

}

export async function approveMutation(
  mutationId: number
) {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User tidak ditemukan."
    );
  }

  const {
    data,
    error,
  } = await supabase

    .from("asset_mutations")

    .update({

      status:
        MUTATION_STATUS.APPROVED,

      approved_by:
        user.id,

      approved_at:
        new Date().toISOString(),

    })

    .eq(
      "id",
      mutationId
    )

    .eq(
      "status",
      MUTATION_STATUS.PENDING
    )

    .select()

    .single();

  if (error)
    throw error;

  return data;
}
export async function rejectMutation(
  mutationId: number,
  rejectionReason: string
) {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User tidak ditemukan."
    );
  }

  if (!rejectionReason.trim()) {

    throw new Error(
      "Alasan penolakan wajib diisi."
    );

  }

  const {
    data,
    error,
  } = await supabase

    .from("asset_mutations")

    .update({

      status:
        MUTATION_STATUS.REJECTED,

      rejected_by:
        user.id,

      rejected_at:
        new Date().toISOString(),

      rejection_reason:
        rejectionReason.trim(),

    })

    .eq(
      "id",
      mutationId
    )

    .eq(
      "status",
      MUTATION_STATUS.PENDING
    )

    .select()

    .single();

  if (error)
    throw error;

  return data;
}
export async function executeMutation(
  mutationId: number
) {

  // ======================
  // Ambil user
  // ======================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {

    throw new Error(
      "User tidak ditemukan."
    );

  }


  // ======================
  // Ambil mutation
  // ======================

  const {
    data: mutation,
    error: mutationError,
  } = await supabase

    .from("asset_mutations")

    .select(`
      id,
      asset_id,
      mutation_no,

      from_company_id,
      to_company_id,

      from_location_id,
      to_location_id,

      requested_by,
      approved_by,
      approved_at,

      status
    `)

    .eq(
      "id",
      mutationId
    )

    .single();


  if (mutationError)
    throw mutationError;


  if (!mutation) {

    throw new Error(
      "Mutation tidak ditemukan."
    );

  }


  // ======================
  // Validasi status
  // ======================

  if (
    mutation.status !==
    MUTATION_STATUS.APPROVED
  ) {

    throw new Error(
      "Mutation harus berstatus APPROVED sebelum dieksekusi."
    );

  }


  // ======================
  // Validasi tujuan
  // ======================

  if (
    !mutation.to_company_id ||
    !mutation.to_location_id
  ) {

    throw new Error(
      "Company dan lokasi tujuan tidak valid."
    );

  }


  // ======================
  // Ambil asset sekarang
  // ======================

  const {
    data: asset,
    error: assetError,
  } = await supabase

    .from("assets")

    .select(`
      id,
      asset_code,
      company_id,
      location_id,
      model_id,

      asset_model:asset_models(
        family_code
      )
    `)

    .eq(
      "id",
      mutation.asset_id
    )

    .single();


  if (assetError)
    throw assetError;


  if (!asset) {

    throw new Error(
      "Asset tidak ditemukan."
    );

  }


  // ======================
  // Generate asset code baru
  // ======================

 


  const newAssetCode =
    await generateAssetCode(

      mutation.to_company_id,

      asset.model_id

    );


  // ======================
  // Simpan kode lama
  // ======================

  const oldAssetCode =
    asset.asset_code;


  // ======================
  // Update asset
  // ======================

  const {

    data: updatedAsset,

    error: updateAssetError,

  } = await supabase

    .from("assets")

    .update({

      company_id:
        mutation.to_company_id,

      location_id:
        mutation.to_location_id,

      asset_code:
        newAssetCode,

    })

    .eq(
      "id",
      mutation.asset_id
    )

    .select()

    .single();


  if (updateAssetError)
    throw updateAssetError;


  // ======================
  // Buat history TRANSFER
  // ======================

  await createAssetHistory({

    asset_id:
      mutation.asset_id,

    action_type:
      HISTORY_ACTION.TRANSFER,

    reference_no:
      mutation.mutation_no,

    old_asset_code:
      oldAssetCode,

    new_asset_code:
      newAssetCode,

    old_company_id:
      mutation.from_company_id,

    new_company_id:
      mutation.to_company_id,

    old_location_id:
      mutation.from_location_id,

    new_location_id:
      mutation.to_location_id,

    requested_by:
      mutation.requested_by,

    approved_by:
      mutation.approved_by,

    approved_at:
      mutation.approved_at,

    created_by:
      user.id,

    remarks:
      "Asset berhasil dimutasi.",

  });


  // ======================
  // Update mutation
  // ======================

  const {

    data,

    error,

  } = await supabase

    .from("asset_mutations")

    .update({

      status:
        MUTATION_STATUS.EXECUTED,

      executed_by:
        user.id,

      executed_at:
        new Date().toISOString(),

    })

    .eq(
      "id",
      mutationId
    )

    .eq(
      "status",
      MUTATION_STATUS.APPROVED
    )

    .select()

    .single();


  if (error)
    throw error;


  return data;

}

export interface GetMutationsParams {

  page: number;

  pageSize: number;

  search?: string;

  status?: string;

  fromCompanyId?: number | null;

  toCompanyId?: number | null;

}