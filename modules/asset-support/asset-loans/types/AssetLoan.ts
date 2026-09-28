export interface AssetLoan {

  id: number;

  loan_no: string;

  asset_id: number;

  owner_company_id: number;

  borrower_company_id: number;

  start_date: string;

  end_date: string | null;

  status:
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "RETURNED"
  | "REJECTED"
  | "CANCELLED";

  monthly_price: number | null;

  notes: string | null;

  returned_at: string | null;

  returned_by: string | null;

  created_by: string | null;

  created_at: string;


  // Relations

  asset?: {

    id: number;

    asset_code: string;

    asset_name: string;

  } | null;


  owner_company?: {

    id: number;

    name: string;

  } | null;


  borrower_company?: {

    id: number;

    name: string;

  } | null;

}