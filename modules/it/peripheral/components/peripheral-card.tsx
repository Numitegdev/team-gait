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

  onUploadScanner: (
    id: number
  ) => void;

  onDetail: (
    peripheral: Peripheral
  ) => void;
}

export default function PeripheralCard({

  peripheral,

  onAssignAddon,

  onRemovePeripheral,

  onRemoveAddon,

  onUploadScanner,
 
  onDetail,
  

}: Props)  {

  const hardware = peripheral.hardware;

const cpu =
  hardware?.cpu?.model ?? "-";

const ram =
  hardware?.memory?.total_gb
    ? `${hardware.memory.total_gb} GB`
    : "-";

const storage =
  hardware?.storage?.physical?.[0];

const storageText =
  storage
    ? `${storage.size_gb} GB ${storage.media_type}`
    : "-";

const windows =
  hardware?.windows?.name ?? "-";

const detail =
  peripheral.score_detail;
console.log("DETAIL", detail);
console.log("PERIPHERAL", peripheral);
function scoreBar(
  value: number,
  max: number
) {

  return Math.round(
    (value / max) * 100
  );

}
  
  return (
    <div className="rounded-xl border bg-white shadow-sm hover:shadow-md transition">

      <div className="border-b p-4">

      <div className="flex justify-between items-start">

    <div>

        <h2 className="font-semibold text-lg">
            {peripheral.ip_management.device}
        </h2>

        <p className="text-sm text-gray-500">
            {peripheral.ip_management.ip_terkini}
        </p>

    </div>

    <div className="text-right">

        <div className="text-xs text-gray-400">
            Score
        </div>

        <div className="text-2xl font-bold text-green-600">
            {peripheral.score ?? "-"}
        </div>

    </div>

</div>

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

{/* scoring */}
<div className="mt-3">

  <div className="flex justify-between text-sm mb-1">

    <span>Health Score</span>

    <span>

      {peripheral.score ?? 0}/100

    </span>

  </div>

  <div className="w-full bg-gray-200 rounded-full h-2">

    <div

      className="bg-green-500 h-2 rounded-full"

      style={{

        width: `${peripheral.score ?? 0}%`,

      }}

    />

  </div>

{/* detail health bar */}
  {detail && (

<div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">

  {/* CPU */}

  <div>

    <div className="flex justify-between">

      <span>CPU</span>

      <span>{detail.cpu}/35</span>

    </div>

    <div className="h-2 bg-gray-200 rounded">

      <div
        className="h-2 bg-blue-500 rounded"
        style={{
          width: `${scoreBar(detail.cpu,35)}%`
        }}
      />

    </div>

  </div>

  {/* RAM */}

  <div>

    <div className="flex justify-between">

      <span>RAM</span>

      <span>{detail.ram}/25</span>

    </div>

    <div className="h-2 bg-gray-200 rounded">

      <div
        className="h-2 bg-emerald-500 rounded"
        style={{
          width: `${scoreBar(detail.ram,25)}%`
        }}
      />

    </div>

  </div>

  {/* STORAGE */}

  <div>

    <div className="flex justify-between">

      <span>Storage</span>

      <span>{detail.storage}/20</span>

    </div>

    <div className="h-2 bg-gray-200 rounded">

      <div
        className="h-2 bg-orange-500 rounded"
        style={{
          width: `${scoreBar(detail.storage,20)}%`
        }}
      />

    </div>

  </div>

  {/* WINDOWS */}

  <div>

    <div className="flex justify-between">

      <span>Windows</span>

      <span>{detail.windows}/10</span>

    </div>

    <div className="h-2 bg-gray-200 rounded">

      <div
        className="h-2 bg-purple-500 rounded"
        style={{
          width: `${scoreBar(detail.windows,10)}%`
        }}
      />

    </div>

  </div>

  {/* GPU */}

  <div>

    <div className="flex justify-between">

      <span>GPU</span>

      <span>{detail.gpu}/10</span>

    </div>

    <div className="h-2 bg-gray-200 rounded">

      <div
        className="h-2 bg-pink-500 rounded"
        style={{
          width: `${scoreBar(detail.gpu,10)}%`
        }}
      />

    </div>

  </div>

</div>

)}

            </div>

        </div>

        {/* spek */}
        <div className="grid grid-cols-2 gap-3 text-sm">

    <div>

        <div className="text-gray-400">
            CPU
        </div>

        <div className="truncate">
            {cpu}
        </div>

    </div>

    <div>

        <div className="text-gray-400">
            RAM
        </div>

        <div>
            {ram}
        </div>

    </div>

    <div>

        <div className="text-gray-400">
            Storage
        </div>

        <div>
            {storageText}
        </div>

    </div>

    <div>

        <div className="text-gray-400">
            Windows
        </div>

        <div className="truncate">
            {windows}
        </div>

    </div>

</div>
{/* add on */}
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

       <div>
{/* last scan */}
    <div className="text-xs text-gray-400">

        Last Scan

    </div>

   <div className="text-sm font-medium">
  {peripheral.last_scan_at
    ? new Date(
        peripheral.last_scan_at
      ).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Belum pernah scan"}
</div>

</div> 

      </div>
    

      {/* <div className="flex justify-between border-t p-4">
        <button
        onClick={() =>
          onUploadScanner(peripheral.id)
        }
        className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white"
      >
        Upload Scan
      </button>

      <button
        onClick={() => onDetail(peripheral)}
        className="rounded-lg bg-gray-700 px-3 py-2 text-sm text-white"
      >
        Detail
      </button>
      
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

      </div> */}


<div className="border-t p-4">
  {/* Grid otomatis: 2 kolom di HP (mobile), 4 kolom di layar komputer (sm ke atas) */}
  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
    
    <button
      onClick={() => onUploadScanner(peripheral.id)}
      className="flex items-center justify-center rounded-lg bg-emerald-600 py-2 px-1 text-center text-xs font-medium text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
    >
      Upload Scan
    </button>

    <button
      onClick={() => onDetail(peripheral)}
      className="flex items-center justify-center rounded-lg bg-slate-700 py-2 px-1 text-center text-xs font-medium text-white transition-colors hover:bg-slate-800 active:bg-slate-900"
    >
      Detail
    </button>

    <button
      onClick={() => onAssignAddon(peripheral.id)}
      className="flex items-center justify-center rounded-lg bg-blue-600 py-2 px-1 text-center text-xs font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
    >
      + Addon
    </button>

    <button
      onClick={() => onRemovePeripheral(peripheral.id)}
      className="flex items-center justify-center rounded-lg bg-rose-600 py-2 px-1 text-center text-xs font-medium text-white transition-colors hover:bg-rose-700 active:bg-rose-800"
    >
      Hapus PC
    </button>

  </div>
</div>

    </div>
  );
}