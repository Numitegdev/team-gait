import { Peripheral } from "@/modules/it/peripheral/types/peripheral.types";

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

 peripheral?: Pick<
  Peripheral,
  | "id"
  | "scanner_version"
  | "last_scan_at"
  | "last_scan_by"
  | "hardware"
  | "software"
  | "score"
  | "status"
  | "score_detail"
> | null;
}