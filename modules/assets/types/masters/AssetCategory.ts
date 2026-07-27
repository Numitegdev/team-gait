export interface AssetCategory {

  id: number;

  name: string;

  description: string | null;

  has_ip: boolean;

  has_peripheral: boolean;

  allow_multiple_quantity: boolean;

  display_order: number;

  is_active: boolean;

  created_at: string;

  updated_at: string;

}