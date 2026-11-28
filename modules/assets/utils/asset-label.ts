
import {
  PDFDocument,
  rgb,
  StandardFonts,
} from "pdf-lib";

import QRCode from "qrcode";
import { AssetListItem } from "../types/AssetListItem";

const SUPABASE_STORAGE_URL =
  "https://jelwnzgysnqksocjnjmo.supabase.co/storage/v1/object/public/invoice-asset";

function getCompanyLogo(companyName: string): string {
  const name = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  if (name.includes("numiteg")) {
    return `${SUPABASE_STORAGE_URL}/barcode_numiteg.png`;
  }

  if (name.includes("bekami")) {
    return `${SUPABASE_STORAGE_URL}/barcode_bekami.png`;
  }

  if (name.includes("briza")) {
    return `${SUPABASE_STORAGE_URL}/barcode_briza.png`;
  }

  if (name.includes("aswa")) {
    return `${SUPABASE_STORAGE_URL}/barcode_aswa.png`;
  }

  if (name.includes("blueheron")) {
    return `${SUPABASE_STORAGE_URL}/barcode_blueheron.png`;
  }

  throw new Error(
    `Logo untuk perusahaan "${companyName}" belum dikonfigurasi.`
  );
}

export async function printAssetLabel(
  asset: AssetListItem
): Promise<void> {

  if (!asset.asset_code) {
    throw new Error("Kode asset tidak tersedia.");
  }

  const companyName = asset.company?.name;

  if (!companyName) {
    throw new Error("PT pemilik asset tidak ditemukan.");
  }

  const logoUrl = getCompanyLogo(companyName);

  // ==========================================
  // UKURAN STIKER
  // ==========================================

  const width = (50.8 / 25.4) * 72;
  const height = (21.6 / 25.4) * 72;

  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([
    width,
    height,
  ]);

  const font = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  );

  // ==========================================
  // QR CODE
  // ==========================================

  const qrDataUrl = await QRCode.toDataURL(
    asset.asset_code,
    {
      width: 400,
      margin: 1,
      errorCorrectionLevel: "M",
    }
  );

  const qrBase64 = qrDataUrl.split(",")[1];

  if (!qrBase64) {
    throw new Error("Gagal membuat QR Code.");
  }

  const qrBytes = Uint8Array.from(
    atob(qrBase64),
    (character) => character.charCodeAt(0)
  );

  const qrImage = await pdfDoc.embedPng(qrBytes);

  // ==========================================
  // LOGO PERUSAHAAN
  // ==========================================

  const logoResponse = await fetch(logoUrl);

  if (!logoResponse.ok) {
    throw new Error(
      `Logo gagal diambil dari Supabase Storage. URL: ${logoUrl}`
    );
  }

  const logoBytes = await logoResponse.arrayBuffer();

  const logoImage = await pdfDoc.embedPng(logoBytes);

  // ==========================================
  // LAYOUT QR
  // ==========================================

  const marginLeft = 4;

  const qrSize = 52;

  const qrY = (height - qrSize) / 2;

  page.drawImage(qrImage, {
    x: marginLeft,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // ==========================================
  // LAYOUT BAGIAN KANAN
  // ==========================================

  const contentX = 63;

  const contentWidth = width - contentX - 6;

  const logoMaxHeight = 15;
  const logoMaxWidth = contentWidth;

  // Pertahankan rasio asli logo.
  const logoScale = Math.min(
    logoMaxWidth / logoImage.width,
    logoMaxHeight / logoImage.height
  );

  const logoWidth = logoImage.width * logoScale;
  const logoHeight = logoImage.height * logoScale;

  const fontMaxSize = 13;
  const fontMinSize = 10.5;

  // Sesuaikan ukuran font dengan panjang kode.
  const measuredWidth = font.widthOfTextAtSize(
    asset.asset_code,
    fontMaxSize
  );

  const fontSize = Math.max(
    fontMinSize,
    Math.min(
      fontMaxSize,
      fontMaxSize * (contentWidth / measuredWidth)
    )
  );

  // Tinggi visual blok kode.
  const textBlockHeight = fontSize + 3;

  const gap = 4;

  // ==========================================
  // POSISI VERTIKAL TERPUSAT
  // ==========================================

  const totalContentHeight =
    logoHeight + gap + textBlockHeight;

  const contentBottom =
    (height - totalContentHeight) / 2;

  // Logo berada di atas kode.
  const logoY =
    contentBottom + textBlockHeight + gap;

  const logoX =
    contentX + (contentWidth - logoWidth) / 2;

  page.drawImage(logoImage, {
    x: logoX,
    y: logoY,
    width: logoWidth,
    height: logoHeight,
  });

  // ==========================================
  // ASSET CODE
  // ==========================================

  page.drawText(asset.asset_code, {
    x: contentX,
    y: contentBottom + 1,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
    maxWidth: contentWidth,
  });

  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob(
    [new Uint8Array(pdfBytes)],
    {
      type: "application/pdf",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download =
    `${asset.asset_code}_sticker.pdf`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
