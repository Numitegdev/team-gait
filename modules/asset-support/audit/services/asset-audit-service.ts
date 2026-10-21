
import { createClient } from "@/lib/supabase/client";
import { getAdminCompanyId } from "@/lib/auth/company-permission";
import type {
  AssetAuditFilter,
  AssetAuditHistory,
  AssetAuditRecord,
  AssetAuditResult,
  AssetAuditSubmission,
} from "../types/asset-audit";

const AUDIT_TABLE = "asset_audit_records";
const HISTORY_TABLE = "asset_audit_history";

function getSupabase() {
  return createClient();
}

function normalizeAuditMonth(month: string): string {
  if (!/^\d{4}-\d{2}$/.test(month)) {
    throw new Error("Periode audit harus berformat YYYY-MM.");
  }

  const [year, monthNumber] = month.split("-").map(Number);

  if (monthNumber < 1 || monthNumber > 12) {
    throw new Error("Bulan audit tidak valid.");
  }

  return `${year}-${String(monthNumber).padStart(2, "0")}-01`;
}

function validateResult(
  result: AssetAuditResult,
  discrepancyType?: string | null,
) {
  if (
    result === "discrepancy" &&
    !discrepancyType?.trim()
  ) {
    throw new Error(
      "Jenis ketidaksesuaian wajib dipilih.",
    );
  }
}

