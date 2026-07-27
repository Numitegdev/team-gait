export interface Company {

  id: number;

  code: string;

  asset_code_prefix: string;

  name: string;

  description: string | null;

  display_order: number;

  is_active: boolean;

  created_at: string;

  updated_at: string;

}