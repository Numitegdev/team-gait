"use client";

import {
  useMonitoringChecklist,
}
from "./hooks/use-monitoring-checklist";

import {
  ChecklistDetailModal,
}
from "./components/checklist-detail-modal";

import {

  ChecklistTable,

}
from "./components/checklist-table";

export default function MonitoringChecklistPage() {
const {

  role,

  pendingCount,

  verifiedCount,

  todayCount,

  handleDetail,

  selectedChecklist,

  checklistDetails,

  openDetail,

  setOpenDetail,

  handleVerify,

  search,

  setSearch,

  statusFilter,

  setStatusFilter,

  startDate,

  setStartDate,

  endDate,

  setEndDate,

  driverFilter,

  setDriverFilter,

  vehicleFilter,

  setVehicleFilter,

  paginatedChecklistHeaders,

  currentPage,

  setCurrentPage,

  totalPages,

  filteredChecklistHeaders,

}
=
useMonitoringChecklist();
  return (

    <div
      className="
        p-4
        md:p-6
      "
    >

      <h1
        className="
          text-2xl
          font-bold
        "
      >

        Monitoring Checklist

      </h1>

      <div
        className="
          mt-6
          grid
          gap-4
          md:grid-cols-3
        "
      >

        <div
          className="
            rounded-xl
            border
            bg-yellow-50
            p-4
          "
        >

          <div
            className="
              text-sm
              text-slate-500
            "
          >

            Pending Verifikasi

          </div>

          <div
            className="
              text-3xl
              font-bold
            "
          >

            {pendingCount}

          </div>

        </div>

        <div
          className="
            rounded-xl
            border
            bg-green-50
            p-4
          "
        >

          <div
            className="
              text-sm
              text-slate-500
            "
          >

            Sudah Diverifikasi

          </div>

          <div
            className="
              text-3xl
              font-bold
            "
          >

            {verifiedCount}

          </div>

        </div>

        <div
          className="
            rounded-xl
            border
            bg-blue-50
            p-4
          "
        >

          <div
            className="
              text-sm
              text-slate-500
            "
          >

            Checklist Hari Ini

          </div>

          <div
            className="
              text-3xl
              font-bold
            "
          >

            {todayCount}

          </div>

        </div>

      </div>

      <div
  className="
    mt-6
    rounded-2xl
    border
    bg-white
    p-4
  "
>

  <div
    className="
      grid
      gap-3
      md:grid-cols-3
      lg:grid-cols-6
    "
  >

    <input

      value={search}

      onChange={(e) =>
        setSearch(
          e.target.value
        )
      }

      placeholder="
        Cari kendaraan / driver
      "

      className="
        rounded-xl
        border
        p-3
      "

    />

    <select

      value={statusFilter}

      onChange={(e) =>
        setStatusFilter(
          e.target.value
        )
      }

      className="
        rounded-xl
        border
        p-3
      "

    >

      <option value="all">
        Semua Status
      </option>

      <option value="pending">
        Pending
      </option>

      <option value="verified">
        Verified
      </option>

    </select>

    <input

      type="date"

      value={startDate}

      onChange={(e) =>
        setStartDate(
          e.target.value
        )
      }

      className="
        rounded-xl
        border
        p-3
      "

    />

    <input

      type="date"

      value={endDate}

      onChange={(e) =>
        setEndDate(
          e.target.value
        )
      }

      className="
        rounded-xl
        border
        p-3
      "

    />

    <input

      value={driverFilter}

      onChange={(e) =>
        setDriverFilter(
          e.target.value
        )
      }

      placeholder="
        Nama Driver
      "

      className="
        rounded-xl
        border
        p-3
      "

    />

    <input

      value={vehicleFilter}

      onChange={(e) =>
        setVehicleFilter(
          e.target.value
        )
      }

      placeholder="
        Plat Nomor
      "

      className="
        rounded-xl
        border
        p-3
      "

    />

  </div>

</div>

 

      <div
          className="
            mt-6
          "
        >
          <div
  className="
    mt-4
    text-sm
    text-slate-500
  "
>

  Menampilkan

  {" "}

  {filteredChecklistHeaders.length}

  {" "}

  checklist

</div>

          <ChecklistTable

           data={
              paginatedChecklistHeaders
            }

            onDetail={
              handleDetail
            }

          />

        </div>

        <div
  className="
    mt-6
    flex
    items-center
    justify-center
    gap-2
  "
>

  <button

    disabled={
      currentPage === 1
    }

    onClick={() =>

      setCurrentPage(
        currentPage - 1
      )

    }

    className="
      rounded-lg
      border
      px-4
      py-2
      disabled:opacity-50
    "

  >

    Prev

  </button>

  <span
    className="
      px-4
      font-medium
    "
  >

    {currentPage}

    {" / "}

    {totalPages}

  </span>

  <button

    disabled={
      currentPage ===
      totalPages
    }

    onClick={() =>

      setCurrentPage(
        currentPage + 1
      )

    }

    className="
      rounded-lg
      border
      px-4
      py-2
      disabled:opacity-50
    "

  >

    Next

  </button>

</div>

        <ChecklistDetailModal

                open={
                    openDetail
                }

                checklist={
                    selectedChecklist
                }

                details={
                    checklistDetails
                }

                onClose={() =>

                    setOpenDetail(
                    false
                    )

                }

                role={role}

                onVerify={
                  handleVerify
                }

        />

    </div>

    

  );

}