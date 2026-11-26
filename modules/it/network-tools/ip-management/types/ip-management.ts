export interface Device {
  id: number;

  ruangan: string;

  jenis_network: string;

  device: string;

  keterangan: string;

  fungsional: string;

  whitelist: string;

  ip_terkini: string;

  isp_utama: string;

  isp_backup: string;

  // Relasi ke Asset
  asset?: {
    id: number;

    location?: {
      id: number;
      code: string;
      name: string;
    } | null;

  }[] | null;
}