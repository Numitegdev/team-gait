"use client";

import { ToolCard }
from "./tool-card";

import { MaintenanceTool }
from "../types/maintenance-tools";

interface Props {

  tools: MaintenanceTool[];

  onEdit: (
    tool: MaintenanceTool
  ) => void;

  onDelete: (
    id: number
  ) => void;

}

export function ToolGrid({

  tools,

  onEdit,
  onDelete,

}: Props) {

  if (
    tools.length === 0
  ) {

    return (

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-10
          text-center
          text-slate-500
        "
      >

        Tidak ada tools ditemukan

      </div>

    );

  }

  return (

    <div
      className="
        grid
        gap-4

        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        items-stretch
      "
    >

      {tools.map((tool) => (

        <ToolCard

          key={tool.id}

          tool={tool}

          onEdit={onEdit}

          onDelete={onDelete}

        />

      ))}

    </div>

  );

}