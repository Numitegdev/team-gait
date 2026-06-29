"use client";

import { useEffect, useState } from "react";

import { Addon } from "../types/peripheral.types";

interface Props {
  open: boolean;

  addons: Addon[];

  onClose: () => void;

  onSave: (
    addonIds: number[]
  ) => Promise<void>;
}

export default function AssignAddonModal({
  open,
  addons,
  onClose,
  onSave,
}: Props) {
  const [selectedAddons, setSelectedAddons] =
    useState<number[]>([]);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (open) {
      setSelectedAddons([]);
    }
  }, [open]);

  if (!open) return null;

  const toggleAddon = (
    addonId: number
  ) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await onSave(selectedAddons);

      setSelectedAddons([]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[500px] rounded-lg bg-white shadow-lg">

        <div className="border-b p-5">

          <h2 className="text-lg font-semibold">
            Tambah Addon
          </h2>

        </div>

        <div className="max-h-[400px] overflow-y-auto p-5 space-y-3">

          {addons.map((addon) => (

            <label
              key={addon.id}
              className="flex items-center gap-3 cursor-pointer"
            >

              <input
                type="checkbox"
                checked={selectedAddons.includes(
                  addon.id
                )}
                onChange={() =>
                  toggleAddon(addon.id)
                }
              />

              <span>
                {addon.addon_name}
              </span>

            </label>

          ))}

        </div>

        <div className="flex justify-end gap-3 border-t p-5">

          <button
            onClick={onClose}
            className="rounded border px-4 py-2"
          >
            Batal
          </button>

          <button
            disabled={
              saving ||
              selectedAddons.length === 0
            }
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {saving
              ? "Menyimpan..."
              : "Simpan"}
          </button>

        </div>

      </div>

    </div>
  );
}