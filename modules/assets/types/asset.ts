export interface Asset {

  id: number;

  asset_code: string;

  barcode: string;

  asset_name: string;

  company_id: number | null;

  location_id: number | null;

  category_id: number | null;

  model_id: number | null;

  condition_id: number | null;

  status_id: number | null;

  brand: string | null;

  serial_number: string | null;

  purchase_date: string | null;

  purchase_price: number | null;

  supplier: string | null;

  invoice_number: string | null;

  warranty_until: string | null;

  ip_management_id: number | null;

  spec_json: Record<string, any> | null;

  notes: string | null;

  is_active: boolean;

  created_by: string | null;

  created_at: string;

  updated_by: string | null;

  updated_at: string;
}

export interface CreateAssetPayload {

  asset_code: string;

  asset_name: string;

  company_id: number | null;

  location_id: number | null;

  category_id: number | null;

  model_id: number | null;

  ip_management_id:
  number | null;

  condition_id: number | null;

  status_id: number | null;

  brand: string | null;

  serial_number: string | null;

  purchase_date: string | null;

  purchase_price: number | null;

  warranty_until: string | null;

  notes: string | null;

  spec_json: Record<string, any> | null;

}