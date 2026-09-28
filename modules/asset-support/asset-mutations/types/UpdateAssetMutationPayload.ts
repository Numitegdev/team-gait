export interface UpdateAssetMutationPayload {

  status: string;

  approved_by?: string;

  approved_at?: string;

  rejected_by?: string;

  rejected_at?: string;

  rejection_reason?: string;

  executed_by?: string;

  executed_at?: string;
}