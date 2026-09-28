import { createClient } from "@/lib/supabase/client";

import {
  AssetLoanPricing,
} from "../types/AssetLoanPricing";

import {
  CreateAssetLoanPricingPayload,
} from "../types/CreateAssetLoanPricingPayload";

import {
  getAdminCompanyId,
} from "@/lib/auth/company-permission";


const supabase =
  createClient();


// =====================================================
// GET CURRENT USER COMPANY
// =====================================================

async function getCurrentAdminCompanyId(): Promise<number | null> {

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User tidak ditemukan."
    );
  }


  const {
    data: profile,
    error,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();


  if (error) {
    throw error;
  }


  return getAdminCompanyId(
    profile.role
  );
}

async function getCurrentUserRole(): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User belum login."
    );
  }

  const { data: profile, error } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

  if (error) {
    throw error;
  }

  if (!profile?.role) {
    throw new Error(
      "Role user tidak ditemukan."
    );
  }

  return profile.role;
}
// =====================================================
// GET PRICINGS
// =====================================================

export async function getPricings(): Promise<AssetLoanPricing[]> {

  const {
    data,
    error,
  } =
    await supabase
      .from("asset_loan_pricings")
      .select(`
        *,
        owner_company:companies!asset_loan_pricings_owner_company_fkey(
          id,
          name
        ),
        borrower_company:companies!asset_loan_pricings_borrower_company_fkey(
          id,
          name
        )
      `)
      .order(
        "family_code",
        {
          ascending: true,
        }
      );


  if (error) {
    throw error;
  }


  return data ?? [];
}


// =====================================================
// GET PRICING
// =====================================================

export async function getPricing(
  borrowerCompanyId: number,
  familyCode: string
): Promise<AssetLoanPricing | null> {

  const ownerCompanyId =
    await getCurrentAdminCompanyId();


  if (ownerCompanyId === null) {

    return null;

  }


  const {
    data,
    error,
  } =
    await supabase
      .from("asset_loan_pricings")
      .select(`
        *,
        owner_company:companies!asset_loan_pricings_owner_company_fkey(
          id,
          name
        ),
        borrower_company:companies!asset_loan_pricings_borrower_company_fkey(
          id,
          name
        )
      `)
  .eq(
  "owner_company_id",
ownerCompanyId
)
.eq(
  "borrower_company_id",
  borrowerCompanyId
)
      .eq(
        "family_code",
        familyCode
      )
      .maybeSingle();


  if (error) {
    throw error;
  }


  return data;
}


// =====================================================
// GET PRICING ITEMS
// =====================================================

