"use client";

import {
  DetailModal,
}
from "./components/detail-modal";

import {
  TaskForm,
}
from "./components/task-form";

import {
  TaskTable,
}
from "./components/task-table";

import {
  useDriverTask,
}
from "./hooks/use-driver-task";

export default function DriverTaskPage() {

  const {

    tasks,

    loading,

    handleCreate,

    handleView,

    handleStartTask,

    handleCompleteTask,

    openModal,

    selectedTask,

    closeModal,
      role,

  } = useDriverTask();

  return (

    <div
      className="
        space-y-6
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-2
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >

            Driver Task

          </h1>

          <p
            className="
              text-sm
              text-slate-500
            "
          >

            Kelola dan monitor seluruh task driver

          </p>

        </div>

      </div>

      {/* FORM */}

{["ga_admin", "it_admin","staff_gudang","staff_admin"].includes(role) && (

      <div
        className="
          rounded-xl
          border
          bg-white
          shadow-sm
        "
      >

        <div
          className="
            border-b
            px-6
            py-4
          "
        >

          <h2
            className="
              text-lg
              font-semibold
            "
          >

            Buat Task Baru

          </h2>

        </div>

        <div
          className="
            p-6
          "
        >

          <TaskForm
            onSubmit={
              handleCreate
            }
          />

        </div>

      </div>
)}
      {/* TABLE */}

      <div
        className="
          rounded-xl
          border
          bg-white
          shadow-sm
        "
      >

        <div
          className="
            border-b
            px-6
            py-4
          "
        >

          <h2
            className="
              text-lg
              font-semibold
            "
          >

            Daftar Task

          </h2>

        </div>

        <div
          className="
            overflow-x-auto
          "
        >

          <TaskTable

            data={tasks}

            onView={
              handleView
            }

            onStart={
              handleStartTask
            }

          />

        </div>

      </div>

      {/* LOADING */}

      {

        loading && (

          <div
            className="
              rounded-xl
              border
              bg-white
              p-4
              text-center
              text-sm
              text-slate-500
            "
          >

            Memuat data...

          </div>

        )

      }

      {/* MODAL */}

      <DetailModal

        open={
          openModal
        }

        data={
          selectedTask
        }

        onClose={
          closeModal
        }

        onComplete={
          handleCompleteTask
        }

      />

    </div>

  );

}