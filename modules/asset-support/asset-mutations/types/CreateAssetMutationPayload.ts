export interface CreateAssetMutationPayload {

  asset_id: number;

  from_company_id: number;

  to_company_id: number;

  from_location_id: number;

  to_location_id: number;

  reason?: string;

  remarks?: string;
}