export async function getPricingItems(
  borrowerCompanyId: number,
  ownerCompanyId?: number
) {

  const role =
    await getCurrentUserRole();

  const adminCompanyId =
    getAdminCompanyId(role);

  let finalOwnerCompanyId =
    ownerCompanyId;


  // ============================================
  // ADMIN PT BIASA
  // Owner otomatis mengikuti PT admin
  // ============================================

  if (role !== "it_admin") {

    if (
      adminCompanyId === null
    ) {
      throw new Error(
        "User tidak memiliki company."
      );
    }

    finalOwnerCompanyId =
      adminCompanyId;
  }


  // ============================================
  // IT ADMIN WAJIB MEMILIH OWNER
  // ============================================

  if (!finalOwnerCompanyId) {

    throw new Error(
      "PT pemilik belum dipilih."
    );

  }


  // ============================================
  // 1. AMBIL ASSET MILIK OWNER
  //
  // Ini menjadi sumber Family.
  // Tidak peduli asset tersebut sudah pernah
  // dipinjam atau belum.
  // ============================================

  const {
    data: assets,
    error: assetError,
  } =
    await supabase
      .from("assets")
      .select(`
        id,
        asset_code,
        asset_name,
        company_id,
        model_id
      `)
      .eq(
        "company_id",
        finalOwnerCompanyId
      );


  if (assetError) {
    throw assetError;
  }


  if (!assets || assets.length === 0) {

    return [];

  }


  // ============================================
  // 2. AMBIL MODEL DARI ASSET
  // ============================================

  const modelIds = [
    ...new Set(
      assets
        .map(
          (asset: any) =>
            asset.model_id
        )
        .filter(
          (id): id is number =>
            id !== null &&
            id !== undefined
        )
    ),
  ];


  if (
    modelIds.length === 0
  ) {

    return [];

  }


  const {
    data: models,
    error: modelError,
  } =
    await supabase
      .from("asset_models")
      .select(`
        id,
        family_code,
        name
      `)
      .in(
        "id",
        modelIds
      );


  if (modelError) {
    throw modelError;
  }


  const modelMap =
    new Map(
      (models ?? []).map(
        (model) => [
          model.id,
          model,
        ]
      )
    );


  // ============================================
  // 3. AMBIL ACTIVE LOAN
  //
  // Ini HANYA untuk menghitung berapa asset
  // yang sedang dipinjam oleh borrower.
  //
  // BUKAN untuk menentukan Family.
  // ============================================

  const {
    data: activeLoans,
    error: loanError,
  } =
    await supabase
      .from("asset_loans")
      .select(`
        id,
        asset_id,
        status
      `)
      .eq(
        "owner_company_id",
        finalOwnerCompanyId
      )
      .eq(
        "borrower_company_id",
        borrowerCompanyId
      )
      .eq(
        "status",
        "ACTIVE"
      );


  if (loanError) {
    throw loanError;
  }


  // ============================================
  // 4. BUAT SET ASSET YANG SEDANG DIPINJAM
  // ============================================

  const activeLoanAssetIds =
    new Set(
      (activeLoans ?? [])
        .map(
          (loan: any) =>
            loan.asset_id
        )
    );


  // ============================================
  // 5. KELOMPOKKAN ASSET BERDASARKAN FAMILY
  // ============================================

  const familyMap =
    new Map<
      string,
      {
        family_code: string;
        model_names: string[];
        asset_count: number;
        pricing: AssetLoanPricing | null;
      }
    >();


  for (
    const asset of assets
  ) {

    const model =
      modelMap.get(
        asset.model_id
      );


    if (!model) {
      continue;
    }


    const familyCode =
      model.family_code;


    // ==========================================
    // HANYA FAMILY YANG PUNYA family_code
    // ==========================================

    if (
      !familyCode
    ) {
      continue;
    }


    // ==========================================
    // BUAT FAMILY BARU
    // ==========================================

    if (
      !familyMap.has(
        familyCode
      )
    ) {

      familyMap.set(
        familyCode,
        {
          family_code:
            familyCode,

          model_names: [],

          asset_count: 0,

          pricing: null,
        }
      );

    }


    const item =
      familyMap.get(
        familyCode
      )!;


    // ==========================================
    // HITUNG ASSET YANG SEDANG DIPINJAM
    // ==========================================

    if (
      activeLoanAssetIds.has(
        asset.id
      )
    ) {

      item.asset_count += 1;

    }


    // ==========================================
    // SIMPAN NAMA MODEL
    // ==========================================

    if (
      !item.model_names.includes(
        model.name
      )
    ) {

      item.model_names.push(
        model.name
      );

    }

  }


  // ============================================
  // 6. AMBIL PRICING YANG SUDAH ADA
  // ============================================

  const {
    data: pricings,
    error: pricingError,
  } =
    await supabase
      .from("asset_loan_pricings")
      .select(`
        *,
        owner_company:companies!asset_loan_pricings_owner_company_fkey(
          id,
          name
        ),
        borrower_company:companies!asset_loan_pricings_borrower_company_fkey(
          id,
          name
        )
      `)
      .eq(
        "owner_company_id",
        finalOwnerCompanyId
      )
      .eq(
        "borrower_company_id",
        borrowerCompanyId
      );


  if (pricingError) {
    throw pricingError;
  }


  // ============================================
  // 7. BUAT MAP PRICING
  // ============================================

  const pricingMap =
    new Map(
      (pricings ?? []).map(
        (pricing) => [
          pricing.family_code,
          pricing as AssetLoanPricing,
        ]
      )
    );


  // ============================================
  // 8. GABUNGKAN FAMILY + PRICING
  // ============================================

  return Array.from(
    familyMap.values()
  ).map(
    (item) => ({

      ...item,

      pricing:
        pricingMap.get(
          item.family_code
        ) ?? null,

    })
  );
}
// =====================================================
// CREATE PRICING
// =====================================================

