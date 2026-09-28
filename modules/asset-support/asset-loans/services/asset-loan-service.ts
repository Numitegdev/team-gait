import { createClient }
from "@/lib/supabase/client";

import {
  createAssetHistory,
} from "@/modules/assets/services/asset-history-service";

import {
  CreateAssetLoanPayload,
} from "../types/CreateAssetLoanPayload";

import {
  getAdminCompanyId,
} from "@/lib/auth/company-permission";

import {
  AssetLoan,
} from "../types/AssetLoan";

import {
  generateLoanNumber,
} from "../utils/generate-loan-number";

const supabase =
  createClient();


// ==============================
// CREATE LOAN
// ==============================

export async function createLoan(

  payload:
    CreateAssetLoanPayload

): Promise<AssetLoan> {

  // ============================
  // Ambil user
  // ============================

  const {

    data: { user },

  } = await supabase.auth.getUser();


  if (!user) {

    throw new Error(
      "User tidak ditemukan."
    );

  }


  // ============================
  // Validasi owner & borrower
  // ============================

  if (
    payload.owner_company_id ===
    payload.borrower_company_id
  ) {

    throw new Error(
      "Owner company dan borrower company tidak boleh sama."
    );

  }


  // ============================
  // Cek asset
  // ============================

  const {

    data: asset,

    error: assetError,

  } = await supabase

    .from("assets")

    .select(`
      id,
      asset_code,
      asset_name,
      company_id,
      model_id
    `)

    .eq(
      "id",
      payload.asset_id
    )

    .eq(
      "is_active",
      true
    )

    .single();


  if (assetError)
    throw assetError;


  if (!asset) {

    throw new Error(
      "Asset tidak ditemukan atau sudah tidak aktif."
    );

  }


  // ============================
  // Pastikan owner sesuai asset
  // ============================

  if (
    asset.company_id !==
    payload.owner_company_id
  ) {

    throw new Error(
      "Owner company tidak sesuai dengan company pemilik asset."
    );

  }


  // ============================
  // Ambil family code asset
  // ============================

  const {

    data: assetModel,

    error: assetModelError,

  } = await supabase

    .from("asset_models")

    .select(`
      id,
      family_code
    `)

    .eq(
      "id",
      asset.model_id
    )

    .single();


  if (assetModelError)
    throw assetModelError;


  if (!assetModel) {

    throw new Error(
      "Model asset tidak ditemukan."
    );

  }


  if (!assetModel.family_code) {

    throw new Error(
      "Family code asset belum tersedia."
    );

  }


  // ============================
  // Ambil harga dari pricing
  // ============================

  const {

    data: pricing,

    error: pricingError,

  } = await supabase

    .from("asset_loan_pricings")

    .select(`
      id,
      monthly_price,
      is_active
    `)

    .eq(
      "owner_company_id",
      payload.owner_company_id
    )

    .eq(
      "borrower_company_id",
      payload.borrower_company_id
    )

    .eq(
      "family_code",
      assetModel.family_code
    )

    .eq(
      "is_active",
      true
    )

    .maybeSingle();


  if (pricingError)
    throw pricingError;


  if (!pricing) {

    throw new Error(

      `Harga sewa untuk Family ${assetModel.family_code} antara PT pemilik dan PT peminjam belum diatur.`

    );

  }


  // ============================
  // Cek loan yang masih aktif
  // ============================

  const {

    data: activeLoan,

    error: activeLoanError,

  } = await supabase

    .from("asset_loans")

    .select(`
      id,
      loan_no,
      status
    `)

    .eq(
      "asset_id",
      payload.asset_id
    )

    .eq(
      "status",
      "ACTIVE"
    )

    .maybeSingle();


  if (activeLoanError)
    throw activeLoanError;


  if (activeLoan) {

    throw new Error(

      `Asset sudah sedang dipinjam dengan nomor ${activeLoan.loan_no}.`

    );

  }


  // ===================================================
  // Cek request loan yang masih berjalan
  // ===================================================

  const {

    data: pendingLoan,

    error: pendingLoanError,

  } = await supabase

    .from("asset_loans")

    .select(`
      id,
      loan_no,
      status
    `)

    .eq(
      "asset_id",
      payload.asset_id
    )

    .in(
      "status",
      [
        "PENDING",
        "APPROVED",
      ]
    )

    .maybeSingle();


  if (pendingLoanError)
    throw pendingLoanError;


  if (pendingLoan) {

    throw new Error(

      `Asset sudah memiliki request loan dengan nomor ${pendingLoan.loan_no}.`

    );

  }


  // ===================================================
  // Generate Loan Number
  // ===================================================

  const loanNo =
    await generateLoanNumber();


  // ============================
  // Insert loan request
  // ============================

  const {

    data,

    error,

  } = await supabase

    .from("asset_loans")

    .insert({

      loan_no:
        loanNo,

      asset_id:
        payload.asset_id,

      owner_company_id:
        payload.owner_company_id,

      borrower_company_id:
        payload.borrower_company_id,

      start_date:
        payload.start_date,

      end_date:
        payload.end_date ?? null,

      // Request baru selalu PENDING
      status:
        "PENDING",

      // Harga berasal dari pricing master
      monthly_price:
        pricing.monthly_price,

      notes:
        payload.notes ?? null,

      created_by:
        user.id,

      requested_by:
        user.id,

    })

    .select()

    .single();


  if (error)
    throw error;


  return data as AssetLoan;

}

