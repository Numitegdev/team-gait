export interface AssetFormData {

  asset_code: string;

  asset_name: string;

  company_id: number | null;

  location_id: number | null;

  category_id: number | null;

  model_id: number | null;

  brand: string;

  serial_number: string;

  specification: string;

  condition_id: number | null;

  status_id: number | null;

  purchase_date: string;

  warranty_until: string;

  purchase_price: number | null;

  notes: string;

  ip_management_id: number | null;

}