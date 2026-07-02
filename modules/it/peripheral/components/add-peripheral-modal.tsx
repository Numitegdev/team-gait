"use client";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { AvailableDevice } from "../types/peripheral.types";

interface Props {
  open: boolean;
  devices: AvailableDevice[];
  onClose: () => void;
  onSave: (id: number) => Promise<void>;
}



export default function AddPeripheralModal({
  open,
  devices,
  onClose,
  onSave,
}: Props) {
  const [selectedId, setSelectedId] = useState<number>();
const [search, setSearch] =
  useState("");

const [selectedRoom, setSelectedRoom] =
  useState("");

const [selectedNetwork, setSelectedNetwork] =
  useState("");
  
const rooms = useMemo(() => {

    return Array.from(

        new Set(

            devices.map(
                d => d.ruangan
            )

        )

    ).sort();

}, [devices]);

const networks = useMemo(() => {

    return Array.from(

        new Set(

            devices.map(
                d => d.jenis_network
            )

        )

    ).sort();

}, [devices]);

const filteredDevices =
useMemo(() => {

    return devices.filter(device => {

        const keyword =
            search.toLowerCase();

        const matchSearch =

            device.device
                .toLowerCase()
                .includes(keyword)

            ||

            device.ip_terkini
                .toLowerCase()
                .includes(keyword);

        const matchRoom =

            selectedRoom === ""

            ||

            device.ruangan ===
            selectedRoom;

        const matchNetwork =

            selectedNetwork === ""

            ||

            device.jenis_network ===
            selectedNetwork;

        return (

            matchSearch &&

            matchRoom &&

            matchNetwork

        );

    });

}, [
    devices,
    search,
    selectedRoom,
    selectedNetwork
]);

if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl w-[650px] p-6">

        <h2 className="text-xl font-semibold mb-4">
          Tambah PC Peripheral
        </h2>
      <div className="space-y-3 mb-5">

  <input
    autoFocus
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    placeholder="Cari Device atau IP..."
    className="w-full rounded-lg border px-3 py-2"
  />

  <div className="grid grid-cols-2 gap-3">

    <select
      value={selectedRoom}
      onChange={(e) =>
        setSelectedRoom(
          e.target.value
        )
      }
      className="rounded-lg border px-3 py-2"
    >
      <option value="">
        Semua Ruangan
      </option>

      {rooms.map(room => (

        <option
          key={room}
          value={room}
        >
          {room}
        </option>

      ))}

    </select>

    <select
      value={selectedNetwork}
      onChange={(e) =>
        setSelectedNetwork(
          e.target.value
        )
      }
      className="rounded-lg border px-3 py-2"
    >
      <option value="">
        Semua Network
      </option>

      {networks.map(network => (

        <option
          key={network}
          value={network}
        >
          {network}
        </option>

      ))}

    </select>

  </div>

</div>

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

              {filteredDevices.map((device) => (

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