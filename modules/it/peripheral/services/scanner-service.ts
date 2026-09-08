import { createClient } from "@/lib/supabase/client";
import { calculateScore } from "./scoring-service";

const supabase = createClient();

function normalizeScanTime(value: unknown): string | null {

  if (!value || typeof value !== "string") {
    return null;
  }

  const date = value.trim();

  // Format:
  // 2026-09-08 09.22.17
  //
  // menjadi:
  // 2026-09-08 09:22:17
  const normalized = date.replace(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{2})\.(\d{2})\.(\d{2})$/,
    "$1 $2:$3:$4"
  );

  return normalized;
}

export async function uploadScanner(
  peripheralId: number,
  scanner: any
) {

  const score =
    calculateScore(scanner);

  const scanTime =
    normalizeScanTime(scanner.scan_time);

  console.log("SCAN TIME ASLI:", scanner.scan_time);
  console.log("SCAN TIME NORMALIZED:", scanTime);

  return supabase
    .from("peripherals")

    .update({

      scanner_version:
        scanner.scanner_version,

      last_scan_at:
        scanTime,

      last_scan_by:
        scanner.computer.username,

      hardware: {

        cpu:
          scanner.cpu,

        memory:
          scanner.memory,

        storage:
          scanner.storage,

        gpu:
          scanner.gpu,

        motherboard:
          scanner.motherboard,

        bios:
          scanner.bios,

        windows:
          scanner.windows,

        network:
          scanner.network,

      },

      software:
        scanner.software,

      server_services:
        scanner.server_services,

      score:
        score.total,

      status:
        score.status,

      score_detail: {

        cpu:
          score.cpu,

        ram:
          score.ram,

        storage:
          score.storage,

        windows:
          score.windows,

        gpu:
          score.gpu,

      },

    })
    .eq("id", peripheralId);

}
