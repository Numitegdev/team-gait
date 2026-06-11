"use client";

import {
  MaintenanceFormCard,
}
from "./components/maintenance-form-card";

import {
  MaintenanceChecklist,
}
from "./components/maintenance-checklist";

import {
  useMaintenanceForm,
}
from "./hooks/use-maintenance-form";

export default function MaintenanceForm() {

  const {

    form,
    setForm,

    loading,

    saveMaintenance,

  } =
    useMaintenanceForm();

  return (

    <div
      className="
        mx-auto
        max-w-6xl
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
          Maintenance Form
        </h1>

        <p
          className="
            mt-1
            text-slate-500
          "
        >
          Form pencatatan maintenance perangkat.
        </p>

      </div>

      <MaintenanceFormCard

        form={form}

        setForm={setForm}

      />

      <MaintenanceChecklist

        form={form}

        setForm={setForm}

      />

      <div
        className="
          flex
          justify-end
        "
      >

        <button

          onClick={
            saveMaintenance
          }

          disabled={loading}

          className="
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-medium
            text-white
            disabled:opacity-50
          "
        >

          {loading
            ? "Saving..."
            : "Save Maintenance"}

        </button>

      </div>

    </div>

  );

}