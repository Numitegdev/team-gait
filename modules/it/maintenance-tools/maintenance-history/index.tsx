"use client";

import { useState } from "react";

import { exportExcel }
from "@/modules/it/network-tools/ip-management/utils/export-excel";

import { useMaintenanceHistory }
from "./hooks/use-maintenance-history";

import { MaintenanceHistoryFilter }
from "./components/maintenance-history-filter";

import { MaintenanceHistoryTable }
from "./components/maintenance-history-table";

import { MaintenanceHistoryDetailModal }
from "./components/maintenance-history-detail-modal";

import { MaintenanceHistory }
from "./types/maintenance-history";

export default function MaintenanceHistoryPage() {

  const {

  history,

  fullHistory,

  page,
  setPage,

  totalPages,
  loading,

  searchPC,
  setSearchPC,

  searchRoom,
  setSearchRoom,

  searchTechnician,
  setSearchTechnician,

  searchDate,
  setSearchDate,

  removeHistory,

} = useMaintenanceHistory();

  const [
    selectedItem,
    setSelectedItem,
  ] =
    useState<MaintenanceHistory | null>(
      null
    );

  return (

    <div className="space-y-6">

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Maintenance History
        </h1>

        <button
          onClick={() =>
           exportExcel(fullHistory)
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

      <MaintenanceHistoryFilter

            search={searchPC}
            setSearch={setSearchPC}

            room={searchRoom}
            setRoom={setSearchRoom}

            technician={searchTechnician}
            setTechnician={
                setSearchTechnician
            }

            date={searchDate}
            setDate={setSearchDate}

            />

      <MaintenanceHistoryTable

  data={history}

  page={page}
  setPage={setPage}
  totalPages={totalPages}

  onDelete={removeHistory}

  onView={setSelectedItem}

/>

      <MaintenanceHistoryDetailModal

        open={
          !!selectedItem
        }

        onClose={() =>
          setSelectedItem(null)
        }

        data={
          selectedItem
        }

      />

    </div>

  );

}