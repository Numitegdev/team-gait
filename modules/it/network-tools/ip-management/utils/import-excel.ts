import * as XLSX from "xlsx";

export async function importExcel(
  file: File
) {

  const buffer =
    await file.arrayBuffer();

  const workbook =
    XLSX.read(buffer);

  const worksheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  return XLSX.utils.sheet_to_json(
    worksheet
  );
}