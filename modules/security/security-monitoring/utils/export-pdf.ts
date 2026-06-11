import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  imageUrlToBase64,
}
from "./image-to-base64";
import { createClient }
from "@/lib/supabase/client";
export async function exportSecurityPdf(
  data: any
)
  {

function getPhotoUrl(
  fileName: string
) {

  const { data } =
    supabase.storage

      .from(
        "security_photos"
      )

      .getPublicUrl(
        fileName
      );

  return data.publicUrl;

}

    const supabase =
  createClient();

  const doc =
    new jsPDF();

  doc.setFontSize(16);

  doc.text(
    "Security Monitoring Report",
    14,
    15
  );

  doc.setFontSize(10);

  doc.text(
    `Petugas : ${data.petugas}`,
    14,
    25
  );

  doc.text(
    `Shift : ${data.shift}`,
    14,
    32
  );

  doc.text(
    `Tanggal : ${data.tanggal}`,
    14,
    39
  );

  autoTable(doc, {
    startY: 50,

    head: [[
      "Lokasi",
      "Status",
      "Catatan"
    ]],

    body:
      data.details.map(
        (item: any) => [

          item.nama_lokasi,

          item.status,

          item.catatan,

        ]
      ),
  });

  let currentY =
  (
    doc as any
  ).lastAutoTable
    .finalY + 10;

for (
  const item
  of data.details
) {

  doc.setFontSize(12);

  doc.text(
    item.nama_lokasi,
    14,
    currentY
  );

  currentY += 8;

  doc.text(
    `Status : ${item.status}`,
    14,
    currentY
  );

  currentY += 8;

  doc.text(
    `Catatan : ${
      item.catatan || "-"
    }`,
    14,
    currentY
  );

  currentY += 8;

  if (
  item.foto_url
) {

  try {

    console.log(
      "FOTO URL:",
      item.foto_url
    );

    const imageBase64 =
      await imageUrlToBase64(
        item.foto_url
      );

    doc.addImage(
      imageBase64,
      "JPEG",
      14,
      currentY,
      60,
      45
    );

      doc.addImage(
        imageBase64,
        "JPEG",
        14,
        currentY,
        60,
        45
      );

      currentY += 55;

    } catch (
      err
    ) {

      console.error(
        err
      );

    }

  }

  currentY += 10;

  const pageHeight =
  doc.internal.pageSize.height;

if (
  currentY >
  pageHeight - 70
) {

  doc.addPage();

  currentY = 20;

}

}

  doc.save(
    `security-check-${data.id}.pdf`
  );

}