// ==============================
// buat Approve
// ==============================

export async function approveLoan(
  loanId: number
): Promise<AssetLoan> {

  const supabase = createClient();

  // ============================================
  // 1. USER LOGIN
  // ============================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User belum login."
    );
  }


  // ============================================
  // 2. AMBIL ROLE USER
  // ============================================

  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();


  if (profileError) {
    throw profileError;
  }


  if (!profile?.role) {
    throw new Error(
      "Role user tidak ditemukan."
    );
  }


  const role =
    profile.role;


  // ============================================
  // 3. AMBIL DATA LOAN
  // ============================================

  const {
    data: loan,
    error: loanError,
  } =
    await supabase
      .from("asset_loans")
      .select(`
        *,
        asset:assets(
          id,
          asset_code,
          asset_name,
          company_id
        )
      `)
      .eq(
        "id",
        loanId
      )
      .single();


  if (loanError) {
    throw loanError;
  }


  if (!loan) {
    throw new Error(
      "Data loan tidak ditemukan."
    );
  }


  // ============================================
  // 4. HANYA PENDING YANG BOLEH DI-APPROVE
  // ============================================

  if (
    loan.status !== "PENDING"
  ) {

    throw new Error(
      `Loan tidak dapat di-approve karena status saat ini ${loan.status}.`
    );

  }


  // ============================================
  // 5. CEK PERMISSION BERDASARKAN OWNER
  // ============================================

  const ownerCompanyId =
    loan.owner_company_id;


  if (
    role !== "it_admin"
  ) {

    const adminCompanyId =
      getAdminCompanyId(role);


    if (
      adminCompanyId === null
    ) {

      throw new Error(
        "User tidak memiliki company."
      );

    }


    if (
      adminCompanyId !==
      ownerCompanyId
    ) {

      throw new Error(
        "Anda tidak memiliki akses untuk approve loan ini."
      );

    }

  }


  // ============================================
  // 6. UPDATE MENJADI APPROVED
  // ============================================

  const {
    data: updatedLoan,
    error: updateError,
  } =
    await supabase
      .from("asset_loans")
      .update({
        status: "APPROVED",

        approved_by:
          user.id,

        approved_at:
          new Date().toISOString(),

        rejected_by:
          null,

        rejected_at:
          null,

        rejection_reason:
          null,
      })
      .eq(
        "id",
        loanId
      )
      .eq(
        "status",
        "PENDING"
      )
      .select(`
        *,
        asset:assets(
          id,
          asset_code,
          asset_name
        ),
        owner_company:companies!asset_loans_owner_company_id_fkey(
          id,
          name
        ),
        borrower_company:companies!asset_loans_borrower_company_id_fkey(
          id,
          name
        )
      `)
      .single();


  if (updateError) {
    throw updateError;
  }


  if (!updatedLoan) {
    throw new Error(
      "Loan gagal di-approve."
    );
  }


  return updatedLoan as AssetLoan;
}

// ==============================
// buat RejectLoan
// ==============================

