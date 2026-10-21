import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

import { calculateScore } from "@/modules/it/peripheral/services/scoring-service";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function recalculatePeripheralScores() {
  console.log("=== RECALCULATE PERIPHERAL SCORES ===");
  console.log("Mengambil data dari Supabase...\n");

  const { data: peripherals, error } = await supabase
    .from("peripherals")
    .select("id, hardware, score, status, score_detail")
    .order("id", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data:", error.message);
    process.exitCode = 1;
    return;
  }

  if (!peripherals || peripherals.length === 0) {
    console.log("Tidak ada data peripheral.");
    return;
  }

  console.log(`Total data ditemukan: ${peripherals.length}\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of peripherals) {
    // Aset yang belum memiliki data hardware tidak diubah.
    if (row.hardware == null) {
      console.log(`[SKIP] ID ${row.id}: hardware masih null`);
      skipped++;
      continue;
    }

    try {
      // Hitung ulang berdasarkan hardware yang sudah tersimpan.
      const result = calculateScore(row.hardware);

      const newScore = result.total;
      const newStatus = result.status;

      const newScoreDetail = {
        cpu: result.cpu,
        ram: result.ram,
        storage: result.storage,
        windows: result.windows,
        gpu: result.gpu,
      };

      // Update hanya tiga kolom skor.
      const { error: updateError } = await supabase
        .from("peripherals")
        .update({
          score: newScore,
          status: newStatus,
          score_detail: newScoreDetail,
        })
        .eq("id", row.id);

      if (updateError) {
        console.error(
          `[GAGAL] ID ${row.id}: ${updateError.message}`
        );
        failed++;
        continue;
      }

      console.log(
        `[UPDATED] ID ${row.id} | ` +
        `Score: ${row.score ?? "-"} -> ${newScore} | ` +
        `Status: ${row.status ?? "-"} -> ${newStatus}`
      );

      updated++;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : String(err);

      console.error(`[GAGAL] ID ${row.id}: ${message}`);
      failed++;
    }
  }

  console.log("\n=== HASIL RECALCULATE ===");
  console.log(`Total data       : ${peripherals.length}`);
  console.log(`Berhasil update  : ${updated}`);
  console.log(`Dilewati         : ${skipped}`);
  console.log(`Gagal            : ${failed}`);
  console.log("Selesai.");
}

recalculatePeripheralScores().catch((err) => {
  console.error("Terjadi error:", err);
  process.exitCode = 1;
});