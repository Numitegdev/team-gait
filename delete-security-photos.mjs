
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = "security_photos";
const CUTOFF = new Date("2026-11-01T00:00:00Z");

async function main() {
  let offset = 0;
  const limit = 100;
  let targets = [];

  while (true) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", {
        limit,
        offset,
        sortBy: {
          column: "created_at",
          order: "asc",
        },
      });

    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const file of data) {
      if (
        file.id &&
        file.created_at &&
        new Date(file.created_at) < CUTOFF
      ) {
        targets.push({
          name: file.name,
          created_at: file.created_at,
        });
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  console.log("BUCKET:", BUCKET);
  console.log("TOTAL FOTO TARGET:", targets.length);
  console.table(targets);

  console.log("MODE: PEMERIKSAAN SAJA");
  console.log("BELUM ADA FOTO YANG DIHAPUS.");
}

main().catch(console.error);
