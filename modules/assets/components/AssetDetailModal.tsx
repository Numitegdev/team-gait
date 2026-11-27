"use client";

import { useEffect, useState } from "react";

import { getAssetById ,  finishAssetMaintenance, finishAssetUse, } from "../services/asset-service";

import { AssetDetail }
from "../types/AssetDetail";

import {

  getAssetHistory,

} from "../services/asset-history-query";

import AssetHistoryTimeline
from "./AssetHistoryTimeline";

import {

  AssetHistoryDetail,

} from "../types/AssetHistoryDetail";

interface AssetDetailModalProps {

  open: boolean;

  assetId: number | null;

  onClose: () => void;

}

export default function AssetDetailModal({

  open,

  assetId,

  onClose,

}: AssetDetailModalProps) {

    function DetailItem({

  label,

  value,

}: {

  label: string;

  value: React.ReactNode;

}) {

  return (

    <div>

      <p
        className="
          text-sm
          text-gray-500
        "
      >

        {label}

      </p>

      <div
        className="
          mt-1
          rounded-xl
          border
          bg-gray-50
          p-3
          font-medium
        "
      >

        {value}

      </div>

    </div>

  );

}

const [

  asset,

  setAsset,

] =
useState<
AssetDetail | null
>(null);


const [

  history,

  setHistory,

] = useState<

  AssetHistoryDetail[]

>([]);

const [actionLoading, setActionLoading] = useState(false);

async function handleFinishStatus(
  action: "maintenance" | "use"
) {
  if (!asset) return;

  const isMaintenance = action === "maintenance";

  const confirmed = window.confirm(
    isMaintenance
      ? `Apakah perbaikan aset ${asset.asset_code} sudah selesai?`
      : `Apakah aset ${asset.asset_code} sudah selesai digunakan?`
  );

  if (!confirmed) return;

  try {
    setActionLoading(true);

    if (isMaintenance) {
      await finishAssetMaintenance(asset.id);
    } else {
      await finishAssetUse(asset.id);
    }

    await loadAsset();

    alert("Status aset berhasil diperbarui.");
  } catch (error) {
    console.error("Gagal memperbarui status aset:", error);

    alert(
      "Status aset gagal diperbarui. Silakan periksa kembali data dan koneksi."
    );
  } finally {
    setActionLoading(false);
  }
}

const [
  loading,
  setLoading,
] = useState(false);

async function loadAsset() {

  try {

    setLoading(true);

    const [

      asset,

      histories,

    ] = await Promise.all([

      getAssetById(

        assetId!

      ),

      getAssetHistory(

        assetId!

      ),

    ]);

    setAsset(asset);

    setHistory(histories);

  } finally {

    setLoading(false);

  }

}


useEffect(() => {

  if (!open || !assetId)
    return;

  loadAsset();

}, [

  open,

  assetId,

]);
// console.log(history);

  if (!open)
    return null;

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
        p-1
      "
    >

      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-5xl
          flex-col
          rounded-2xl
          bg-white
          shadow-xl
          p-2
        "
      >

        {/* Header */}

        <div
        className="
          flex
          items-center
          justify-between
          border-b
          p-6
        "
      >

          <div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >

              Asset Detail

            </h2>

            <p
              className="
                text-sm
                text-gray-500
              "
            >

              Informasi lengkap asset.

            </p>

          </div>

          <button

            onClick={onClose}

            className="
              rounded-lg
              px-3
              py-2
              text-gray-500
              hover:bg-gray-100
            "

          >

            ✕

          </button>

        </div>

        {/* Content */}

     
<div
  className="
    flex-1
    overflow-y-auto
    p-6
  "
>
            {loading ? (

            <div
                className="
                py-16
                text-center
                "
            >

                Loading...

            </div>

            ) : !asset ? (

            <div
                className="
                py-16
                text-center
                text-red-500
                "
            >

                Asset tidak ditemukan.

            </div>

            ) : (

            <div
                className="
                grid
                gap-5
                md:grid-cols-2
                "
            >

                <DetailItem

                label="Asset Code"

                value={asset.asset_code}

                />

                <DetailItem

                label="Asset Name"

                value={asset.asset_name}

                />

                <DetailItem

                label="Company"

                value={asset.company?.name ?? "-"}

                />

                <DetailItem

                label="Location"

                value={asset.location?.name ?? "-"}

                />

                <DetailItem

                label="Category"

                value={asset.category?.name ?? "-"}

                />

                <DetailItem

                label="Model"

                value={asset.model?.name ?? "-"}

                />

                <DetailItem

                label="Brand"

                value={asset.brand ?? "-"}

                />

                <DetailItem

                label="Serial Number"

                value={asset.serial_number ?? "-"}

                />

                <DetailItem

                label="Purchase Date"

                value={asset.purchase_date ?? "-"}

                />

                <DetailItem

                label="Warranty"

                value={asset.warranty_until ?? "-"}

                />

                <DetailItem

                label="Purchase Price"

                value={
                    asset.purchase_price != null
                    ? `Rp ${Number(asset.purchase_price).toLocaleString("id-ID")}`
                    : "-"
                }

                />

                <DetailItem

                label="Condition"

                value={asset.condition?.name ?? "-"}

                />

                <DetailItem

                label="Status"

                value={asset.status?.name ?? "-"}

                />

                <div
                className="
                    md:col-span-2
                "
                >

                <DetailItem

                    label="Notes"

                    value={asset.notes ?? "-"}

                />

                </div>

            </div>

            )}

            {asset?.ip_management && (

              <>

                <hr
                  className="
                    my-6
                  "
                />

                <div>

                  <h3
                    className="
                      mb-4
                      text-lg
                      font-semibold
                    "
                  >

                    🌐 Network Information

                  </h3>

                  <div
                    className="
                      grid
                      gap-5
                      md:grid-cols-2
                    "
                  >

                    <DetailItem

                      label="IP Address"

                      value={
                        asset.ip_management.ip_terkini ??
                        "-"
                      }

                    />

                    <DetailItem

                      label="Device"

                      value={
                        asset.ip_management.device ??
                        "-"
                      }

                    />

                    {/* <DetailItem

                      label="Ruangan"

                      value={
                        asset.ip_management.ruangan ??
                        "-"
                      }

                    /> */}

                  </div>

                </div>

              </>

            )}

         
{/* SPESIFIKASI ASSET */}
{asset && asset.model?.spec_source === "manual" && (
  <>
    <hr className="my-6" />

    <div>
      <h3 className="mb-4 text-lg font-semibold">
        🖥️ Spesifikasi Asset
      </h3>

      <DetailItem
        label="Spesifikasi Manual"
        value={
          asset.spec_json?.description?.trim()
            ? asset.spec_json.description
            : "Belum ada spesifikasi manual."
        }
      />
    </div>
  </>
)}

{asset && asset.model?.spec_source === "peripheral" && (
  <>
    <hr className="my-6" />

    <div>
      <h3 className="mb-4 text-lg font-semibold">
        🖥️ Spesifikasi Hardware & Software
      </h3>

      {asset.ip_management?.peripheral ? (
        <>
          {(() => {
            const peripheral = asset.ip_management.peripheral;

            return (
              <>
                <div className="mb-5 grid gap-5 md:grid-cols-3">
                  

                  <DetailItem
                    label="Terakhir Scan"
                    value={
                      peripheral.last_scan_at
                        ? new Date(
                            peripheral.last_scan_at
                          ).toLocaleString("id-ID")
                        : "Belum pernah scan"
                    }
                  />
                </div>

              
<h4 className="mb-3 font-semibold">
  Hardware Information
</h4>

{peripheral.hardware ? (
  (() => {
    const hardware = peripheral.hardware;

    const cpu = hardware.cpu;
    const memory = hardware.memory;
    const gpuList = hardware.gpu ?? [];
    const disks = hardware.storage?.physical ?? [];

    const totalStorage = disks.reduce(
      (total, disk) =>
        total + (Number(disk.size_gb) || 0),
      0
    );

    return (
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* CPU */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <p className="font-semibold text-gray-600">
              Processor
            </p>
          </div>

          <p className="font-bold text-gray-900">
            {cpu?.model ?? "-"}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {cpu?.cores ?? "-"} Cores
            {" · "}
            {cpu?.threads ?? "-"} Threads
          </p>

          <p className="text-sm text-gray-500">
            Max Clock: {cpu?.max_clock ?? "-"} MHz
          </p>
        </div>

        {/* RAM */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <p className="font-semibold text-gray-600">
              Memory
            </p>
          </div>

          <p className="text-2xl font-bold text-gray-900">
            {memory?.total_gb ?? 0} GB
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {memory?.modules?.length ?? 0} Memory Modules
          </p>

          <p className="text-sm text-gray-500">
            {memory?.modules?.[0]?.speed
              ? `${memory.modules[0].speed} MHz`
              : "Speed unavailable"}
          </p>
        </div>

        {/* GPU */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">🖥️</span>
            <p className="font-semibold text-gray-600">
              Graphics
            </p>
          </div>

          {gpuList.length > 0 ? (
            gpuList.map((gpu, index) => (
              <div key={index}>
                <p className="font-bold text-gray-900">
                  {gpu.name}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  VRAM: {gpu.adapter_ram_mb ?? "-"} MB
                </p>

                <p className="text-sm text-gray-500">
                  Resolution: {gpu.resolution ?? "-"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              GPU information unavailable.
            </p>
          )}
        </div>

        {/* STORAGE */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">💾</span>
            <p className="font-semibold text-gray-600">
              Storage
            </p>
          </div>

          <p className="text-2xl font-bold text-gray-900">
            {totalStorage} GB
          </p>

          <div className="mt-3 space-y-2">
            {disks.map((disk, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="text-gray-600">
                  {disk.model}
                </span>

                <span className="font-medium text-gray-900">
                  {disk.size_gb} GB
                  {" · "}
                  {disk.media_type}
                </span>
              </div>
            ))}
          </div>
        </div>

{/* OPERATING SYSTEM */}
<div className="mb-5 rounded-xl border bg-white p-4 shadow-sm">
  <h4 className="mb-4 font-semibold">
    🪟 Operating System
  </h4>

  <div className="grid gap-4 sm:grid-cols-2">
    <DetailItem
      label="Operating System"
      value={hardware.windows?.name ?? "-"}
    />

    <DetailItem
      label="Architecture"
      value={hardware.windows?.architecture ?? "-"}
    />

    <DetailItem
      label="Install Date"
      value={
        hardware.windows?.install_date
          ? new Date(
              Number(
                hardware.windows.install_date.match(/\d+/)?.[0]
              )
            ).toLocaleDateString("id-ID")
          : "-"
      }
    />
  </div>
</div>

{/* MOTHERBOARD */}
<div className="mb-5 rounded-xl border bg-white p-4 shadow-sm">
  <h4 className="mb-4 font-semibold">
    🔧 Motherboard
  </h4>

  <div className="grid gap-4 sm:grid-cols-2">
    <DetailItem
      label="Manufacturer"
      value={hardware.motherboard?.manufacturer ?? "-"}
    />

    <DetailItem
      label="Product"
      value={hardware.motherboard?.product ?? "-"}
    />

  </div>
</div>

{/* BIOS */}
{/* <div className="mb-5 rounded-xl border bg-white p-4 shadow-sm">
  <h4 className="mb-4 font-semibold">
    ⚙️ BIOS Information
  </h4>

  <div className="grid gap-4 sm:grid-cols-2">
    <DetailItem
      label="Manufacturer"
      value={hardware.bios?.manufacturer ?? "-"}
    />

    <DetailItem
      label="Version"
      value={hardware.bios?.version ?? "-"}
    />

    <DetailItem
      label="Release Date"
      value={
        hardware.bios?.release_date
          ? new Date(
              Number(
                hardware.bios.release_date.match(/\d+/)?.[0]
              )
            ).toLocaleDateString("id-ID")
          : "-"
      }
    />
  </div>
</div> */}

      </div>




    );
  })()
) : (
  <p className="mb-5 rounded-xl border bg-gray-50 p-4 text-sm text-gray-500">
    Belum ada data hardware hasil scan.
  </p>
)}


                <h4 className="mb-2 font-semibold">
                  Software Terpasang
                </h4>

                {peripheral.software?.some(
                  (item) => item.installed
                ) ? (
                  <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-3 text-left">
                            Nama Software
                          </th>
                          <th className="p-3 text-left">
                            Versi
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {peripheral.software
                          .filter((item) => item.installed)
                          .map((item, index) => (
                            <tr
                              key={index}
                              className="border-t"
                            >
                              <td className="p-3">
                                {item.name}
                              </td>
                              <td className="p-3">
                                {item.version || "-"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-500">
                    Belum ada software terdeteksi.
                  </p>
                )}
              </>
            );
          })()}
        </>
      ) : (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Data Peripheral belum tersedia atau belum terhubung.
        </div>
      )}
    </div>
  </>
)}
  

{/* history */}
            <div
              className="
                mt-8
              "
            >

              <h3
                className="
                  mb-4
                  text-xl
                  font-semibold
                "
              >

                History

              </h3>

              <AssetHistoryTimeline

                history={history}

              />

            </div>
            {/* history selesei */}
        </div>
{/* Footer */}
<div
  className="
    flex
    flex-wrap
    items-center
    justify-between
    gap-3
    border-t
    p-6
  "
>
  <div className="flex flex-wrap gap-2">
    {asset?.status?.name === "Maintenance" && (
      <button
        type="button"
        disabled={actionLoading}
        onClick={() => handleFinishStatus("maintenance")}
        className="
          rounded-xl
          bg-green-600
          px-4
          py-2
          font-medium
          text-white
          hover:bg-green-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {actionLoading
          ? "Memproses..."
          : "Selesai Perbaikan"}
      </button>
    )}

    {asset?.status?.name === "In Use" && (
      <button
        type="button"
        disabled={actionLoading}
        onClick={() => handleFinishStatus("use")}
        className="
          rounded-xl
          bg-blue-600
          px-4
          py-2
          font-medium
          text-white
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {actionLoading
          ? "Memproses..."
          : "Selesai Digunakan"}
      </button>
    )}
  </div>

  <button
    type="button"
    onClick={onClose}
    className="
      rounded-xl
      border
      px-5
      py-2
      hover:bg-gray-100
    "
  >
    Close
  </button>
</div>

      </div>

    </div>

  );

}