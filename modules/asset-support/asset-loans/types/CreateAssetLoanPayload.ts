export interface CreateAssetLoanPayload {

  

  asset_id: number;

  owner_company_id: number;

  borrower_company_id: number;

  start_date: string;

  end_date?: string | null;

  status?: 
    | "ACTIVE"
    | "RETURNED"
    | "CANCELLED";

  monthly_price?: number | null;

  notes?: string | null;

}