export async function rejectLoan(
  loanId: number,
  reason: string
): Promise<AssetLoan> {

  const supabase = createClient();

  // ============================================
  // 1. USER LOGIN
  // ============================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User belum login."
    );
  }


  // ============================================
  // 2. AMBIL ROLE USER
  // ============================================

  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();


  if (profileError) {
    throw profileError;
  }


  if (!profile?.role) {
    throw new Error(
      "Role user tidak ditemukan."
    );
  }


  const role =
    profile.role;


  // ============================================
  // 3. VALIDASI ALASAN REJECT
  // ============================================

  const rejectionReason =
    reason.trim();


  if (
    !rejectionReason
  ) {

    throw new Error(
      "Alasan reject wajib diisi."
    );

  }


  // ============================================
  // 4. AMBIL LOAN
  // ============================================

  const {
    data: loan,
    error: loanError,
  } =
    await supabase
      .from("asset_loans")
      .select(`
        *,
        asset:assets(
          id,
          asset_code,
          asset_name,
          company_id
        )
      `)
      .eq(
        "id",
        loanId
      )
      .single();


  if (loanError) {
    throw loanError;
  }


  if (!loan) {
    throw new Error(
      "Data loan tidak ditemukan."
    );
  }


  // ============================================
  // 5. HANYA PENDING YANG BOLEH DI-REJECT
  // ============================================

  if (
    loan.status !== "PENDING"
  ) {

    throw new Error(
      `Loan tidak dapat di-reject karena status saat ini ${loan.status}.`
    );

  }


  // ============================================
  // 6. CEK PERMISSION OWNER
  // ============================================

  const ownerCompanyId =
    loan.owner_company_id;


  if (
    role !== "it_admin"
  ) {

    const adminCompanyId =
      getAdminCompanyId(role);


    if (
      adminCompanyId === null
    ) {

      throw new Error(
        "User tidak memiliki company."
      );

    }


    if (
      adminCompanyId !==
      ownerCompanyId
    ) {

      throw new Error(
        "Anda tidak memiliki akses untuk reject loan ini."
      );

    }

  }


  // ============================================
  // 7. UPDATE MENJADI REJECTED
  // ============================================

  const {
    data: updatedLoan,
    error: updateError,
  } =
    await supabase
      .from("asset_loans")
      .update({
        status: "REJECTED",

        rejected_by:
          user.id,

        rejected_at:
          new Date().toISOString(),

        rejection_reason:
          rejectionReason,

        approved_by:
          null,

        approved_at:
          null,
      })
      .eq(
        "id",
        loanId
      )
      .eq(
        "status",
        "PENDING"
      )
      .select(`
        *,
        asset:assets(
          id,
          asset_code,
          asset_name
        ),
        owner_company:companies!asset_loans_owner_company_id_fkey(
          id,
          name
        ),
        borrower_company:companies!asset_loans_borrower_company_id_fkey(
          id,
          name
        )
      `)
      .single();


  if (updateError) {
    throw updateError;
  }


  if (!updatedLoan) {
    throw new Error(
      "Loan gagal di-reject."
    );
  }


  return updatedLoan as AssetLoan;
}

