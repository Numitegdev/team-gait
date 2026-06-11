"use client";

import { useState } from "react";

import { ToolGrid }
from "./components/tool-grid";

import { ToolModal }
from "./components/tool-modal";

import { useMaintenanceTools }
from "./hooks/use-maintenance-tools";

import { MaintenanceTool }
from "./types/maintenance-tools";

export default function MaintenanceTools() {

  const {

    tools,

    addTool,

    editTool,

    removeTool,

  } = useMaintenanceTools();

  const [
    openModal,
    setOpenModal,
  ] = useState(false);

  const [
    editingTool,
    setEditingTool,
  ] = useState<MaintenanceTool | null>(
    null
  );

  const [search, setSearch] =
  useState("");

  const filteredTools =
  tools.filter((tool) =>
    tool.nama
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )
  );

  async function handleSave(
    payload: any
  ) {

    if (editingTool) {

      await editTool(
        editingTool.id,
        payload
      );

    } else {

      await addTool(payload);

    }

    setEditingTool(null);

  }

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
          Maintenance Tools
        </h1>

        <button
          onClick={() => {

            setEditingTool(null);

            setOpenModal(true);

          }}
          className="
            rounded-xl
            bg-blue-600
            px-4
            py-2
            text-white
          "
        >
          Add Tool
        </button>

      </div>

      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Cari tools..."
        className="
          w-full
          rounded-xl
          border
          p-3
        "
      />


      <ToolGrid
       tools={filteredTools}
        onEdit={(tool) => {

          setEditingTool(tool);

          setOpenModal(true);

        }}
        onDelete={removeTool}
      />

      <ToolModal
        open={openModal}
        onClose={() => {

          setOpenModal(false);

          setEditingTool(null);

        }}
        onSave={handleSave}
        editingTool={editingTool}
      />

    </div>

  );

}