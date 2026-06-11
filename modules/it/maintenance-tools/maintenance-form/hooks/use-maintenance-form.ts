"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createMaintenance,
  getProfile,
}
from "../services/maintenance-form-service";

import { MaintenanceForm }
from "../types/maintenance-form";

export function useMaintenanceForm() {

  const [loading, setLoading] =
    useState(false);

  const [technician, setTechnician] =
    useState("");

  const [form, setForm] =
    useState<MaintenanceForm>({

      tanggal:
        new Date()
          .toISOString()
          .split("T")[0],

      kode_pc: "",

      ruangan: "",

      teknisi: "",

      keluhan: "",

      keyboard_mouse:
        "aman",

      motherboard:
        "aman",

      ram:
        "aman",

      hardisk:
        "aman",

      power_supply:
        "aman",

      cleaner:
        "Ya",

      baut:
        "Lengkap",

      keterangan: "",

    });

  async function loadProfile() {

    try {

      const profile =
        await getProfile();

      if (!profile)
        return;

      setTechnician(
        profile.full_name
      );

      setForm((prev) => ({

        ...prev,

        teknisi:
          profile.full_name,

      }));

    } catch (error) {

      console.error(error);

    }

  }

  useEffect(() => {

    loadProfile();

  }, []);

  async function saveMaintenance() {

    try {

      setLoading(true);

      await createMaintenance(
        form
      );

      alert(
        "Maintenance berhasil disimpan"
      );

      setForm({

        tanggal:
          new Date()
            .toISOString()
            .split("T")[0],

        kode_pc: "",

        ruangan: "",

        teknisi:
          technician,

        keluhan: "",

        keyboard_mouse:
          "aman",

        motherboard:
          "aman",

        ram:
          "aman",

        hardisk:
          "aman",

        power_supply:
          "aman",

        cleaner:
          "Ya",

        baut:
          "Lengkap",

        keterangan: "",

      });

    } catch (error) {

      console.error(error);

      alert(
        "Gagal menyimpan maintenance"
      );

    } finally {

      setLoading(false);

    }

  }

  return {

    form,
    setForm,

    loading,

    technician,

    saveMaintenance,

  };

}