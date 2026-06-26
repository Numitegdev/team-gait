"use client";

import { useState } from "react";
import {
  RoomUtilization,
}
from "./components/room-utilization";
import { Device } from "./types/ip-management";

import { IPManagementSummary }
from "./components/ip-management-summary";
import { useIPManagement }
from "./hooks/use-ip-management";

import { PageHeader }
from "./components/page-header";

import { IPManagementFilters }
from "./components/ip-management-filters";

import { IPManagementTable }
from "./components/ip-management-table";

import { IPManagementModal }
from "./components/ip-management-modal";

import { exportExcel }
from "./utils/export-excel";

import { importExcel }
from "./utils/import-excel";

import {
  bulkInsertDevices,
} from "./services/ip-management-service";

export default function IPManagementPage() {

  const {
  devices,
  fullDevices,

  page,
  setPage,
  totalPages,

  search,
  setSearch,

  selectedRoom,
  setSelectedRoom,

  selectedNetwork,
  setSelectedNetwork,

  addDevice,
  editDevice,
  removeDevice,
  loadDevices,

   selectedISPUtama,
  setSelectedISPUtama,

  selectedISPBackup,
  setSelectedISPBackup,

  ispUtamaOptions,
  ispBackupOptions,


} = useIPManagement();

  const [showModal, setShowModal] =
    useState(false);

  const [editingDevice, setEditingDevice] =
    useState<Device | null>(null);

  const usedIPs =
  fullDevices.map(
    (item) => item.ip_terkini
  );


  const [showAnalytics, setShowAnalytics] =
    useState(false);

  async function handleSave(
    payload: any
  ) {

    if (editingDevice) {

      await editDevice(
        editingDevice.id,
        payload
      );

    } else {

      await addDevice(payload);

    }

    setShowModal(false);

    setEditingDevice(null);
  }

  async function handleImport(
    file: File
  ) {

    try {

      const rows =
        await importExcel(file);

      await bulkInsertDevices(
        rows
      );

      await loadDevices();

      alert(
        "Import berhasil"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Import gagal"
      );

    }
  }

  return (

   <div
  className="
    space-y-6
  "
>

      <PageHeader />

      <div className="flex flex-wrap gap-3">

        <button
          onClick={() => {

            setEditingDevice(null);

            setShowModal(true);

          }}
          className="
            rounded-xl
            bg-blue-600
            px-4
            py-2
            text-white
          "
        >
          Add Device
        </button>

        <button
          onClick={() =>
            exportExcel(fullDevices)
          }
          className="
            rounded-xl
            bg-green-600
            px-4
            py-2
            text-white
          "
        >
          Export Excel
        </button>

        <label
          className="
            cursor-pointer
            rounded-xl
            bg-indigo-600
            px-4
            py-2
            text-white
          "
        >

          Import Excel

          <input
            type="file"
            accept=".xlsx,.xls"
            hidden
            onChange={(e) => {

              const file =
                e.target.files?.[0];

              if (!file) return;

              handleImport(file);

            }}
          />

        </label>

      </div>


      {/* <button
        onClick={() =>
            setShowAnalytics(
            !showAnalytics
            )
        }
        className="
            rounded-xl
            border
            px-4
            py-2
        "
        >
        {showAnalytics
            ? "Hide Analytics"
            : "Show Analytics"}
        </button>

        {showAnalytics && (

        <>
            <IPManagementSummary
            devices={devices}
            />

            <RoomUtilization
            devices={devices}
            />
        </>

        )} */}
        
    <IPManagementFilters
  search={search}
  setSearch={setSearch}

  selectedRoom={selectedRoom}
  setSelectedRoom={setSelectedRoom}

  selectedNetwork={selectedNetwork}
  setSelectedNetwork={setSelectedNetwork}

  selectedISPUtama={selectedISPUtama}
  setSelectedISPUtama={setSelectedISPUtama}

  selectedISPBackup={selectedISPBackup}
  setSelectedISPBackup={setSelectedISPBackup}

  ispUtamaOptions={ispUtamaOptions}
  ispBackupOptions={ispBackupOptions}
/>

      <IPManagementTable
  devices={devices}

  page={page}
  setPage={setPage}
  totalPages={totalPages}

  onEdit={(device) => {
    setEditingDevice(device);
    setShowModal(true);
  }}

  onDelete={removeDevice}
/>

      <IPManagementModal
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
        editingDevice={
          editingDevice
        }
        usedIPs={usedIPs}
        existingDevices={
          devices
        }
        onSave={handleSave}
      />

    </div>

  );
}