// ==============================
// GET LOANS
// ==============================
export async function getLoans(
  params: {
    search?: string;
    status?: string;
    ownerCompanyId?: number | null;
    borrowerCompanyId?: number | null;
    page?: number;
    pageSize?: number;
  } = {}
): Promise<{
  data: AssetLoan[];
  total: number;
}> {

  const {
    search = "",
    status = "ALL",
    ownerCompanyId = null,
    borrowerCompanyId = null,
    page = 1,
    pageSize = 10,
  } = params;


  // ==========================================
  // Pagination
  // ==========================================

  const safePage =
    Math.max(
      1,
      page
    );

  const safePageSize =
    Math.max(
      1,
      pageSize
    );

  const from =
    (safePage - 1) *
    safePageSize;

  const to =
    from +
    safePageSize -
    1;


  // ==========================================
  // Query utama
  // ==========================================

  let query =
    supabase
      .from("asset_loans")
      .select(
        `

          *,

          asset:assets(

            id,

            asset_code,

            asset_name,

            model_id

          ),

          owner_company:companies!asset_loans_owner_company_id_fkey(

            id,

            name

          ),

          borrower_company:companies!asset_loans_borrower_company_id_fkey(

            id,

            name

          )

        `,
        {
          count: "exact",
        }
      );


  // ==========================================
  // Filter Owner Company
  // ==========================================

  if (
    ownerCompanyId !== null &&
    ownerCompanyId !== undefined
  ) {

    query =
      query.eq(
        "owner_company_id",
        ownerCompanyId
      );

  }


  // ==========================================
  // Filter Borrower Company
  // ==========================================

  if (
    borrowerCompanyId !== null &&
    borrowerCompanyId !== undefined
  ) {

    query =
      query.eq(
        "borrower_company_id",
        borrowerCompanyId
      );

  }


  // ==========================================
  // Filter Status
  // ==========================================

  if (
    status &&
    status !== "ALL"
  ) {

    query =
      query.eq(
        "status",
        status
      );

  }


// ==========================================
// Search
// ==========================================
if (search.trim()) {
  const keyword = search.trim().replace(/,/g, "");

  // =========================
  // SEARCH LOAN NUMBER
  // =========================

  const {
    data: matchingLoans,
    error: loanSearchError,
  } = await supabase
    .from("asset_loans")
    .select("id")
    .ilike("loan_no", `%${keyword}%`);

  if (loanSearchError) {
    throw loanSearchError;
  }

  const loanIds =
    (matchingLoans ?? []).map(
      (loan) => loan.id
    );

  // =========================
  // SEARCH ASSET CODE / NAME
  // =========================

  const {
    data: matchingAssets,
    error: assetSearchError,
  } = await supabase
    .from("assets")
    .select("id")
    .or(
      [
        `asset_code.ilike.%${keyword}%`,
        `asset_name.ilike.%${keyword}%`,
      ].join(",")
    );

  if (assetSearchError) {
    throw assetSearchError;
  }

  const assetIds =
    (matchingAssets ?? []).map(
      (asset) => asset.id
    );

  // =========================
  // APPLY SEARCH RESULT
  // =========================

  if (
    loanIds.length === 0 &&
    assetIds.length === 0
  ) {
    query = query.eq("id", -1);

  } else if (
    loanIds.length > 0 &&
    assetIds.length > 0
  ) {
    query = query.or(
      [
        `id.in.(${loanIds.join(",")})`,
        `asset_id.in.(${assetIds.join(",")})`,
      ].join(",")
    );

  } else if (loanIds.length > 0) {
    query = query.in(
      "id",
      loanIds
    );

  } else {
    query = query.in(
      "asset_id",
      assetIds
    );
  }
}
  // ==========================================
  // Urut terbaru + pagination
  // ==========================================

  const {
    data,
    error,
    count,
  } =
    await query

      .order(
        "created_at",
        {
          ascending: false,
        }
      )

      .range(
        from,
        to
      );


  if (error) {
    throw error;
  }


  const loans =
    (data ?? []) as any[];


  // ==========================================
  // Tidak ada loan
  // ==========================================

  if (
    loans.length === 0
  ) {

    return {
      data: [],
      total: count ?? 0,
    };

  }


  // ==========================================
  // Ambil semua model_id
  // ==========================================

  const modelIds =
    Array.from(
      new Set(
        loans

          .map(
            (loan) =>
              loan.asset?.model_id
          )

          .filter(
            (id) =>
              id !== null &&
              id !== undefined
          )
      )
    );


  // ==========================================
  // Ambil family_code
  // ==========================================

  let modelFamilyMap =
    new Map<number, string>();


  if (
    modelIds.length > 0
  ) {

    const {
      data: models,
      error: modelError,
    } =
      await supabase

        .from("asset_models")

        .select(`
          id,
          family_code
        `)

        .in(
          "id",
          modelIds
        );


    if (modelError) {
      throw modelError;
    }


    for (
      const model
      of models ?? []
    ) {

      modelFamilyMap.set(
        model.id,
        model.family_code
      );

    }

  }


  // ==========================================
  // Ambil pricing aktif
  // ==========================================

  const {
    data: pricings,
    error: pricingError,
  } =
    await supabase

      .from("asset_loan_pricings")

      .select(`
        owner_company_id,
        borrower_company_id,
        family_code,
        monthly_price
      `)

      .eq(
        "is_active",
        true
      );


  if (pricingError) {
    throw pricingError;
  }


  // ==========================================
  // Buat map pricing
  // ==========================================

  const pricingMap =
    new Map<
      string,
      number
    >();


  for (
    const pricing
    of pricings ?? []
  ) {

    const key =
      `${pricing.owner_company_id}-${pricing.borrower_company_id}-${pricing.family_code}`;


    pricingMap.set(
      key,
      Number(
        pricing.monthly_price
      )
    );

  }


  // ==========================================
  // Pasang harga terbaru
  // ==========================================

  const result =
    loans.map(
      (loan) => {

        const modelId =
          loan.asset?.model_id;


        const familyCode =
          modelId
            ? modelFamilyMap.get(
                modelId
              )
            : null;


        if (
          !familyCode
        ) {

          return loan;

        }


        const key =
          `${loan.owner_company_id}-${loan.borrower_company_id}-${familyCode}`;


        const currentPrice =
          pricingMap.get(
            key
          );


        return {

          ...loan,

          monthly_price:
            currentPrice ??
            null,

        };

      }
    );


  return {

    data:
      result as AssetLoan[],

    total:
      count ?? 0,

  };

}

