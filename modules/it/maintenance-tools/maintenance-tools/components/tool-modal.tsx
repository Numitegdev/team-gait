"use client";

import { useEffect, useState } from "react";

import { MaintenanceTool }
from "../types/maintenance-tools";

interface Props {

  open: boolean;

  onClose: () => void;

  onSave: (
    payload: any
  ) => Promise<void>;

  editingTool?:
    MaintenanceTool | null;

}

export function ToolModal({

  open,

  onClose,

  onSave,

  editingTool,

}: Props) {

  const [form, setForm] =
    useState({

      nama: "",

      kategori: "",

      icon_url: "",

      download_url: "",

      deskripsi: "",

    });

  useEffect(() => {

    if (!editingTool) {

      setForm({

        nama: "",

        kategori: "",

        icon_url: "",

        download_url: "",

        deskripsi: "",

      });

      return;

    }

    setForm({

      nama:
        editingTool.nama,

      kategori:
        editingTool.kategori,

      icon_url:
        editingTool.icon_url,

      download_url:
        editingTool.download_url,

      deskripsi:
        editingTool.deskripsi,

    });

  }, [editingTool]);

  if (!open)
    return null;

  async function handleSave() {

    await onSave(form);

    onClose();

  }

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
      "
    >

      <div
        className="
          w-full
          max-w-2xl
          rounded-2xl
          bg-white
          p-6
          shadow-xl
        "
      >

        <h2
          className="
            mb-6
            text-2xl
            font-bold
          "
        >

          {editingTool
            ? "Edit Tool"
            : "Add Tool"}

        </h2>

        <div
          className="
            grid
            gap-4
          "
        >

          <input
            value={form.nama}
            onChange={(e) =>
              setForm({
                ...form,
                nama:
                  e.target.value,
              })
            }
            placeholder="Nama Tool"
            className="
              rounded-xl
              border
              p-3
            "
          />

          <input
            value={form.kategori}
            onChange={(e) =>
              setForm({
                ...form,
                kategori:
                  e.target.value,
              })
            }
            placeholder="Kategori"
            className="
              rounded-xl
              border
              p-3
            "
          />

          <input
            value={form.icon_url}
            onChange={(e) =>
              setForm({
                ...form,
                icon_url:
                  e.target.value,
              })
            }
            placeholder="Icon URL"
            className="
              rounded-xl
              border
              p-3
            "
          />

          <input
            value={form.download_url}
            onChange={(e) =>
              setForm({
                ...form,
                download_url:
                  e.target.value,
              })
            }
            placeholder="Download URL"
            className="
              rounded-xl
              border
              p-3
            "
          />

          <textarea
            rows={4}
            value={form.deskripsi}
            onChange={(e) =>
              setForm({
                ...form,
                deskripsi:
                  e.target.value,
              })
            }
            placeholder="Deskripsi"
            className="
              rounded-xl
              border
              p-3
            "
          />

        </div>

        <div
          className="
            mt-6
            flex
            justify-end
            gap-3
          "
        >

          <button
            onClick={onClose}
            className="
              rounded-xl
              border
              px-4
              py-2
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="
              rounded-xl
              bg-blue-600
              px-4
              py-2
              text-white
            "
          >
            Save
          </button>

        </div>

      </div>

    </div>

  );

}