import * as XLSX from "xlsx";

import { AssetListItem }
from "../types/AssetListItem";

function formatDate(
  value: string | null | undefined
) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
}

function formatWarrantyStatus(
  warrantyUntil: string | null | undefined
) {
  if (!warrantyUntil) {
    return "Tidak ada data garansi";
  }

  const today = new Date();

  const warrantyDate =
    new Date(warrantyUntil);

  today.setHours(0, 0, 0, 0);
  warrantyDate.setHours(0, 0, 0, 0);

  const difference =
    warrantyDate.getTime() -
    today.getTime();

  const remainingDays =
    Math.ceil(
      difference /
      (1000 * 60 * 60 * 24)
    );

  if (remainingDays < 0) {
    return "Garansi Habis";
  }

  if (remainingDays === 0) {
    return "Garansi Berakhir Hari Ini";
  }

  const months =
    Math.floor(remainingDays / 30);

  if (months >= 1) {
    return `${months} bulan tersisa`;
  }

  return `${remainingDays} hari tersisa`;
}

export function exportAssetsToExcel(
  assets: AssetListItem[]
) {

  const rows = assets.map(
    (asset) => ({

      "Kode Aset":
        asset.asset_code ?? "-",

      "Nama Aset":
        asset.asset_name ?? "-",

      "Barcode":
        asset.barcode ?? "-",

      "PT Pemilik":
        asset.company?.name ?? "-",

      "Lokasi":
        asset.location?.name ?? "-",

      "Kategori":
        asset.category?.name ?? "-",

      "Model":
        asset.model?.name ?? "-",

      "Brand":
        asset.brand ?? "-",

      "Serial Number":
        asset.serial_number ?? "-",

      "Kondisi":
        asset.condition?.name ?? "-",

      "Status":
        asset.status?.name ?? "-",

      "Tanggal Pembelian":
        formatDate(asset.purchase_date),

      "Harga Pembelian":
        asset.purchase_price ?? 0,

      "Supplier":
        asset.supplier ?? "-",

      "Nomor Invoice":
        asset.invoice_number ?? "-",

      "Garansi Sampai":
        formatDate(asset.warranty_until),

      "Status Garansi":
        formatWarrantyStatus(
          asset.warranty_until
        ),

    })
  );

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [

    { wch: 15 }, // Kode

    { wch: 30 }, // Nama

    { wch: 20 }, // Barcode

    { wch: 25 }, // PT

    { wch: 25 }, // Lokasi

    { wch: 20 }, // Kategori

    { wch: 25 }, // Model

    { wch: 20 }, // Brand

    { wch: 25 }, // Serial

    { wch: 20 }, // Kondisi

    { wch: 20 }, // Status

    { wch: 18 }, // Purchase date

    { wch: 18 }, // Price

    { wch: 25 }, // Supplier

    { wch: 25 }, // Invoice

    { wch: 18 }, // Warranty

    { wch: 25 }, // Warranty status

  ];

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Assets"
  );

  const date =
    new Date()
      .toISOString()
      .slice(0, 10);

  XLSX.writeFile(
    workbook,
    `asset-export-${date}.xlsx`
  );

}