export async function updateLoanEndDate(
  loanId: number,
  endDate: string | null
) {

  const supabase =
    createClient();

  // =========================
  // AUTH USER
  // =========================

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User belum login."
    );
  }


  // =========================
  // PROFILE / ROLE
  // =========================

  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq(
        "id",
        user.id
      )
      .single();

  if (profileError) {
    throw profileError;
  }

  if (!profile?.role) {
    throw new Error(
      "Role user tidak ditemukan."
    );
  }


  // =========================
  // GET LOAN
  // =========================

  const {
    data: loan,
    error: loanError,
  } =
    await supabase
      .from("asset_loans")
      .select(
        `
          *,
          asset:assets(
            id,
            asset_code,
            asset_name,
            company_id
          )
        `
      )
      .eq(
        "id",
        loanId
      )
      .single();

  if (loanError) {
    throw loanError;
  }

  if (!loan) {
    throw new Error(
      "Data loan tidak ditemukan."
    );
  }


  // =========================
  // STATUS
  // =========================

  if (
    loan.status !==
    "ACTIVE"
  ) {
    throw new Error(
      "Tanggal selesai hanya dapat diubah saat loan ACTIVE."
    );
  }


  // =========================
  // OWNER PERMISSION
  // =========================

  const adminCompanyId =
    getAdminCompanyId(
      profile.role
    );

  const isItAdmin =
    profile.role ===
    "it_admin";

  if (
    !isItAdmin &&
    adminCompanyId !==
      loan.owner_company_id
  ) {
    throw new Error(
      "Anda tidak memiliki akses untuk mengubah tanggal selesai loan ini."
    );
  }


  // =========================
  // VALIDATE DATE
  // =========================

  if (endDate) {

    const startDate =
      new Date(
        loan.start_date
      );

    const newEndDate =
      new Date(
        endDate
      );

    if (
      Number.isNaN(
        newEndDate.getTime()
      )
    ) {
      throw new Error(
        "Tanggal selesai tidak valid."
      );
    }

    if (
      newEndDate <
      startDate
    ) {
      throw new Error(
        "Tanggal selesai tidak boleh sebelum tanggal mulai."
      );
    }

  }


  // =========================
  // UPDATE
  // =========================

  const {
    data,
    error,
  } =
    await supabase
      .from("asset_loans")
      .update({
        end_date:
          endDate || null,
      })
      .eq(
        "id",
        loanId
      )
      .select(
        "*"
      )
      .single();

  if (error) {
    throw error;
  }

  return data;
}

// ==============================
// EXECUTE LOAN
// ==============================

