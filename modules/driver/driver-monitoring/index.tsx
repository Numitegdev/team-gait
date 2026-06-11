"use client";

import {
  useDriverMonitoring,
}
from "./hooks/use-driver-monitoring";

import {
  MonitoringCards,
}
from "./components/monitoring-cards";

import {
  MonitoringTable,
}
from "./components/monitoring-table";
import {
  MonitoringDetailModal,
}
from "./components/monitoring-detail-modal";




export default function DriverMonitoringPage() {

  

 const {

  tasks,

  stats,

  search,

  drivers,

  setSearch,

  statusFilter,

  setStatusFilter,

   driverFilter,

  setDriverFilter,

  page,

  setPage,

  totalPages,

  dateFrom,

  setDateFrom,

  dateTo,

  setDateTo,

  selectedTask,

  setSelectedTask,

  handleView,

}
=
useDriverMonitoring();

 


return (

  <div
    className="
      space-y-6
      p-4
      md:p-6
    "
  >

<div>

  <h1
    className="
      text-2xl
      font-bold
      tracking-tight
      md:text-3xl
    "
  >

    Driver Monitoring

  </h1>

  <p
    className="
      mt-1
      text-sm
      text-slate-500
    "
  >

    Monitoring aktivitas driver,
    pengiriman,
    dan histori task.

  </p>

</div>

<div
  className="
    rounded-xl
    border
    bg-white
    p-4
    shadow-sm
  "
>

  <div
    className="
      grid
      gap-3
      sm:grid-cols-2
      xl:grid-cols-5
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
        Cari task...
      "

      className="
        rounded-lg
        border
        px-3
        py-2
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
        Semua Status
      </option>

      <option value="pending">
        Pending
      </option>

      <option value="on_progress">
        On Progress
      </option>

      <option value="completed">
        Completed
      </option>

    </select>

    <select

      value={
        driverFilter
      }

      onChange={(e) =>
        setDriverFilter(
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
        Semua Driver
      </option>

      {

        drivers.map(
          (driver) => (

            <option
              key={driver}
              value={driver}
            >

              {driver}

            </option>

          )
        )

      }

    </select>

    <input

      type="date"

      value={
        dateFrom
      }

      onChange={(e) =>
        setDateFrom(
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

    <input

      type="date"

      value={
        dateTo
      }

      onChange={(e) =>
        setDateTo(
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

</div>

<MonitoringCards
  stats={stats}
/>

<MonitoringDetailModal

  open={
    !!selectedTask
  }

  data={
    selectedTask
  }

  onClose={() =>
    setSelectedTask(
      null
    )
  }

/>

<div
  className="
    overflow-hidden
    rounded-xl
    border
    bg-white
    shadow-sm
  "
>

  <MonitoringTable

    data={tasks}

    onView={
      handleView
    }

  />

</div>

<div
  className="
    flex
    flex-col
    gap-3
    rounded-xl
    border
    bg-white
    p-4
    shadow-sm

    sm:flex-row
    sm:items-center
    sm:justify-between
  "
>

  <div
    className="
      text-sm
      text-slate-500
    "
  >

    Halaman {page}
    dari {totalPages}

  </div>

  <div
    className="
      flex
      items-center
      gap-2
    "
  >

    <button

      disabled={
        page <= 1
      }

      onClick={() =>
        setPage(
          page - 1
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

      ← Prev

    </button>

    <div
      className="
        min-w-[70px]
        text-center
        text-sm
        font-medium
      "
    >

      {page}
      {" / "}
      {totalPages}

    </div>

    <button

      disabled={
        page >= totalPages
      }

      onClick={() =>
        setPage(
          page + 1
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

      Next →

    </button>

  </div>

</div>


  </div>

);

}