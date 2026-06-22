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

  checklistHeaders,

  pendingCount,

  verifiedCount,

  todayCount,

  handleDetail,

  selectedChecklist,

    checklistDetails,

    openDetail,

    setOpenDetail,

    handleVerify,

    statusFilter,

    setStatusFilter,

    filteredChecklistHeaders,

    search,

setSearch,

paginatedChecklistHeaders,

currentPage,

setCurrentPage,

totalPages,

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
    flex
    flex-col
    gap-3
    md:flex-row
    md:justify-between
  "
>

  <input

    type="text"

    value={
      search
    }

    onChange={(e) =>

      setSearch(
        e.target.value
      )

    }

    placeholder="
      Cari plat, kendaraan, driver...
    "

    className="
      rounded-lg
      border
      px-3
      py-2
      md:w-80
    "

  />

  <select

    value={
      statusFilter
    }

    onChange={(e) =>

      setStatusFilter(
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

    <option value="all">
      Semua
    </option>

    <option value="pending">
      Pending
    </option>

    <option value="verified">
      Verified
    </option>

  </select>

</div>

      <div
          className="
            mt-6
          "
        >

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
              mt-4
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
                px-3
                py-2
                disabled:opacity-50
              "

            >

              Prev

            </button>

            <span>

              Halaman

              {" "}

              {currentPage}

              {" / "}

              {totalPages || 1}

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
                px-3
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