export async function executeLoan(
  loanId: number
): Promise<AssetLoan> {

  const supabase = createClient();

  // ============================================
  // 1. USER LOGIN
  // ============================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User belum login."
    );
  }


  // ============================================
  // 2. AMBIL ROLE USER
  // ============================================

  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();


  if (profileError) {
    throw profileError;
  }


  if (!profile?.role) {
    throw new Error(
      "Role user tidak ditemukan."
    );
  }


  const role =
    profile.role;


  // ============================================
  // 3. AMBIL DATA LOAN
  // ============================================

  const {
    data: loan,
    error: loanError,
  } =
    await supabase
      .from("asset_loans")
      .select(`
        *,
        asset:assets(
          id,
          asset_code,
          asset_name,
          company_id
        )
      `)
      .eq(
        "id",
        loanId
      )
      .single();


  if (loanError) {
    throw loanError;
  }


  if (!loan) {
    throw new Error(
      "Data loan tidak ditemukan."
    );
  }


  // ============================================
  // 4. HANYA APPROVED YANG BOLEH DI-EXECUTE
  // ============================================

  if (
    loan.status !== "APPROVED"
  ) {

    throw new Error(
      `Loan tidak dapat di-execute karena status saat ini ${loan.status}.`
    );

  }


  // ============================================
  // 5. CEK PERMISSION OWNER
  // ============================================

  const ownerCompanyId =
    loan.owner_company_id;


  if (
    role !== "it_admin"
  ) {

    const adminCompanyId =
      getAdminCompanyId(role);


    if (
      adminCompanyId === null
    ) {

      throw new Error(
        "User tidak memiliki company."
      );

    }


    if (
      adminCompanyId !==
      ownerCompanyId
    ) {

      throw new Error(
        "Anda tidak memiliki akses untuk execute loan ini."
      );

    }

  }


  // ============================================
  // 6. CEK ASSET
  // ============================================

  if (!loan.asset) {

    throw new Error(
      "Asset dari loan tidak ditemukan."
    );

  }


  if (
    loan.asset.company_id !==
    loan.owner_company_id
  ) {

    throw new Error(
      "Company asset tidak sesuai dengan owner loan."
    );

  }


  // ============================================
  // 7. PASTIKAN ASSET BELUM ACTIVE LOAN
  // ============================================

  const {
    data: activeLoan,
    error: activeLoanError,
  } =
    await supabase
      .from("asset_loans")
      .select(`
        id,
        loan_no,
        status
      `)
      .eq(
        "asset_id",
        loan.asset_id
      )
      .eq(
        "status",
        "ACTIVE"
      )
      .maybeSingle();


  if (activeLoanError) {
    throw activeLoanError;
  }


  if (activeLoan) {

    throw new Error(
      `Asset sudah sedang dipinjam dengan nomor ${activeLoan.loan_no}.`
    );

  }


  // ============================================
  // 8. UPDATE MENJADI ACTIVE
  // ============================================

  const {
    data: updatedLoan,
    error: updateError,
  } =
    await supabase
      .from("asset_loans")
      .update({
        status:
          "ACTIVE",

        executed_by:
          user.id,

        executed_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        loanId
      )
      .eq(
        "status",
        "APPROVED"
      )
      .select(`
        *,

        asset:assets(
          id,
          asset_code,
          asset_name
        ),

        owner_company:companies!asset_loans_owner_company_id_fkey(
          id,
          name
        ),

        borrower_company:companies!asset_loans_borrower_company_id_fkey(
          id,
          name
        )
      `)
      .single();


  if (updateError) {
    throw updateError;
  }


  if (!updatedLoan) {

  throw new Error(
    "Loan gagal di-execute."
  );

}


// ============================================
// 9. BUAT ASSET HISTORY - BORROW
// ============================================

await createAssetHistory({

  asset_id:
    loan.asset_id,

  action_type:
    "BORROW",

  reference_no:
    loan.loan_no,

  old_company_id:
    null,

  new_company_id:
    null,

  remarks:
    `Asset dipinjam oleh ${loan.borrower_company_id}.`,

  requested_by:
    loan.requested_by,

  approved_by:
    loan.approved_by,

  approved_at:
    loan.approved_at,

  created_by:
    user.id,

  request_status:
    "ACTIVE",

});


return updatedLoan as AssetLoan;

}

// ==============================
// RETURN LOAN
// ==============================

