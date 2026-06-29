export interface Peripheral {
  id: number;

  ip_management_id: number;

  ip_management: {
    id: number;
    device: string;
    ip_terkini: string;
    ruangan: string;
    jenis_network: string;
  };

  peripheral_device_addons: {
    id: number;

    addon: {
      id: number;
      addon_name: string;
    };
  }[];
}
export interface AvailableDevice {
  id: number;

  device: string;

  ip_terkini: string;

  ruangan: string;

  jenis_network: string;
}



export interface Addon {
  id: number;

  addon_name: string;

  description: string | null;

  is_active: boolean;

  created_at: string;
}