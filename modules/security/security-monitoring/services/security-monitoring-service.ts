import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

export async function getChecks() {

  const { data, error } =
    await supabase

      .from(
        "security_checks"
      )

      .select("*")

      .order(
        "tanggal",
        {
          ascending: false,
        }
      );

  if (error)
    throw error;

  return data;

}

export async function getCheckDetail(
  id: number
) {

  const { data, error } =
    await supabase

      .from(
        "security_checks"
      )

      .select(`
        *,
        security_check_details (
          *,
          security_locations (
            nama_lokasi
          )
        )
      `)

      .eq(
        "id",
        id
      )

      .single();

  if (error)
    throw error;

  return {

    ...data,

    details:
      data.security_check_details?.map(
        (item: any) => ({

          ...item,

          nama_lokasi:
            item
              .security_locations
              ?.nama_lokasi ||

            "-",

        })
      ) || [],

  };

}

export async function deleteCheck(
  id: number
) {

  const { error } =
    await supabase

      .from(
        "security_checks"
      )

      .delete()

      .eq(
        "id",
        id
      );

  if (error)
    throw error;

}