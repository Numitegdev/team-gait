export interface AssetMutation {

  id: number;

  mutation_no: string;

  asset_id: number;

  from_company_id: number | null;

  to_company_id: number | null;

  from_location_id: number | null;

  to_location_id: number | null;

  reason: string | null;

  remarks: string | null;

  status: string;

  requested_by: string | null;

  requested_at: string;

  approved_by: string | null;

  approved_at: string | null;

  rejected_by: string | null;

  rejected_at: string | null;

  rejection_reason: string | null;

  executed_by: string | null;

  executed_at: string | null;

  created_at: string;

  asset?: {

    asset_code: string;

    asset_name: string;

  };

  from_company?: {

    name: string;

  };

  to_company?: {

    name: string;

  };

  from_location?: {

    name: string;

  };

  to_location?: {

    name: string;

  };

  requester?: {

    full_name: string;

  };

}