"use client";

import { createClient }
from "@/lib/supabase/client";

import {
  useEffect,
  useState,
   useMemo,
} from "react";

import {
  MonitoringTable,
} from "./components/monitoring-table";

import {
  DetailModal,
} from "./components/detail-modal";

import {
  useSecurityMonitoring,
} from "./hooks/use-security-monitoring";


export default function SecurityMonitoringPage() {

  const {

  checks,

  loading,

  openModal,

  selectedData,

  handleView,

  handleDelete,

  handleExportPdf,

  closeModal,

}
=
useSecurityMonitoring();



  const [role, setRole] =
  useState("");

  useEffect(() => {
  loadRole();
}, []);


const [search, setSearch] =
  useState("");

const [shiftFilter, setShiftFilter] =
  useState("");

const [dateFilter, setDateFilter] =
  useState("");

async function loadRole() {

  const supabase =
    createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user)
    return;

  const {
    data: profile,
  } =
    await supabase

      .from("profiles")

      .select("role")

      .eq(
        "id",
        user.id
      )

      .single();

  setRole(
    profile?.role || ""
  );

}


const filteredChecks =
  useMemo(() => {

    return checks.filter(
      (item) => {

        const matchSearch =

          item.petugas
            ?.toLowerCase()

            .includes(
              search.toLowerCase()
            )

          ||

          item.catatan
            ?.toLowerCase()

            .includes(
              search.toLowerCase()
            );

        const matchShift =

          !shiftFilter ||

          item.shift ===
            shiftFilter;

        const matchDate =

          !dateFilter ||

          item.tanggal
            ?.slice(0, 10) ===
            dateFilter;

        return (

          matchSearch &&

          matchShift &&

          matchDate

        );

      }
    );

  }, [

    checks,

    search,

    shiftFilter,

    dateFilter,

  ]);

  useEffect(() => {

  setPage(1);

}, [

  search,

  shiftFilter,

  dateFilter,

]);

  const [page, setPage] =
  useState(1);

const ITEMS_PER_PAGE = 10;

const totalPages =
  Math.ceil(
    filteredChecks.length /
    ITEMS_PER_PAGE
  );

const paginatedChecks =
  filteredChecks.slice(
    (page - 1) *
      ITEMS_PER_PAGE,

    page *
      ITEMS_PER_PAGE
  );



  return (

    <div
      className="
        space-y-6
      "
    >

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >

          Security Monitoring

        </h1>

        <p
          className="
            text-slate-500
          "
        >

          Riwayat hasil pengecekan security

        </p>

      </div>

      {loading && (

        <div
          className="
            rounded-xl
            border
            bg-white
            p-4
          "
        >

          Loading...

        </div>

      )}

<div
  className="
    flex
    flex-wrap
    gap-3
    rounded-xl
    border
    bg-white
    p-4
  "
>

  <input

    type="text"

    placeholder="
      Cari petugas / catatan
    "

    value={search}

    onChange={(e) =>
      setSearch(
        e.target.value
      )
    }

    className="
      rounded-lg
      border
      px-3
      py-2
    "
  />

  <select

    value={shiftFilter}

    onChange={(e) =>
      setShiftFilter(
        e.target.value
      )
    }

    className="
      rounded-lg
      border
      px-3
      py-2
    "
  >

    <option value="">
      Semua Shift
    </option>

    <option value="Pagi">
      Pagi
    </option>

    <option value="Siang">
      Siang
    </option>

    <option value="Malam">
      Malam
    </option>

  </select>

  <input

    type="date"

    value={dateFilter}

    onChange={(e) =>
      setDateFilter(
        e.target.value
      )
    }

    className="
      rounded-lg
      border
      px-3
      py-2
    "
  />

</div>

  <MonitoringTable

  data={paginatedChecks}
  role={role}
  onView={handleView}
  onDelete={handleDelete}
  onExportPdf={handleExportPdf}

/>

<div
  className="
    flex
    items-center
    justify-center
    gap-2
  "
>

  <button

    disabled={
      page === 1
    }

    onClick={() =>
      setPage(
        page - 1
      )
    }

    className="
      rounded-lg
      border
      px-3
      py-2
      disabled:opacity-50
    "
  >

    Prev

  </button>

  <span>

    Page {page}
    {" / "}
    {totalPages || 1}

  </span>

  <button

    disabled={
      page === totalPages ||
      totalPages === 0
    }

    onClick={() =>
      setPage(
        page + 1
      )
    }

    className="
      rounded-lg
      border
      px-3
      py-2
      disabled:opacity-50
    "
  >

    Next

  </button>

</div>

      <DetailModal

        open={
          openModal
        }

        onClose={
          closeModal
        }

        data={
          selectedData
        }

      />

    </div>

  );

}