export async function getAssetAuditList(
  filters: AssetAuditFilter,
) {
  const supabase = getSupabase();
  const auditMonth = normalizeAuditMonth(filters.auditMonth);
const access = await getAuditAccess();

// Hanya it_admin dan admin PT yang terdaftar
// dalam adminCompanyMap yang boleh membuka audit.
if (!access.isItAdmin && access.companyId === null) {
  return [];
}
  let query = supabase
    .from("assets")
    .select(`
      id,
      asset_code,
      barcode,
      asset_name,
      company_id,
      location_id,
      brand,
      serial_number,
      notes,
      company:companies(id, name),
      location:locations(id, code, name),
      category:asset_categories(id, name),
      model:asset_models(id, name),
      condition:asset_conditions(id, name),
      status:asset_statuses(id, name),
      audit:asset_audit_records!asset_audit_records_asset_id_fkey(
        id,
        audit_month,
        result,
        discrepancy_type,
        notes,
        actual_location_id,
        checked_by,
        checked_at
      )
    `)
    .eq("is_active", true)
    .order("asset_code", { ascending: true });

if (!access.isItAdmin) {
  query = query.eq("company_id", access.companyId!);
} else if (filters.companyId != null) {
  query = query.eq("company_id", filters.companyId);
}

  if (filters.locationId != null) {
    query = query.eq("location_id", filters.locationId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []).map((asset) => {
    const auditRecords = Array.isArray(asset.audit)
      ? asset.audit
      : asset.audit
        ? [asset.audit]
        : [];

    const currentAudit = auditRecords.find(
      (record) => record.audit_month === auditMonth,
    );

    return {
      ...asset,
      audit: currentAudit ?? null,
      auditProgress: currentAudit?.result ?? "unchecked",
    };
  });
}

async function getAuditAccess() {
  const supabase = getSupabase();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  if (!profile?.role) {
    throw new Error("Role pengguna tidak ditemukan.");
  }

  const role = profile.role as string;

  return {
    role,
    companyId: getAdminCompanyId(role),
    isItAdmin: role === "it_admin",
  };
}

export async function findAssetForAudit(
  assetCode: string,
) {
  const code = assetCode.trim();

  if (!code) {
    throw new Error("Masukkan kode aset terlebih dahulu.");
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("assets")
    .select(`
      id,
      asset_code,
      barcode,
      asset_name,
      company_id,
      location_id,
      brand,
      serial_number,
      notes,
      company:companies(id, name),
      location:locations(id, code, name),
      category:asset_categories(id, name),
      model:asset_models(id, name),
      condition:asset_conditions(id, name),
      status:asset_statuses(id, name)
    `)
    .eq("is_active", true)
    .eq("asset_code", code)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error(`Aset dengan kode ${code} tidak ditemukan.`);
  }

  return data;
}

export async function getAssetAuditHistory(
  auditRecordId: number,
): Promise<AssetAuditHistory[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from(HISTORY_TABLE)
    .select("*")
    .eq("audit_record_id", auditRecordId)
    .order("changed_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as AssetAuditHistory[];
}

export async function saveAssetAudit(
  input: AssetAuditSubmission,
): Promise<AssetAuditRecord> {
  const supabase = getSupabase();

  const auditMonth = normalizeAuditMonth(input.auditMonth);
  const discrepancyType =
    input.discrepancyType?.trim() || null;
  const notes = input.notes?.trim() || null;
  const actualLocationId = input.actualLocationId ?? null;

  validateResult(input.result, discrepancyType);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error("Silakan login terlebih dahulu.");
  }

  // Pastikan aset masih aktif dan tersedia di database.
  const { data: asset, error: assetError } = await supabase
    .from("assets")
    .select("id, company_id")
    .eq("id", input.assetId)
    .eq("is_active", true)
    .maybeSingle();

  if (assetError) throw assetError;

  if (!asset) {
    throw new Error("Aset tidak ditemukan atau sudah tidak aktif.");
  }

  // Ambil hasil audit yang sudah ada pada periode ini.
  const { data: existing, error: existingError } = await supabase
    .from(AUDIT_TABLE)
    .select("*")
    .eq("asset_id", input.assetId)
    .eq("audit_month", auditMonth)
    .maybeSingle();

  if (existingError) throw existingError;

  if (
    existing &&
    existing.result === input.result &&
    (existing.discrepancy_type ?? null) === discrepancyType &&
    (existing.notes ?? null) === notes &&
    (existing.actual_location_id ?? null) === actualLocationId
  ) {
    throw new Error("Aset sudah diaudit pada periode ini.");
  }

  // Simpan hasil terbaru. UNIQUE (audit_month, asset_id)
  // di database menjadi perlindungan tambahan dari duplikasi.
  const payload = {
    audit_month: auditMonth,
    asset_id: input.assetId,
    result: input.result,
    discrepancy_type: discrepancyType,
    notes,
    actual_location_id: actualLocationId,
    checked_by: user.id,
    checked_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let savedRecord: AssetAuditRecord;

  if (existing) {
    const { data, error } = await supabase
      .from(AUDIT_TABLE)
      .update(payload)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) throw error;

    savedRecord = data as AssetAuditRecord;
  } else {
    const { data, error } = await supabase
      .from(AUDIT_TABLE)
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      // Menangani kemungkinan dua permintaan bersamaan.
      if (error.code === "23505") {
        throw new Error("Aset sudah diaudit pada periode ini.");
      }

      throw error;
    }

    savedRecord = data as AssetAuditRecord;
  }

  // Catat pemeriksaan awal maupun perubahan hasil.
  const { error: historyError } = await supabase
    .from(HISTORY_TABLE)
    .insert({
      audit_record_id: savedRecord.id,
      previous_result: existing?.result ?? null,
      new_result: input.result,
      discrepancy_type: discrepancyType,
      notes,
      actual_location_id: actualLocationId,
      changed_by: user.id,
      changed_at: new Date().toISOString(),
    });

  if (historyError) {
    throw new Error(
      `Hasil audit tersimpan, tetapi riwayat gagal disimpan: ${historyError.message}`,
    );
  }

  return savedRecord;
}

export async function getAssetAuditFilterOptions() {
  const supabase = getSupabase();
  const access = await getAuditAccess();

  if (!access.isItAdmin && access.companyId === null) {
    throw new Error("Role tidak memiliki akses audit aset.");
  }

  let companyQuery = supabase
    .from("companies")
    .select("id, name")
    .order("name");

  if (!access.isItAdmin) {
    companyQuery = companyQuery.eq("id", access.companyId!);
  }

  const { data: companies, error: companyError } =
    await companyQuery;

  if (companyError) throw companyError;

  const { data: locations, error: locationError } =
    await supabase
      .from("locations")
      .select("id, code, name")
      .eq("is_active", true)
      .order("display_order");

  if (locationError) throw locationError;

  return {
    companies: companies ?? [],
    locations: locations ?? [],
  };
}