export async function returnLoan(
  loanId: number
): Promise<AssetLoan> {

  const supabase = createClient();

  // ============================================
  // 1. USER LOGIN
  // ============================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User belum login."
    );
  }


  // ============================================
  // 2. AMBIL ROLE USER
  // ============================================

  const {
    data: profile,
    error: profileError,
  } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();


  if (profileError) {
    throw profileError;
  }


  if (!profile?.role) {
    throw new Error(
      "Role user tidak ditemukan."
    );
  }


  const role =
    profile.role;


  // ============================================
  // 3. AMBIL DATA LOAN
  // ============================================

  const {
    data: loan,
    error: loanError,
  } =
    await supabase
      .from("asset_loans")
      .select(`
        *,
        asset:assets(
          id,
          asset_code,
          asset_name,
          company_id
        )
      `)
      .eq(
        "id",
        loanId
      )
      .single();


  if (loanError) {
    throw loanError;
  }


  if (!loan) {
    throw new Error(
      "Data loan tidak ditemukan."
    );
  }


  // ============================================
  // 4. HANYA ACTIVE YANG BOLEH DI-RETURN
  // ============================================

  if (
    loan.status !== "ACTIVE"
  ) {

    throw new Error(
      `Loan tidak dapat di-return karena status saat ini ${loan.status}.`
    );

  }


  // ============================================
  // 5. CEK PERMISSION OWNER
  // ============================================

  const ownerCompanyId =
    loan.owner_company_id;


  if (
    role !== "it_admin"
  ) {

    const adminCompanyId =
      getAdminCompanyId(role);


    if (
      adminCompanyId === null
    ) {

      throw new Error(
        "User tidak memiliki company."
      );

    }


    if (
      adminCompanyId !==
      ownerCompanyId
    ) {

      throw new Error(
        "Anda tidak memiliki akses untuk return loan ini."
      );

    }

  }


  // ============================================
  // 6. UPDATE MENJADI RETURNED
  // ============================================

  const {
    data: updatedLoan,
    error: updateError,
  } =
    await supabase
      .from("asset_loans")
      .update({
        status:
          "RETURNED",

        returned_by:
          user.id,

        returned_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        loanId
      )
      .eq(
        "status",
        "ACTIVE"
      )
      .select(`
        *,

        asset:assets(
          id,
          asset_code,
          asset_name
        ),

        owner_company:companies!asset_loans_owner_company_id_fkey(
          id,
          name
        ),

        borrower_company:companies!asset_loans_borrower_company_id_fkey(
          id,
          name
        )
      `)
      .single();


  if (updateError) {
    throw updateError;
  }


  if (!updatedLoan) {

  throw new Error(
    "Loan gagal di-return."
  );

}


// ============================================
// 7. BUAT ASSET HISTORY - RETURN
// ============================================

await createAssetHistory({

  asset_id:
    loan.asset_id,

  action_type:
    "RETURN",

  reference_no:
    loan.loan_no,

  old_company_id:
    null,

  new_company_id:
    null,

  remarks:
    "Asset telah dikembalikan dari peminjaman.",

  created_by:
    user.id,

  request_status:
    "RETURNED",

});


return updatedLoan as AssetLoan;

}

// ==============================
// GET LOAN BY ID
// ==============================

export async function getLoanById(

  id: number

): Promise<AssetLoan> {

  const {

    data,

    error,

  } = await supabase

    .from("asset_loans")

    .select(`

      *,

      asset:assets(

        id,

        asset_code,

        asset_name,

        model_id

      ),

      owner_company:companies!asset_loans_owner_company_id_fkey(

        id,

        name

      ),

      borrower_company:companies!asset_loans_borrower_company_id_fkey(

        id,

        name

      )

    `)

    .eq(
      "id",
      id
    )

    .single();


  if (error)
    throw error;


  const loan =
    data as any;


  // ==========================================
  // Asset tidak memiliki model
  // ==========================================

  if (!loan.asset?.model_id) {

    return loan as AssetLoan;

  }


  // ==========================================
  // Ambil family_code dari asset_models
  // ==========================================

  const {

    data: model,

    error: modelError,

  } = await supabase

    .from("asset_models")

    .select(`
      id,
      family_code
    `)

    .eq(
      "id",
      loan.asset.model_id
    )

    .single();


  if (modelError)
    throw modelError;


  if (!model?.family_code) {

    return loan as AssetLoan;

  }


  // ==========================================
  // Ambil harga terbaru dari Asset Pricing
  // ==========================================

  const {

    data: pricing,

    error: pricingError,

  } = await supabase

    .from("asset_loan_pricings")

    .select(`
      monthly_price
    `)

    .eq(
      "owner_company_id",
      loan.owner_company_id
    )

    .eq(
      "borrower_company_id",
      loan.borrower_company_id
    )

    .eq(
      "family_code",
      model.family_code
    )

    .eq(
      "is_active",
      true
    )

    .maybeSingle();


  if (pricingError)
    throw pricingError;


  // ==========================================
  // Gunakan harga terbaru
  // ==========================================

  return {

    ...loan,

    monthly_price:
      pricing
        ? Number(
            pricing.monthly_price
          )
        : null,

  } as AssetLoan;

}