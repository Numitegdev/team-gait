"use client";

import {
  useEffect,
  useState,
} from "react";

import { rooms }
from "@/modules/it/network-tools/ip-management/constants/room-options";

import { MaintenanceSchedule }
from "../types/maintenance-schedule";

interface Props {

  open: boolean;

  onClose: () => void;

  onSave: (
    payload: any
  ) => Promise<void>;

  onDelete?: (
  id: number
) => Promise<void>;

  selectedDate: string;

  editingSchedule?: any;

}

export function ScheduleModal({

  open,

  onClose,

  onSave,

  onDelete,

  selectedDate,

  editingSchedule,

}: Props) {

  const [form, setForm] =
    useState({

      tanggal: "",

      ruangan: "",

      catatan: "",

      warna: "#22c55e",

    });

  useEffect(() => {

  if (
    editingSchedule
  ) {

    setForm({

      tanggal:
        editingSchedule.tanggal,

      ruangan:
        editingSchedule.ruangan,

      catatan:
        editingSchedule.catatan,

      warna:
        editingSchedule.warna,

    });

    return;

  }

  setForm({

    tanggal:
      selectedDate,

    ruangan: "",

    catatan: "",

    warna:
      "#22c55e",

  });

}, [

  selectedDate,

  editingSchedule,

]);

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
          max-w-xl
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

          {editingSchedule
            ? "Edit Schedule"
            : "Add Schedule"}

        </h2>

        <div
          className="
            grid
            gap-4
          "
        >

          <input
            type="date"
            value={form.tanggal}
            onChange={(e) =>
              setForm({
                ...form,
                tanggal:
                  e.target.value,
              })
            }
            className="
              rounded-xl
              border
              p-3
            "
          />

          <input

  value={form.ruangan}

  onChange={(e) =>
    setForm({
      ...form,
      ruangan:
        e.target.value,
    })
  }

  placeholder="Judul Kegiatan"

  className="
    rounded-xl
    border
    p-3
  "

/>

          <textarea
            rows={4}
            value={form.catatan}
            onChange={(e) =>
              setForm({
                ...form,
                catatan:
                  e.target.value,
              })
            }
            placeholder="Catatan"
            className="
              rounded-xl
              border
              p-3
            "
          />

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
              "
            >
              Warna Jadwal
            </label>

            <input
              type="color"
              value={form.warna}
              onChange={(e) =>
                setForm({
                  ...form,
                  warna:
                    e.target.value,
                })
              }
              className="
                h-12
                w-full
                rounded-xl
                border
              "
            />

          </div>

        </div>

       <div
        className="
            mt-6
            flex
            justify-between
            gap-3
        "
        >

        {editingSchedule && (

            <button

                onClick={async () => {

                if (
                    !editingSchedule.id
                )
                    return;

                await onDelete?.(
                    editingSchedule.id
                );

                onClose();

                }}

                className="
                rounded-xl
                bg-red-600
                px-4
                py-2
                text-white
                "
            >

                Delete

            </button>

            )}

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