import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { parseCPU } from "@/modules/it/peripheral/services/cpu-parser";
import { calculateScore } from "@/modules/it/peripheral/services/scoring-service";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testCPU98() {
  // 1. Ambil data peripheral ID 156
  const { data, error } = await supabase
    .from("peripherals")
    .select("id, hardware, score, status, score_detail")
    .eq("id", 156)
    .single();

  if (error || !data) {
    console.error("Gagal mengambil ID 156:", error?.message);
    return;
  }

  console.log("=== DATA HARDWARE ID 156 ===");
  console.dir(data.hardware, { depth: null });

  // 2. Tes parser CPU Intel N305
  console.log("\n=== TES PARSER N305 ===");
  const parsed = parseCPU("Intel(R) Core(TM) i3-N305");
  console.dir(parsed, { depth: null });

  // 3. Tampilkan skor lama
  console.log("\n=== SKOR LAMA ===");
  console.dir(
    {
      score: data.score,
      status: data.status,
      score_detail: data.score_detail,
    },
    { depth: null }
  );

  // 4. Hitung skor baru
  console.log("\n=== MENGHITUNG SKOR BARU ===");

  let result: ReturnType<typeof calculateScore>;

  try {
    result = calculateScore(data.hardware);
    console.dir(result, { depth: null });
  } catch (err) {
    console.error("Gagal menghitung skor:", err);
    return;
  }

  // 5. Simpan skor baru ke Supabase
  console.log("\n=== UPDATE SKOR ID 156 ===");

  const { data: updatedData, error: updateError } = await supabase
    .from("peripherals")
    .update({
      score: result.total,
      status: result.status,
      score_detail: {
        cpu: result.cpu,
        ram: result.ram,
        storage: result.storage,
        windows: result.windows,
        gpu: result.gpu,
      },
    })
    .eq("id", 156)
    .select("id, score, status, score_detail")
    .single();

  if (updateError) {
    console.error("Gagal update skor:", updateError.message);
    return;
  }

  console.log("Berhasil memperbarui skor ID 156:");
  console.dir(updatedData, { depth: null });
}

testCPU98().catch(console.error);