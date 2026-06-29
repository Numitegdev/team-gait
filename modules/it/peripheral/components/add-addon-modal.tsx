"use client";

import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (addonName: string) => Promise<void>;
}

export default function AddAddonModal({
  open,
  onClose,
  onSave,
}: Props) {
  const [addonName, setAddonName] = useState("");

  if (!open) return null;

  const handleSave = async () => {
    if (!addonName.trim()) return;

    await onSave(addonName);

    setAddonName("");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl w-[450px] p-6">

        <h2 className="text-xl font-semibold mb-6">
          Tambah Addon
        </h2>

        <div className="space-y-2">

          <label className="text-sm font-medium">
            Nama Addon
          </label>

          <input
            value={addonName}
            onChange={(e) => setAddonName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Contoh : XL Prioritas"
          />

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="border rounded-lg px-4 py-2"
          >
            Batal
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white rounded-lg px-4 py-2"
          >
            Simpan
          </button>

        </div>

      </div>

    </div>
  );
}