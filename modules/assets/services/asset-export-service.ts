
import * as XLSX from "xlsx";
import { AssetListItem } from "../types/AssetListItem";

/**
 * Format tanggal tanpa pergeseran timezone.
 * Input database: YYYY-MM-DD
 */
function formatDate(
  value: string | null | undefined
): string {
  if (!value) return "";

  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) return datePart;

  return `${day}/${month}/${year}`;
}

/**
 * Status garansi berdasarkan tanggal hari ini.
 */
function getWarrantyStatus(
  warrantyUntil: string | null
): string {
  if (!warrantyUntil) return "Tidak ada data";

  const today = new Date();

  const todayKey =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const warrantyKey = warrantyUntil.slice(0, 10);

  if (warrantyKey < todayKey) return "Garansi habis";
  if (warrantyKey === todayKey) return "Berakhir hari ini";

  return "Masih berlaku";
}

export function exportAssetsToExcel(
  assets: AssetListItem[]
): void {
  if (assets.length === 0) {
    window.alert("Tidak ada data aset untuk diexport.");
    return;
  }

  const rows = assets.map((asset) => ({
    "Kode Aset": asset.asset_code ?? "",
    "Nama Aset": asset.asset_name ?? "",
    "Barcode": asset.barcode ?? "",
    "PT Pemilik": asset.company?.name ?? "",
    "Lokasi": asset.location?.name ?? "",
    "Kategori": asset.category?.name ?? "",
    "Model": asset.model?.name ?? "",
    "Brand": asset.brand ?? "",
    "Serial Number": asset.serial_number ?? "",
    "Kondisi": asset.condition?.name ?? "",
    "Status": asset.status?.name ?? "",
    "Tanggal Pembelian": formatDate(asset.purchase_date),
    "Harga Pembelian": asset.purchase_price ?? "",
    "Supplier": asset.supplier ?? "",
    "Nomor Invoice": asset.invoice_number ?? "",
    "Garansi Sampai": formatDate(asset.warranty_until),
    "Status Garansi": getWarrantyStatus(asset.warranty_until),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 16 },
    { wch: 30 },
    { wch: 22 },
    { wch: 24 },
    { wch: 24 },
    { wch: 20 },
    { wch: 25 },
    { wch: 20 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
    { wch: 25 },
    { wch: 22 },
    { wch: 18 },
    { wch: 22 },
  ];

  // Bekukan baris judul dan aktifkan filter Excel.
  worksheet["!autofilter"] = {
    ref: worksheet["!ref"] ?? "A1",
  };

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Data Assets"
  );

  const today = new Date();
  const dateLabel =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  XLSX.writeFile(
    workbook,
    `data-assets-${dateLabel}.xlsx`
  );
}
