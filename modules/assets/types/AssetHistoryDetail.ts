export interface AssetHistoryDetail {

  id: number;

  asset_id: number;

  action_type: string;

  remarks: string | null;

  created_at: string;

  created_by: string | null;

  request_status: string | null;

  old_company: {

    name: string;

  } | null;

  new_company: {

    name: string;

  } | null;

  old_location: {

    name: string;

  } | null;

  new_location: {

    name: string;

  } | null;

  old_condition: {

    name: string;

  } | null;

  new_condition: {

    name: string;

  } | null;

  old_status: {

    name: string;

  } | null;

  new_status: {

    name: string;

  } | null;

  old_ip?: {

  ip_terkini: string;

} | null;

new_ip?: {

  ip_terkini: string;

} | null;

created_user?: {

  full_name: string;

} | null;

}

