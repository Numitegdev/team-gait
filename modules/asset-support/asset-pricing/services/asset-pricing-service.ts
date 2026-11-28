
import { createClient } from "@/lib/supabase/client";

import {
  getAdminCompanyId,
} from "@/lib/auth/company-permission";

const supabase = createClient();

// =====================================================
// TYPES
// =====================================================

export interface AssetModelLoanPricing {
  id: number;
  owner_company_id: number;
  borrower_company_id: number;
  model_id: number;
  monthly_price: number;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;

  owner_company?: {
    id: number;
    name: string;
  } | null;

  borrower_company?: {
    id: number;
    name: string;
  } | null;

  model?: {
    id: number;
    name: string;
    family_code: string;
  } | null;
}

export interface CreateAssetModelLoanPricingPayload {
  borrower_company_id: number;
  model_id: number;
  monthly_price: number;
}

// =====================================================
// GET CURRENT USER ROLE
// =====================================================

async function getCurrentUserRole(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User belum login.");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    throw error;
  }

  if (!profile?.role) {
    throw new Error("Role user tidak ditemukan.");
  }

  return profile.role;
}

// =====================================================
// GET PRICINGS
// =====================================================

export async function getPricings(): Promise<AssetModelLoanPricing[]> {
  const { data, error } = await supabase
    .from("asset_model_loan_pricings")
    .select(`
      *,
      owner_company:companies!asset_model_loan_pricings_owner_company_id_fkey(
        id,
        name
      ),
      borrower_company:companies!asset_model_loan_pricings_borrower_company_id_fkey(
        id,
        name
      ),
      model:asset_models!asset_model_loan_pricings_model_id_fkey(
        id,
        name,
        family_code
      )
    `)
    .order("model_id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as AssetModelLoanPricing[];
}

// =====================================================
// GET PRICING BY MODEL
// =====================================================

export async function getPricing(
  borrowerCompanyId: number,
  modelId: number
): Promise<AssetModelLoanPricing | null> {
  const role = await getCurrentUserRole();
  const adminCompanyId = getAdminCompanyId(role);

  if (role !== "it_admin" && adminCompanyId === null) {
    throw new Error("User tidak memiliki company.");
  }

  let query = supabase
    .from("asset_model_loan_pricings")
    .select("*")
    .eq("borrower_company_id", borrowerCompanyId)
    .eq("model_id", modelId);

  if (role !== "it_admin") {
    query = query.eq("owner_company_id", adminCompanyId!);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw error;
  }

  return data as AssetModelLoanPricing | null;
}

// =====================================================
// GET PRICING ITEMS
// =====================================================

export async function getPricingItems(
  borrowerCompanyId: number,
  ownerCompanyId?: number
) {
  const role = await getCurrentUserRole();
  const adminCompanyId = getAdminCompanyId(role);

  let finalOwnerCompanyId = ownerCompanyId;

  // Admin PT biasa hanya boleh melihat aset milik PT sendiri.
  if (role !== "it_admin") {
    if (adminCompanyId === null) {
      throw new Error("User tidak memiliki company.");
    }

    finalOwnerCompanyId = adminCompanyId;
  }

  // IT Admin wajib memilih PT pemilik.
  if (!finalOwnerCompanyId) {
    throw new Error("PT pemilik belum dipilih.");
  }

  if (finalOwnerCompanyId === borrowerCompanyId) {
    throw new Error(
      "PT pemilik dan PT peminjam tidak boleh sama."
    );
  }

  // 1. Ambil seluruh aset milik owner.
  const { data: assets, error: assetError } = await supabase
    .from("assets")
    .select(`
      id,
      asset_code,
      asset_name,
      company_id,
      model_id
    `)
    .eq("company_id", finalOwnerCompanyId);

  if (assetError) {
    throw assetError;
  }

  if (!assets || assets.length === 0) {
    return [];
  }

  // 2. Ambil ID Model yang digunakan aset.
  const modelIds = [
    ...new Set(
      assets
        .map((asset) => asset.model_id)
        .filter(
          (id): id is number =>
            id !== null && id !== undefined
        )
    ),
  ];

  if (modelIds.length === 0) {
    return [];
  }

  // 3. Ambil detail Model.
  const { data: models, error: modelError } = await supabase
    .from("asset_models")
    .select(`
      id,
      family_code,
      name
    `)
    .in("id", modelIds)
    .eq("is_active", true);

  if (modelError) {
    throw modelError;
  }

  const modelMap = new Map(
    (models ?? []).map((model) => [
      model.id,
      model,
    ])
  );

  // 4. Ambil active loan milik pasangan perusahaan ini.
  const { data: activeLoans, error: loanError } = await supabase
    .from("asset_loans")
    .select(`
      id,
      asset_id,
      status
    `)
    .eq("owner_company_id", finalOwnerCompanyId)
    .eq("borrower_company_id", borrowerCompanyId)
    .eq("status", "ACTIVE");

  if (loanError) {
    throw loanError;
  }

  // 5. Buat Set asset yang sedang dipinjam.
  const activeLoanAssetIds = new Set(
    (activeLoans ?? []).map((loan) => loan.asset_id)
  );

  // 6. Kelompokkan aset berdasarkan model_id.
  const modelMapItems = new Map<
    number,
    {
      model_id: number;
      model_name: string;
      family_code: string;
      asset_count: number;
      pricing: AssetModelLoanPricing | null;
    }
  >();

  for (const asset of assets) {
    if (asset.model_id === null) {
      continue;
    }

    const model = modelMap.get(asset.model_id);

    if (!model) {
      continue;
    }

    if (!modelMapItems.has(model.id)) {
      modelMapItems.set(model.id, {
        model_id: model.id,
        model_name: model.name,
        family_code: model.family_code,
        asset_count: 0,
        pricing: null,
      });
    }

    const item = modelMapItems.get(model.id)!;

    // Hitung jumlah aset yang sedang dipinjam.
    if (activeLoanAssetIds.has(asset.id)) {
      item.asset_count += 1;
    }
  }

  // 7. Ambil tarif berdasarkan model_id.
  const { data: pricings, error: pricingError } = await supabase
    .from("asset_model_loan_pricings")
    .select("*")
    .eq("owner_company_id", finalOwnerCompanyId)
    .eq("borrower_company_id", borrowerCompanyId)
    .eq("is_active", true);

  if (pricingError) {
    throw pricingError;
  }

  // 8. Buat map tarif berdasarkan model_id.
  const pricingMap = new Map(
    (pricings ?? []).map((pricing) => [
      pricing.model_id,
      pricing as AssetModelLoanPricing,
    ])
  );

  // 9. Gabungkan Model dan tarifnya.
  return Array.from(modelMapItems.values())
    .map((item) => ({
      ...item,
      pricing: pricingMap.get(item.model_id) ?? null,
    }))
    .sort((a, b) =>
      a.family_code.localeCompare(b.family_code, undefined, {
        numeric: true,
      }) || a.model_name.localeCompare(b.model_name)
    );
}

// =====================================================
// CREATE PRICING
// =====================================================

export async function createPricing(
  payload: CreateAssetModelLoanPricingPayload,
  ownerCompanyId?: number
): Promise<AssetModelLoanPricing> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User tidak ditemukan.");
  }

  const role = await getCurrentUserRole();
  const adminCompanyId = getAdminCompanyId(role);

  let finalOwnerCompanyId = ownerCompanyId;

  // Admin PT biasa otomatis menggunakan PT sendiri.
  if (role !== "it_admin") {
    if (adminCompanyId === null) {
      throw new Error("User tidak memiliki company.");
    }

    finalOwnerCompanyId = adminCompanyId;
  }

  if (!finalOwnerCompanyId) {
    throw new Error("PT pemilik belum dipilih.");
  }

  if (finalOwnerCompanyId === payload.borrower_company_id) {
    throw new Error(
      "PT pemilik dan PT peminjam tidak boleh sama."
    );
  }

  if (payload.monthly_price < 0) {
    throw new Error("Harga sewa tidak boleh negatif.");
  }

  const { data, error } = await supabase
    .from("asset_model_loan_pricings")
    .insert({
      owner_company_id: finalOwnerCompanyId,
      borrower_company_id: payload.borrower_company_id,
      model_id: payload.model_id,
      monthly_price: payload.monthly_price,
      created_by: user.id,
      updated_by: user.id,
    })
    .select(`
      *,
      owner_company:companies!asset_model_loan_pricings_owner_company_id_fkey(
        id,
        name
      ),
      borrower_company:companies!asset_model_loan_pricings_borrower_company_id_fkey(
        id,
        name
      ),
      model:asset_models!asset_model_loan_pricings_model_id_fkey(
        id,
        name,
        family_code
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data as AssetModelLoanPricing;
}

// =====================================================
// UPDATE PRICING
// =====================================================

export async function updatePricing(
  id: number,
  monthlyPrice: number
): Promise<AssetModelLoanPricing> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User tidak ditemukan.");
  }

  if (monthlyPrice < 0) {
    throw new Error("Harga sewa tidak boleh negatif.");
  }

  const role = await getCurrentUserRole();

  // Ambil owner dari database, bukan dari input UI.
  const { data: pricing, error: pricingError } = await supabase
    .from("asset_model_loan_pricings")
    .select("id, owner_company_id")
    .eq("id", id)
    .single();

  if (pricingError) {
    throw pricingError;
  }

  if (!pricing) {
    throw new Error("Data harga sewa tidak ditemukan.");
  }

  // Admin PT hanya boleh mengubah tarif milik PT sendiri.
  if (role !== "it_admin") {
    const adminCompanyId = getAdminCompanyId(role);

    if (adminCompanyId === null) {
      throw new Error("User tidak memiliki company.");
    }

    if (pricing.owner_company_id !== adminCompanyId) {
      throw new Error(
        "Anda tidak memiliki akses untuk mengubah harga PT tersebut."
      );
    }
  }

  const { data, error } = await supabase
    .from("asset_model_loan_pricings")
    .update({
      monthly_price: monthlyPrice,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(`
      *,
      owner_company:companies!asset_model_loan_pricings_owner_company_id_fkey(
        id,
        name
      ),
      borrower_company:companies!asset_model_loan_pricings_borrower_company_id_fkey(
        id,
        name
      ),
      model:asset_models!asset_model_loan_pricings_model_id_fkey(
        id,
        name,
        family_code
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data as AssetModelLoanPricing;
}
