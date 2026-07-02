import { createClient } from "@/lib/supabase/client";
import { calculateScore } from "./scoring-service";
const supabase = createClient();

export async function uploadScanner(
  peripheralId: number,
  scanner: any
) {

   const score =
    calculateScore(scanner);
  return supabase
    .from("peripherals")
    
    .update({

      scanner_version:
        scanner.scanner_version,

      last_scan_at:
        scanner.scan_time,

      last_scan_by:
        scanner.computer.username,

      hardware: {

        cpu: scanner.cpu,

        memory: scanner.memory,

        storage: scanner.storage,

        gpu: scanner.gpu,

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

  cpu: score.cpu,

  ram: score.ram,

  storage: score.storage,

  windows: score.windows,

  gpu: score.gpu,

},


    })
    .eq("id", peripheralId);

}