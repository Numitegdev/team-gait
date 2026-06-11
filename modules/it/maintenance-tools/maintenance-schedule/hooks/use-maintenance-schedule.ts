"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  updateSchedule,
}
from "../services/maintenance-schedule-service";

import { MaintenanceSchedule }
from "../types/maintenance-schedule";

export function useMaintenanceSchedule() {

  const [
    schedules,
    setSchedules,
  ] = useState<
    MaintenanceSchedule[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedDate,
    setSelectedDate,
  ] = useState("");

  async function loadSchedules() {

    try {

      setLoading(true);

      const data =
        await getSchedules();

      setSchedules(
        data ?? []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  async function addSchedule(
    payload: Omit<
      MaintenanceSchedule,
      "id"
    >
  ) {

    await createSchedule(
      payload
    );

    await loadSchedules();

  }

  async function editSchedule(
    id: number,
    payload: Partial<
      MaintenanceSchedule
    >
  ) {

    await updateSchedule(
      id,
      payload
    );

    await loadSchedules();

  }

  async function removeSchedule(
    id: number
  ) {

    const confirmDelete =
      window.confirm(
        "Hapus jadwal ini?"
      );

    if (!confirmDelete)
      return;

    await deleteSchedule(id);

    await loadSchedules();

  }

  useEffect(() => {

    loadSchedules();

  }, []);

  return {

    schedules,

    loading,

    selectedDate,
    setSelectedDate,

    loadSchedules,

    addSchedule,
    editSchedule,
    removeSchedule,

  };

}