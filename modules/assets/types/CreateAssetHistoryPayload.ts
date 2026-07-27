export interface CreateAssetHistoryPayload {

  asset_id: number;

  action_type: string;

  reference_no?: string | null;

  old_company_id?: number | null;

  new_company_id?: number | null;

  old_location_id?: number | null;

  new_location_id?: number | null;

  old_condition_id?: number | null;

  new_condition_id?: number | null;

  old_status_id?: number | null;

  new_status_id?: number | null;

  old_ip_management_id?: number | null;

  new_ip_management_id?: number | null;

  request_status?: string | null;

  remarks?: string | null;

  requested_by?: string | null;

  approved_by?: string | null;

  approved_at?: string | null;

  created_by?: string | null;

}