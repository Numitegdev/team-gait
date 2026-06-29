"use client";

import { Addon, Peripheral } from "../types/peripheral.types";

interface Props {
  peripheral: Peripheral;

  addons: Addon[];

  onAssignAddon: (
    peripheralId: number
  ) => void;

  onRemovePeripheral: (
    id: number
  ) => void;

  onRemoveAddon: (
    id: number
  ) => void;
}

export default function PeripheralCard({
  peripheral,
  onAssignAddon,
  onRemovePeripheral,
  onRemoveAddon,
}: Props) {
  return (
    <div className="rounded-xl border bg-white shadow-sm hover:shadow-md transition">

      <div className="border-b p-4">

        <h2 className="font-semibold text-lg">

          {peripheral.ip_management.device}

        </h2>

        <p className="text-sm text-gray-500">

          {peripheral.ip_management.ip_terkini}

        </p>

      </div>

      <div className="space-y-3 p-4">

        <div>

          <div className="text-xs text-gray-400">
            Ruangan
          </div>

          <div>
            {peripheral.ip_management.ruangan}
          </div>

        </div>

        <div>

          <div className="text-xs text-gray-400">
            Network
          </div>

          <div>
            {peripheral.ip_management.jenis_network}
          </div>

        </div>

        <div>

          <div className="text-xs text-gray-400 mb-2">
            Addon
          </div>

          <div className="flex flex-wrap gap-2">

            {peripheral.peripheral_device_addons.length ===
            0 ? (
              <span className="text-xs text-gray-400">
                Belum ada addon
              </span>
            ) : (
              peripheral.peripheral_device_addons.map(
                (item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs"
                  >
                    <span>
                      {item.addon.addon_name}
                    </span>

                    <button
                      onClick={() =>
                        onRemoveAddon(item.id)
                      }
                      className="text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                )
              )
            )}

          </div>

        </div>

      </div>

      <div className="flex justify-between border-t p-4">

        <button
          onClick={() =>
            onAssignAddon(peripheral.id)
          }
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
        >
          + Addon
        </button>

        <button
          onClick={() =>
            onRemovePeripheral(peripheral.id)
          }
          className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
        >
          Hapus PC
        </button>

      </div>

    </div>
  );
}