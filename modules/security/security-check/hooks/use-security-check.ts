"use client";

import {
  useEffect,
  useState,
} from "react";

import {

  getLocations,

  createCheck,

  createCheckDetail,

  uploadPhoto,

}
from "../services/security-check-service";

import {
  SecurityLocation,
} from "../types/security-check";
import { createClient }
from "@/lib/supabase/client";
export function useSecurityCheck() {

const [

  petugas,

  setPetugas,

] = useState("");

  const [
    locations,
    setLocations,
  ] = useState<
    SecurityLocation[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  useEffect(() => {

    loadLocations();
  loadUser();
  }, []);

  async function loadLocations() {

    try {

      const data =
        await getLocations();

      setLocations(
        data || []
      );

    } catch (error) {

 
    }

  }

async function loadUser() {

  const supabase =
    createClient();

  const {

    data: { user },

  } = await supabase.auth.getUser();

  if (!user)
    return;

  const {

    data: profile,

  } = await supabase

    .from("profiles")

    .select("full_name")

    .eq(
      "id",
      user.id
    )

    .single();

  setPetugas(

    profile?.full_name ||

    user.email ||

    "Unknown User"

  );

}

  async function saveCheck({

    shift,

    petugas,

    catatan,

    details,

  }: any) {

    try {

      setLoading(true);

      const header =
        await createCheck({

          tanggal:
            new Date(),

          shift,

          petugas,

          catatan,

        });

      const detailPayload =
        [];

      for (
        const item
        of details
      ) {

        let photoUrl =
          "";

        if (
          item.file
        ) {

          photoUrl =
            await uploadPhoto(
              item.file
            );

        }

        detailPayload.push({

          check_id:
            header.id,

          lokasi_id:
            item.lokasi_id,

          foto_url:
            photoUrl,

          status:
            item.status,

          catatan:
            item.catatan,

        });

      }

      await createCheckDetail(
        detailPayload
      );

      return true;

    } finally {

      setLoading(
        false
      );

    }

  }

return {

  locations,

  loading,

  saveCheck,

  petugas,

};

}