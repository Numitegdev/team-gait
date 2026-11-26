"use client";

import { useEffect, useState } from "react";

import {
  getDevices,
  updateDevice,
} from "../services/ip-management-service";

import { Device } from "../types/ip-management";
import { Location } from "@/modules/assets/types/masters/Location";

import {
  getLocations,
} from "@/modules/assets/services/master-service";

export function useIPManagement() {

  const [devices, setDevices] =
    useState<Device[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

    const [rooms, setRooms] = useState<Location[]>([]);

  const [selectedRoom, setSelectedRoom] =
    useState("");

const [selectedISPUtama, setSelectedISPUtama] =
  useState("");

const [selectedISPBackup, setSelectedISPBackup] =
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
  selectedISPUtama,
  selectedISPBackup,
]);

async function loadLocations() {
  try {
    const data = await getLocations();
    setRooms(data ?? []);
  } catch (error) {
    console.error("Gagal mengambil lokasi:", error);
  }
}

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

  useEffect(() => {

    loadDevices();
 loadLocations();
  }, []);

  const filteredDevices =
  devices.filter((item) => {

    const deviceName =
      item.device ?? "";

    const ipAddress =
      item.ip_terkini ?? "";

    const diskripsi =
      item.keterangan ?? "";

    const ispUtama =
      item.isp_utama ?? "";

    const ispBackup =
      item.isp_backup ?? "";

    const keyword =
      search.toLowerCase();

    const matchSearch =

      deviceName
        .toLowerCase()
        .includes(keyword)

      ||

      ipAddress
        .toLowerCase()
        .includes(keyword)

      ||

      diskripsi
        .toLowerCase()
        .includes(keyword)

      ||

      ispUtama
        .toLowerCase()
        .includes(keyword)

      ||

      ispBackup
        .toLowerCase()
        .includes(keyword);

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

      const matchISPUtama =

  !selectedISPUtama

  ||

  item.isp_utama === selectedISPUtama;

const matchISPBackup =

  !selectedISPBackup

  ||

  item.isp_backup === selectedISPBackup;

    return (
matchSearch

  &&

  matchRoom

  &&

  matchNetwork

  &&

  matchISPUtama

  &&

  matchISPBackup


    );

  });
const ispUtamaOptions = [
  ...new Set(
    devices
      .map((item) => item.isp_utama)
      .filter(Boolean)
  ),
].sort();

const ispBackupOptions = [
  ...new Set(
    devices
      .map((item) => item.isp_backup)
      .filter(Boolean)
  ),
].sort();

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

 
  editDevice,


  selectedISPUtama,
setSelectedISPUtama,

selectedISPBackup,
setSelectedISPBackup,

ispUtamaOptions,
ispBackupOptions,

  rooms,
};
}