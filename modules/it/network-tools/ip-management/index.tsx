"use client";

import { useState } from "react";

import { Device } from "./types/ip-management";

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


  editDevice,

   selectedISPUtama,
  setSelectedISPUtama,

  selectedISPBackup,
  setSelectedISPBackup,

  ispUtamaOptions,
  ispBackupOptions,
  rooms,

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
  if (!editingDevice) return;

  await editDevice(
    editingDevice.id,
    payload
  );

  setShowModal(false);
  setEditingDevice(null);
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

      </div>


    <IPManagementFilters
  search={search}
  setSearch={setSearch}
rooms={rooms}
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
rooms={rooms}
  page={page}
  setPage={setPage}
  totalPages={totalPages}

  onEdit={(device) => {
    setEditingDevice(device);
    setShowModal(true);
  }}

  
/>

<IPManagementModal
  open={showModal}
  onClose={() =>
    setShowModal(false)
  }
  editingDevice={editingDevice}
  usedIPs={usedIPs}
  existingDevices={fullDevices}
  onSave={handleSave}
  rooms={rooms}

  assetLocationName={
    editingDevice?.asset?.[0]?.location?.name ?? null
  }

  isAssetLinked={
    !!editingDevice?.asset?.[0]?.id
  }
/>
    </div>

  );
}