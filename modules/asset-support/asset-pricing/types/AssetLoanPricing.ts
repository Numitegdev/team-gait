export interface AssetLoanPricing {
  id: number;

  owner_company_id: number;
  borrower_company_id: number;

  family_code: string;

  monthly_price: number;

  is_active: boolean;

  created_by: string | null;
  created_at: string;

  updated_by: string | null;
  updated_at: string;

  owner_company?: {
    id: number;
    name: string;
  } | null;

  borrower_company?: {
    id: number;
    name: string;
  } | null;
}