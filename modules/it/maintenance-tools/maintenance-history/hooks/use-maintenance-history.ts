"use client";

import {
  getHistory,
  deleteHistory,
}
from "../services/maintenance-history-service";

import {
  MaintenanceHistory,
}
from "../types/maintenance-history";

import {
  useEffect,
  useState,
}
from "react";

export function useMaintenanceHistory() {

  const [history, setHistory] =
    useState<
      MaintenanceHistory[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const [searchPC, setSearchPC] =
    useState("");

  const [searchRoom, setSearchRoom] =
    useState("");

  const [searchTechnician,
    setSearchTechnician] =
    useState("");

  const [searchDate,
    setSearchDate] =
    useState("");


    
  async function loadHistory() {

    setLoading(true);

    const data =
      await getHistory();

    setHistory(data || []);

    setLoading(false);

  }

  async function removeHistory(
    id: number
  ) {

    const confirmDelete =
      window.confirm(
        "Hapus data maintenance?"
      );

    if (!confirmDelete)
      return;

    await deleteHistory(id);

    await loadHistory();

  }

  useEffect(() => {

    loadHistory();

  }, []);


useEffect(() => {

  setPage(1);

}, [
  searchPC,
  searchRoom,
  searchTechnician,
  searchDate,
]);

  const filteredHistory =
    history.filter((item) => {

      const matchPC =
        !searchPC ||
        item.kode_pc
          .toLowerCase()
          .includes(
            searchPC.toLowerCase()
          );
     
          
    const matchRoom =

        !searchRoom

        ||

        (item.ruangan ?? "")
            .toLowerCase()
            .includes(
            searchRoom.toLowerCase()
            );

      const matchTechnician =
        !searchTechnician ||
        item.teknisi
          .toLowerCase()
          .includes(
            searchTechnician.toLowerCase()
          );

      const matchDate =
        !searchDate ||
        item.tanggal ===
        searchDate;

      return (
        matchPC &&
        matchRoom &&
        matchTechnician &&
        matchDate
      );

    });

const [page, setPage] =
  useState(1);

const pageSize = 15;

 const totalPages =
                Math.max(
                    1,
                    Math.ceil(
                    filteredHistory.length /
                    pageSize
                    )
                );

                const paginatedHistory =
                filteredHistory.slice(
                    (page - 1) * pageSize,
                    page * pageSize
                );

 return {

  loading,

  history:
    paginatedHistory,

  fullHistory:
    filteredHistory,

  page,
  setPage,

  totalPages,

  searchPC,
  setSearchPC,

  searchRoom,
  setSearchRoom,

  searchTechnician,
  setSearchTechnician,

  searchDate,
  setSearchDate,

  removeHistory,

};
}