"use client";

import { useCallback, useEffect, useState } from "react";

import {
  assignAddon,
  createAddon,
  createPeripheral,
  deleteAddon,
  deletePeripheral,
  getAddons,
  getAvailableDevices,
  getPeripherals,
  removeAssignedAddon,
} from "../services/peripheral-service";

import {
  Addon,
  AvailableDevice,
  Peripheral,
} from "../types/peripheral.types";

export function usePeripheral() {
  const [loading, setLoading] = useState(true);

  const [peripherals, setPeripherals] = useState<Peripheral[]>([]);

  const [availableDevices, setAvailableDevices] = useState<
    AvailableDevice[]
  >([]);

  const [addons, setAddons] = useState<Addon[]>([]);

  // ===========================
  // LOAD DATA
  // ===========================

  const loadPeripherals = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getPeripherals();
      
console.log(data);
      setPeripherals(data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAvailableDevices = useCallback(async () => {
    const data = await getAvailableDevices();

    setAvailableDevices(data ?? []);
  }, []);

  const loadAddons = useCallback(async () => {
    const data = await getAddons();

    setAddons(data ?? []);
  }, []);

  // ===========================
  // PERIPHERAL
  // ===========================

  const addPeripheral = async (
    ipManagementId: number
  ) => {
    const { error } =
      await createPeripheral(ipManagementId);

    if (error) throw error;

    await Promise.all([
      loadPeripherals(),
      loadAvailableDevices(),
    ]);
  };

  const removePeripheral = async (
    id: number
  ) => {
    if (!window.confirm("Hapus PC ini?")) return;

    const { error } =
      await deletePeripheral(id);

    if (error) throw error;

    await Promise.all([
      loadPeripherals(),
      loadAvailableDevices(),
    ]);
  };

  // ===========================
  // MASTER ADDON
  // ===========================

  const addAddon = async (
    addonName: string
  ) => {
    const { error } =
      await createAddon({
        addon_name: addonName,
      });

    if (error) throw error;

    await loadAddons();
  };

  const removeAddon = async (
    id: number
  ) => {
    if (!window.confirm("Hapus addon ini?"))
      return;

    const { error } =
      await deleteAddon(id);

    if (error) throw error;

    await loadAddons();
  };

  // ===========================
  // ASSIGN ADDON
  // ===========================

  const addAddonToPeripheral = async (
    peripheralId: number,
    addonId: number
  ) => {
    const { error } =
      await assignAddon(
        peripheralId,
        addonId
      );

    if (error) throw error;

    await loadPeripherals();
  };

const removeAddonFromPeripheral =
async (
    id: number
) => {

    if (
        !window.confirm(
            "Hapus addon dari PC ini?"
        )
    )
        return;

    const { error } =
        await removeAssignedAddon(id);

    if (error)
        throw error;

    await loadPeripherals();

};
  // ===========================
  // INIT
  // ===========================

  useEffect(() => {
    Promise.all([
      loadPeripherals(),
      loadAvailableDevices(),
      loadAddons(),
    ]);
  }, [
    loadPeripherals,
    loadAvailableDevices,
    loadAddons,
  ]);

  return {
    loading,

    peripherals,

    availableDevices,

    addons,

    loadPeripherals,

    loadAvailableDevices,

    loadAddons,

    addPeripheral,

    removePeripheral,

    addAddon,

    removeAddon,

    addAddonToPeripheral,

    removeAddonFromPeripheral,
  };
}