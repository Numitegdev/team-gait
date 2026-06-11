"use client";

import { useEffect, useState } from "react";

import {
  createDevice,
  deleteDevice,
  getDevices,
  updateDevice,
} from "../services/ip-management-service";

import { Device } from "../types/ip-management";

export function useIPManagement() {

  const [devices, setDevices] =
    useState<Device[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedRoom, setSelectedRoom] =
    useState("");

  const [
    selectedNetwork,
    setSelectedNetwork,
  ] = useState("");

  const [page, setPage] =
    useState(1);

  const pageSize = 15;

    useEffect(() => {

    setPage(1);

    }, [
    search,
    selectedRoom,
    selectedNetwork,
    ]);

  async function loadDevices() {

    try {

      setLoading(true);

      const data =
        await getDevices();

      setDevices(data ?? []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  async function addDevice(
    payload: Omit<Device, "id">
  ) {

    await createDevice(payload);

    await loadDevices();
  }

  async function editDevice(
    id: number,
    payload: Partial<Device>
  ) {

    await updateDevice(
      id,
      payload
    );

    await loadDevices();
  }

  async function removeDevice(
    id: number
  ) {

    const confirmDelete =
      window.confirm(
        "Hapus device ini?"
      );

    if (!confirmDelete) {
      return;
    }

    await deleteDevice(id);

    await loadDevices();
  }

  useEffect(() => {

    loadDevices();

  }, []);

  const filteredDevices =
    devices.filter((item) => {

      const deviceName =
        item.device ?? "";

      const ipAddress =
        item.ip_terkini ?? "";

       const diskripsi =
        item.keterangan ?? "";  

      const matchSearch =

        deviceName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        ipAddress
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        diskripsi
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );


      const matchRoom =

        !selectedRoom

        ||

        item.ruangan ===
        selectedRoom;

      const matchNetwork =

        !selectedNetwork

        ||

        item.jenis_network ===
        selectedNetwork;

      return (

        matchSearch

        &&

        matchRoom

        &&

        matchNetwork

      );

    });

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredDevices.length /
        pageSize
      )
    );

  const paginatedDevices =
    filteredDevices.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

  return {

  devices:
    paginatedDevices,

  fullDevices:
    filteredDevices,

  loading,

  page,
  setPage,
  totalPages,

  search,
  setSearch,

  selectedRoom,
  setSelectedRoom,

  selectedNetwork,
  setSelectedNetwork,

  loadDevices,

  addDevice,
  editDevice,
  removeDevice,
};
}