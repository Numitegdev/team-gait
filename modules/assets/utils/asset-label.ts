import { PDFDocument, rgb } from "pdf-lib";
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

  // Ukuran stiker: 50,8 mm x 21,6 mm
  const width = (50.8 / 25.4) * 72;
  const height = (21.6 / 25.4) * 72;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([width, height]);

  // Buat QR Code dari kode asset
  const qrDataUrl = await QRCode.toDataURL(
    asset.asset_code,
    {
      width: 300,
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

  // Ambil logo langsung dari Supabase Storage
  const logoResponse = await fetch(logoUrl);

  if (!logoResponse.ok) {
    throw new Error(
      `Logo gagal diambil dari Supabase Storage. URL: ${logoUrl}`
    );
  }

  const logoBytes = await logoResponse.arrayBuffer();
  const logoImage = await pdfDoc.embedPng(logoBytes);

  // QR Code di sebelah kiri
  page.drawImage(qrImage, {
    x: 3,
    y: 3,
    width: 55,
    height: 55,
  });

  // Logo PT di kanan atas
  page.drawImage(logoImage, {
    x: 63,
    y: 34,
    width: 70,
    height: 18,
  });

  // Kode asset di bawah logo
  page.drawText(asset.asset_code, {
    x: 63,
    y: 14,
    size: 9,
    color: rgb(0, 0, 0),
    maxWidth: 77,
  });

  const pdfBytes = await pdfDoc.save();

  const blob = new Blob(
    [new Uint8Array(pdfBytes)],
    { type: "application/pdf" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${asset.asset_code}_sticker.pdf`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  // Beri waktu browser memproses unduhan
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}