import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface AssetDashboardAsset {
  id: number;
  asset_code: string;
  asset_name: string;
  company_id: number;
  model_id: number | null;
  status_id: number | null;
  is_active: boolean;

  company?: {
    id: number;
    name: string;
  }[] | null;

  model?: {
    id: number;
    family_code: string;
    name: string;
  }[] | null;

  status?: {
    id: number;
    name: string;
  }[] | null;
}

export interface AssetDashboardActiveLoan {
  id: number;
  asset_id: number;
  owner_company_id: number;
  borrower_company_id: number;
  loan_no: string;
  start_date: string;
  end_date: string | null;
  status: "ACTIVE";
}

export async function getAssetDashboardAssets(
  companyId?: number | null
): Promise<AssetDashboardAsset[]> {

  let query = supabase
    .from("assets")
    .select(`
      id,
      asset_code,
      asset_name,
      company_id,
      model_id,
      status_id,
      is_active,

      company:companies(
        id,
        name
      ),

      model:asset_models(
        id,
        family_code,
        name
      ),

      status:asset_statuses(
        id,
        name
      )
    `)
    .eq("is_active", true);

  if (companyId) {
    query = query.eq(
      "company_id",
      companyId
    );
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getAssetDashboardActiveLoans(): Promise<
  AssetDashboardActiveLoan[]
> {

  const {
    data,
    error,
  } = await supabase
    .from("asset_loans")
    .select(`
      id,
      asset_id,
      owner_company_id,
      borrower_company_id,
      loan_no,
      start_date,
      end_date,
      status
    `)
    .eq("status", "ACTIVE");

  if (error) {
    throw error;
  }

  return data ?? [];
}

export interface AssetDashboardSummary {
  total: number;
  available: number;
  loaned: number;
  lost: number;
}

export interface AssetDashboardCompany {
  company_id: number;
  company_name: string;
  total: number;
}
export interface AssetDashboardType {
  family_code: string;
  model_names: string[];
  total: number;
}

export interface AssetDashboardLoanedAsset {
  owner_company_id: number;
  owner_company_name: string;
  borrower_company_id: number;
  borrower_company_name: string;
  family_code: string;
  total: number;
}

export interface AssetDashboardLoanPricing {
  owner_company_id: number;
  borrower_company_id: number;
  family_code: string;
  monthly_price: number;
}

export async function getAssetDashboardLoanPricings(
  ownerCompanyId: number,
  borrowerCompanyId: number
): Promise<AssetDashboardLoanPricing[]> {

  const {
    data,
    error,
  } = await supabase
    .from("asset_loan_pricings")
    .select(`
      owner_company_id,
      borrower_company_id,
      family_code,
      monthly_price
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
      "is_active",
      true
    );

  if (error) {
    throw error;
  }

  return (
    data ?? []
  ).map(
    (item) => ({
      owner_company_id:
        item.owner_company_id,

      borrower_company_id:
        item.borrower_company_id,

      family_code:
        item.family_code,

      monthly_price:
        Number(
          item.monthly_price
        ),
    })
  );

}

export async function getAssetDashboardSummary(
  companyId?: number | null
): Promise<AssetDashboardSummary> {

  const assets =
    await getAssetDashboardAssets(
      companyId
    );

  const activeLoans =
    await getAssetDashboardActiveLoans();

  const activeLoanAssetIds =
    new Set(
      activeLoans.map(
        (loan) => loan.asset_id
      )
    );

  const total =
    assets.length;

  const loaned =
    assets.filter(
      (asset) =>
        activeLoanAssetIds.has(
          asset.id
        )
    ).length;

  /*
   * Untuk sementara kita ambil
   * status "Hilang" berdasarkan
   * nama status dari master.
   */
const lost =
  assets.filter(
    (asset) => {

      const status =
        Array.isArray(asset.status)
          ? asset.status[0]
          : asset.status;

      return (
        status?.name
          ?.toLowerCase()
          .includes("hilang") ?? false
      );

    }
  ).length;

  const available =
    total -
    loaned -
    lost;

  return {
    total,
    available,
    loaned,
    lost,
  };
}


export async function getAssetDashboardByCompany(
  companyId?: number | null
): Promise<AssetDashboardCompany[]> {

  const assets =
    await getAssetDashboardAssets(
      companyId
    );

  const companyMap =
    new Map<
      number,
      AssetDashboardCompany
    >();

  for (const asset of assets) {

    const company =
      asset.company?.[0];

    if (!company) {
      continue;
    }

    const existing =
      companyMap.get(
        company.id
      );

    if (existing) {

      existing.total += 1;

    } else {

      companyMap.set(
        company.id,
        {
          company_id:
            company.id,

          company_name:
            company.name,

          total: 1,
        }
      );

    }
  }

  return Array.from(
    companyMap.values()
  ).sort(
    (a, b) =>
      b.total - a.total
  );
}


export async function getAssetDashboardByFamily(
  companyId?: number | null
): Promise<AssetDashboardType[]> {

  const assets =
    await getAssetDashboardAssets(
      companyId
    );

  const familyMap =
    new Map<
      string,
      AssetDashboardType
    >();

  for (const asset of assets) {

    const model =
      Array.isArray(asset.model)
        ? asset.model[0]
        : asset.model;

    if (!model) {
      continue;
    }

    const familyCode =
      model.family_code;

    if (!familyCode) {
      continue;
    }

    const existing =
      familyMap.get(
        familyCode
      );

    if (existing) {

      existing.total += 1;

      if (
        !existing.model_names.includes(
          model.name
        )
      ) {

        existing.model_names.push(
          model.name
        );

      }

    } else {

      familyMap.set(
        familyCode,
        {
          family_code:
            familyCode,

          model_names: [
            model.name,
          ],

          total: 1,
        }
      );

    }

  }

  return Array.from(
    familyMap.values()
  ).sort(
    (a, b) =>
      b.total - a.total
  );

}

export async function getAssetDashboardLoanedAssets(
  companyId?: number | null
): Promise<AssetDashboardLoanedAsset[]> {

  let query = supabase
    .from("asset_loans")
    .select(`
      id,
      owner_company_id,
      borrower_company_id,
      loan_no,

      owner_company:companies!asset_loans_owner_company_id_fkey(
        id,
        name
      ),

      borrower_company:companies!asset_loans_borrower_company_id_fkey(
        id,
        name
      ),

      asset:assets(
        id,
        model:asset_models(
          id,
          family_code,
          name
        )
      )
    `)
    .eq("status", "ACTIVE");

  // =========================
  // FILTER OWNER COMPANY
  // =========================

  if (companyId) {

    query = query.eq(
      "owner_company_id",
      companyId
    );

  }

  const {
    data,
    error,
  } = await query;

  if (error) {

    throw error;

  }

  const grouped =
    new Map<
      string,
      AssetDashboardLoanedAsset
    >();

  for (
    const loan of data ?? []
  ) {

    const ownerCompany =
      Array.isArray(loan.owner_company)
        ? loan.owner_company[0]
        : loan.owner_company;

    const borrowerCompany =
      Array.isArray(loan.borrower_company)
        ? loan.borrower_company[0]
        : loan.borrower_company;

    const asset =
      Array.isArray(loan.asset)
        ? loan.asset[0]
        : loan.asset;

    const model =
      Array.isArray(asset?.model)
        ? asset.model[0]
        : asset?.model;

    if (
      !ownerCompany ||
      !borrowerCompany ||
      !model?.family_code
    ) {

      continue;

    }

    const key =
      `${ownerCompany.id}-${borrowerCompany.id}-${model.family_code}`;

    const existing =
      grouped.get(key);

    if (existing) {

      existing.total += 1;

    } else {

      grouped.set(
        key,
        {
          owner_company_id:
            ownerCompany.id,

          owner_company_name:
            ownerCompany.name,

          borrower_company_id:
            borrowerCompany.id,

          borrower_company_name:
            borrowerCompany.name,

          family_code:
            model.family_code,

          total: 1,
        }
      );

    }

  }

  return Array.from(
    grouped.values()
  );

}