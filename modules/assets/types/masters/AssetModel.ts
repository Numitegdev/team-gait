export interface AssetModel {

  id: number;

  category_id: number;

  code: string;

  name: string;

  description: string | null;

  display_order: number;

  is_active: boolean;

  created_at: string;

  updated_at: string;

  has_ip: boolean;

  has_peripheral: boolean;

   allow_multiple_quantity: boolean;

  require_serial_number: boolean;

  spec_source: string;


}