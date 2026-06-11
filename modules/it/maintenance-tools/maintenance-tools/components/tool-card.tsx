"use client";

import { MaintenanceTool }
from "../types/maintenance-tools";

interface Props {

  tool: MaintenanceTool;

  onEdit: (
    tool: MaintenanceTool
  ) => void;

  onDelete: (
    id: number
  ) => void;

}

export function ToolCard({

  tool,

  onEdit,
  onDelete,

}: Props) {

  return (

    <div
      className="
        h-full
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        transition
        hover:shadow-md
      "
    >

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <img
          src={
            tool.icon_url ||

            `https://www.google.com/s2/favicons?domain=${tool.download_url}&sz=128`
          }
          alt={tool.nama}
          className="
            h-14
            w-14
            rounded-xl
            border
            object-cover
          "
        />

        <div className="min-w-0">

          <h3
            className="
              truncate
              font-semibold
            "
          >
            {tool.nama}
          </h3>

          <p
            className="
              text-sm
              text-blue-600
            "
          >
            {tool.kategori}
          </p>

        </div>

      </div>

      <p
        className="
          line-clamp-3
          text-sm
          text-slate-500
          min-h-[60px]
        "
      >
        {tool.deskripsi}
      </p>

      <div
        className="
          mt-auto
          flex
          gap-2
        "
      >

        <a
          href={tool.download_url}
          target="_blank"
          rel="noreferrer"
          className="
            flex-1
            rounded-xl
            bg-green-600
            px-3
            py-2
            text-center
            text-sm
            text-white
          "
        >
          Download
        </a>

        <button
          onClick={() =>
            onEdit(tool)
          }
          className="
            rounded-xl
            bg-yellow-500
            px-3
            py-2
            text-sm
            text-white
          "
        >
          Edit
        </button>

        <button
          onClick={() =>
            onDelete(tool.id)
          }
          className="
            rounded-xl
            bg-red-600
            px-3
            py-2
            text-sm
            text-white
          "
        >
          Delete
        </button>

      </div>

    </div>

  );

}