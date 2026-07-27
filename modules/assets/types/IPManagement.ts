export interface IPManagement {

  id: number;

  ruangan: string | null;

  jenis_network: string | null;

  device: string | null;

  keterangan: string | null;

  fungsional: string | null;

  whitelist: boolean | null;

  ip_terkini: string;

  isp_utama: string | null;

  isp_backup: string | null;

}