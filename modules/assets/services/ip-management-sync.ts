import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

/**
 * Sinkronisasi device
 * pada tabel ip_management.
 */
export async function syncIPManagementDevice({

  oldIPId,

  newIPId,

  device,

}: {

  oldIPId?:
    number | null;

  newIPId?:
    number | null;

  device:
    string;

}) {

  // Jika IP berubah,
  // kosongkan device
  // pada IP lama.

  if (

    oldIPId &&

    oldIPId !== newIPId

  ) {

    const {

      error,

    } = await supabase

      .from(
        "ip_management"
      )

      .update({

        device: null,

      })

      .eq(
        "id",
        oldIPId
      );

    if (error)
      throw error;

  }

  // Isi device
  // pada IP baru.

  if (newIPId) {

    const {

      error,

    } = await supabase

      .from(
        "ip_management"
      )

      .update({

        device,

      })

      .eq(
        "id",
        newIPId
      );

    if (error)
      throw error;

  }

}