"use client";

import { AvailableDevice } from "../types/peripheral.types";

interface Props {
  open: boolean;
  devices: AvailableDevice[];
  onClose: () => void;
  onSave: (id: number) => Promise<void>;
}

import { useState } from "react";

export default function AddPeripheralModal({
  open,
  devices,
  onClose,
  onSave,
}: Props) {
  const [selectedId, setSelectedId] = useState<number>();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl w-[650px] p-6">

        <h2 className="text-xl font-semibold mb-4">
          Tambah PC Peripheral
        </h2>

        <div className="max-h-[400px] overflow-y-auto border rounded-lg">

          <table className="w-full">

            <thead className="border-b">

              <tr>

                <th className="p-3 w-10"></th>

                <th className="text-left p-3">
                  Device
                </th>

                <th className="text-left p-3">
                  IP
                </th>

                <th className="text-left p-3">
                  Ruangan
                </th>

                <th className="text-left p-3">
                  Network
                </th>

              </tr>

            </thead>

            <tbody>

              {devices.map((device) => (

                <tr
                  key={device.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedId(device.id)}
                >

                  <td className="p-3">

                    <input
                      type="radio"
                      checked={selectedId === device.id}
                      onChange={() =>
                        setSelectedId(device.id)
                      }
                    />

                  </td>

                  <td className="p-3">
                    {device.device}
                  </td>

                  <td className="p-3">
                    {device.ip_terkini}
                  </td>

                  <td className="p-3">
                    {device.ruangan}
                  </td>

                  <td className="p-3">
                    {device.jenis_network}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="border rounded-lg px-4 py-2"
          >
            Batal
          </button>

          <button
            disabled={!selectedId}
            onClick={async () => {
              if (!selectedId) return;

              await onSave(selectedId);

              onClose();
            }}
            className="bg-blue-600 text-white rounded-lg px-4 py-2"
          >
            Tambahkan
          </button>

        </div>

      </div>

    </div>
  );
}