export async function createPricing(
  payload: CreateAssetLoanPricingPayload,
  ownerCompanyId?: number
): Promise<AssetLoanPricing> {

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();


  if (!user) {
    throw new Error(
      "User tidak ditemukan."
    );
  }


  const role =
    await getCurrentUserRole();


  const adminCompanyId =
    getAdminCompanyId(role);


  let finalOwnerCompanyId =
    ownerCompanyId;


  // Admin PT biasa
  // owner otomatis mengikuti PT admin
  if (role !== "it_admin") {

    if (
      adminCompanyId === null
    ) {
      throw new Error(
        "User tidak memiliki company."
      );
    }

    finalOwnerCompanyId =
      adminCompanyId;
  }


  // IT Admin wajib memilih PT owner
  if (!finalOwnerCompanyId) {
    throw new Error(
      "PT pemilik belum dipilih."
    );
  }


  // Validasi borrower
  if (
    finalOwnerCompanyId ===
    payload.borrower_company_id
  ) {
    throw new Error(
      "PT pemilik dan PT peminjam tidak boleh sama."
    );
  }


  // Validasi harga
  if (
    payload.monthly_price < 0
  ) {
    throw new Error(
      "Harga sewa tidak boleh negatif."
    );
  }


  const {
    data,
    error,
  } =
    await supabase
      .from("asset_loan_pricings")
      .insert({

        owner_company_id:
          finalOwnerCompanyId,

        borrower_company_id:
          payload.borrower_company_id,

        family_code:
          payload.family_code,

        monthly_price:
          payload.monthly_price,

        created_by:
          user.id,

        updated_by:
          user.id,

      })
      .select(`
        *,
        owner_company:companies!asset_loan_pricings_owner_company_fkey(
          id,
          name
        ),
        borrower_company:companies!asset_loan_pricings_borrower_company_fkey(
          id,
          name
        )
      `)
      .single();


  if (error) {
    throw error;
  }


  return data as AssetLoanPricing;
}

// =====================================================
// UPDATE PRICING
// =====================================================

export async function updatePricing(
  id: number,
  monthlyPrice: number
): Promise<AssetLoanPricing> {

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();


  if (!user) {
    throw new Error(
      "User tidak ditemukan."
    );
  }


  if (
    monthlyPrice < 0
  ) {

    throw new Error(
      "Harga sewa tidak boleh negatif."
    );

  }


  // Ambil role user yang sedang login.
  const role =
    await getCurrentUserRole();


  // Ambil data pricing berdasarkan ID.
  // Owner company diambil langsung dari database,
  // jadi tidak perlu dikirim dari UI.

  const {
    data: pricing,
    error: pricingError,
  } =
    await supabase
      .from("asset_loan_pricings")
      .select(
        "id, owner_company_id"
      )
      .eq(
        "id",
        id
      )
      .single();


  if (pricingError) {
    throw pricingError;
  }


  if (!pricing) {

    throw new Error(
      "Data harga sewa tidak ditemukan."
    );

  }


  // IT Admin boleh mengubah pricing
  // milik PT mana pun.

  if (role !== "it_admin") {

    const adminCompanyId =
      getAdminCompanyId(role);


    if (
      adminCompanyId === null
    ) {

      throw new Error(
        "User tidak memiliki company."
      );

    }


    // Admin PT biasa hanya boleh
    // mengubah pricing milik PT-nya sendiri.

    if (
      pricing.owner_company_id !==
      adminCompanyId
    ) {

      throw new Error(
        "Anda tidak memiliki akses untuk mengubah harga PT tersebut."
      );

    }

  }


  // Update harga.

  const {
    data,
    error,
  } =
    await supabase
      .from("asset_loan_pricings")
      .update({

        monthly_price:
          monthlyPrice,

        updated_by:
          user.id,

        updated_at:
          new Date().toISOString(),

      })
      .eq(
        "id",
        id
      )
      .select(`
        *,
        owner_company:companies!asset_loan_pricings_owner_company_fkey(
          id,
          name
        ),
        borrower_company:companies!asset_loan_pricings_borrower_company_fkey(
          id,
          name
        )
      `)
      .single();


  if (error) {
    throw error;
  }


  return data as AssetLoanPricing;
}