export interface SecurityLocation {

  id: number;

  nama_lokasi: string;

  aktif: boolean;

}

export interface SecurityCheck {

  id: number;

  tanggal: string;

  shift: string;

  petugas: string;

  catatan: string;

}

export interface SecurityCheckDetail {

  id?: number;

  lokasi_id: number;

  foto_url: string;

  status: string;

  catatan: string;

}