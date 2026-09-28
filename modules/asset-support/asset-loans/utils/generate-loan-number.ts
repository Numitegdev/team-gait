import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();


export async function generateLoanNumber(): Promise<string> {

  // ==========================================
  // Tahun sekarang
  // ==========================================

  const year =
    new Date()
      .getFullYear()
      .toString()
      .slice(-2);


  // ==========================================
  // Prefix pencarian
  // ==========================================

  const prefix =
    `LOAN-${year}-`;


  // ==========================================
  // Ambil nomor loan tahun ini
  // ==========================================

  const {

    data,

    error,

  } = await supabase

    .from("asset_loans")

    .select("loan_no")

    .like(
      "loan_no",
      `${prefix}%`
    );


  if (error)
    throw error;


  // ==========================================
  // Cari nomor terbesar
  // ==========================================

  let lastNumber = 0;


  data?.forEach((loan) => {

    if (!loan.loan_no)
      return;


    const parts =
      loan.loan_no.split("-");


    const current =
      Number(parts[2]);


    if (
      Number.isFinite(current) &&
      current > lastNumber
    ) {

      lastNumber =
        current;

    }

  });


  // ==========================================
  // Nomor berikutnya
  // ==========================================

  const nextNumber =
    String(
      lastNumber + 1
    )
      .padStart(3, "0");


  // ==========================================
  // Hasil akhir
  // ==========================================

  return (
    `${prefix}${nextNumber}`
  );

}