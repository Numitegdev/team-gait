
export type AssetAuditResult =
  | "found"
  | "discrepancy"
  | "not_found";

export type AssetAuditFilter = {
  auditMonth: string;
  companyId?: number | null;
  locationId?: number | null;
};

export type AssetAuditRecord = {
  id: number;
  audit_month: string;
  asset_id: number;
  result: AssetAuditResult;
  discrepancy_type: string | null;
  notes: string | null;
  actual_location_id: number | null;
  checked_by: string | null;
  checked_at: string;
};

export type AssetAuditHistory = {
  id: number;
  audit_record_id: number;
  previous_result: AssetAuditResult | null;
  new_result: AssetAuditResult;
  discrepancy_type: string | null;
  notes: string | null;
  actual_location_id: number | null;
  changed_by: string | null;
  changed_at: string;
};

export type AssetAuditSubmission = {
  auditMonth: string;
  assetId: number;
  result: AssetAuditResult;
  discrepancyType?: string | null;
  notes?: string | null;
  actualLocationId?: number | null;
};
