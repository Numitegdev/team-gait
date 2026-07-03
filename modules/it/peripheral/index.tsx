"use client";

import { useState , useEffect} from "react";
import {
  Addon,
  AvailableDevice,
  Peripheral,
} from "./types/peripheral.types";
import HardwareDetailModal
from "./components/Hardware-Detail-Modal";
import AddPeripheralModal from "./components/add-peripheral-modal";

import { usePeripheral } from "./hooks/use-peripheral";

import AssignAddonModal from "./components/assign-addon-modal";

import PeripheralCard from "./components/peripheral-card";
import UploadScannerModal from "./components/upload-scanner-modal";
import PeripheralFilter from "./components/peripheral-filter";
import AddonManagerModal from "./components/addon-manager-modal";
import { parseCPU } from "./services/cpu-parser";
import { useMemo } from "react";
export default function PeripheralPage() {
  const {
    loading,

    peripherals,

    availableDevices,

    addons,

    addPeripheral,

    addAddon,

    removeAddon,

    addAddonToPeripheral,
    removeAddonFromPeripheral,

    removePeripheral,

    loadPeripherals

  } = usePeripheral();
  

  const [showPeripheralModal, setShowPeripheralModal] =
    useState(false);

  const [showAddonModal, setShowAddonModal] =
    useState(false);

    const [showAssignModal, setShowAssignModal] =
  useState(false);
const [showUploadModal, setShowUploadModal] =
  useState(false);
  
const [selectedPeripheral, setSelectedPeripheral] =
  useState<number | null>(null);

  const [search, setSearch] =
  useState("");

const [selectedAddon, setSelectedAddon] =
  useState("");

const [selectedRoom, setSelectedRoom] =
  useState("");

const [selectedNetwork, setSelectedNetwork] =
  useState("");

  const [selectedCPU, setSelectedCPU] =
  useState("");

  const [sortBy, setSortBy] =
  useState("default");

  const [selectedRAM, setSelectedRAM] =
  useState("");

const [selectedDDR, setSelectedDDR] =
  useState("");

  const [selectedWindows, setSelectedWindows] =
  useState("");

const [selectedScan, setSelectedScan] =
  useState("all");

  const rooms = useMemo(() => {

  return Array.from(

    new Set(

      peripherals.map(
        p => p.ip_management.ruangan
      )

    )

  ).sort();

}, [peripherals]);


const networks = useMemo(() => {

  return Array.from(

    new Set(

      peripherals.map(
        p => p.ip_management.jenis_network
      )

    )

  ).sort();

}, [peripherals]);

  const [selectedSoftware, setSelectedSoftware] =
  useState("all");

  const PAGE_SIZE = 12;

const [page, setPage] =
  useState(1);

const filteredPeripherals = useMemo(() => {

  const result = peripherals.filter((item) => {
// console.log("MASUK FILTER");
// console.log(peripherals);
    const keyword = search.toLowerCase();

    // console.log(
//   item.ip_management,
//   item.hardware,
//   item.software
// );

const matchSearch =
(item.ip_management?.device ?? "")
  .toLowerCase()
  .includes(keyword)
||
(item.ip_management?.ip_terkini ?? "")
  .toLowerCase()
  .includes(keyword)
||
(item.ip_management?.ruangan ?? "")
  .toLowerCase()
  .includes(keyword)
||
(item.ip_management?.jenis_network ?? "")
  .toLowerCase()
  .includes(keyword);

    const matchAddon =

      selectedAddon === ""

      ||

      item.peripheral_device_addons.some(

        (addon) =>

          addon.addon.id ===
          Number(selectedAddon)

      );

    const matchRoom =

      selectedRoom === ""

      ||

      item.ip_management.ruangan
        .trim()
        .toLowerCase() ===

      selectedRoom
        .trim()
        .toLowerCase();

    const matchNetwork =

      selectedNetwork === ""

      ||

      item.ip_management.jenis_network
        .trim()
        .toLowerCase() ===

      selectedNetwork
        .trim()
        .toLowerCase();

    const matchSoftware =

      selectedSoftware === "all"

      ||

      item.software?.some(

        (software) =>

          software.name === selectedSoftware &&

          software.installed

      );

    const parsedCPU =
      parseCPU(
        item.hardware?.cpu?.model ?? ""
      );

    const matchCPU =

      selectedCPU === ""

      ||

      parsedCPU.family === selectedCPU;


     const ramGB =
        item.hardware?.memory?.total_gb ?? 0;

      const matchRAM =

        selectedRAM === ""

        ||

        ramGB >= Number(selectedRAM);

   const matchDDR =

  selectedDDR === ""

  ||

  item.hardware?.memory?.modules?.some(

    (module) =>

     module.type
  ?.toUpperCase()
  .includes(selectedDDR.toUpperCase())

  );

const windowsName =
  item.hardware?.windows?.name ?? "";

const matchWindows =

  selectedWindows === ""

  ||

  windowsName.includes(
    selectedWindows
  );

const matchScan =

  selectedScan === "all"

  ||

  (
    selectedScan === "scanned"
      ? !!item.last_scan_at
      : !item.last_scan_at
  );

//   console.log({
//   device: item.ip_management.device,
//   matchSearch,
//   matchAddon,
//   matchRoom,
//   matchNetwork,
//   matchSoftware,
//   matchCPU,
//   matchRAM,
//   matchDDR,
//   matchWindows,
//   matchScan,
// });

   return (

    matchSearch &&

    matchAddon &&

    matchRoom &&

    matchNetwork &&

    matchSoftware &&

    matchCPU &&

    matchRAM &&

    matchDDR &&

    matchWindows &&

    matchScan

);

  });

  // ======================
  // SORT
  // ======================

  switch (sortBy) {

    case "score_desc":

      result.sort(
        (a, b) =>
          (b.score ?? 0) -
          (a.score ?? 0)
      );

      break;

    case "score_asc":

      result.sort(
        (a, b) =>
          (a.score ?? 0) -
          (b.score ?? 0)
      );

      break;

    case "latest_scan":

      result.sort(
        (a, b) =>
          new Date(b.last_scan_at ?? "").getTime() -
          new Date(a.last_scan_at ?? "").getTime()
      );

      break;

    case "oldest_scan":

      result.sort(
        (a, b) =>
          new Date(a.last_scan_at ?? "").getTime() -
          new Date(b.last_scan_at ?? "").getTime()
      );

      break;

  }

  return result;

}, [
  peripherals,
  search,
  selectedAddon,
  selectedRoom,
  selectedNetwork,
  selectedSoftware,
  selectedCPU,
  sortBy,
  selectedRAM,
  selectedDDR,
  selectedWindows,
  selectedScan,
]);


useEffect(() => {

  setPage(1);

}, [

  search,

  selectedAddon,

  selectedRoom,

  selectedNetwork,

  selectedSoftware,

  selectedCPU,

  selectedRAM,

  selectedDDR,

  selectedWindows,

  selectedScan,

  sortBy

]);
  

const [showDetailModal, setShowDetailModal] =
  useState(false);

const [selectedDetail, setSelectedDetail] =
  useState<Peripheral | null>(null);

  const totalPages = Math.max(
  1,
  Math.ceil(
    filteredPeripherals.length /
    PAGE_SIZE
  )
);
 
const paginatedPeripherals =
  filteredPeripherals.slice(

    (page - 1) * PAGE_SIZE,

    page * PAGE_SIZE

  );
  

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}

<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

  <div>

    <h1 className="text-3xl font-bold tracking-tight">
      PC Add on List
    </h1>

    <p className="mt-1 text-sm text-gray-500">
      Kelola perangkat komputer, addon, dan hasil scanner hardware.
    </p>

  </div>

  <div className="flex gap-3">
    <button
      onClick={() => {
        window.open("/scanner/Scanner-v1.0.0.zip", "_blank");
      }}
      className="rounded-lg bg-green-600 px-4 py-2 text-white"
    >
      Download Scanner
    </button>

    <button
      onClick={() =>
        setShowAddonModal(true)
      }
      className="rounded-lg border px-4 py-2 hover:bg-gray-50"
    >
      Kelola Addon
    </button>

    <button
      onClick={() =>
        setShowPeripheralModal(true)
      }
      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      + Tambah PC
    </button>

  </div>

</div>

          {/* filter */}
<div className="rounded-xl border bg-white p-5 shadow-sm">
        <PeripheralFilter

                search={search}

                selectedAddon={selectedAddon}

                selectedRoom={selectedRoom}

                selectedNetwork={selectedNetwork}

                addons={addons}

                rooms={rooms}

                networks={networks}

                onSearchChange={setSearch}

                onAddonChange={setSelectedAddon}

                onRoomChange={setSelectedRoom}

                onNetworkChange={setSelectedNetwork}

                onReset={() => {

                  setSearch("");

                  setSelectedAddon("");

                  setSelectedRoom("");

                  setSelectedNetwork("");

                  setSelectedCPU("");

                  setSelectedRAM("");

                  setSelectedDDR("");

                  setSelectedWindows("");

                  setSelectedSoftware("all");

                  setSelectedScan("all");

                }}

                 selectedSoftware={selectedSoftware}
                  onSoftwareChange={setSelectedSoftware}

                  selectedCPU={selectedCPU}

                  onCPUChange={setSelectedCPU}

                  sortBy={sortBy}
                  
                  onSortChange={setSortBy}

                  selectedRAM={selectedRAM}

                  selectedDDR={selectedDDR}

                  onRAMChange={setSelectedRAM}

                  onDDRChange={setSelectedDDR}

                  selectedWindows={selectedWindows}

                  onWindowsChange={setSelectedWindows}

                  selectedScan={selectedScan}

                  onScanChange={setSelectedScan}

                />
</div>
                {/* jumlah data  */}
              <div className="flex items-center justify-between">

  <div className="text-sm text-gray-500">

    Menampilkan

    <span className="mx-1 font-semibold">

      {filteredPeripherals.length === 0
        ? 0
        : (page - 1) * PAGE_SIZE + 1}

    </span>

    -

    <span className="mx-1 font-semibold">

      {Math.min(
        page * PAGE_SIZE,
        filteredPeripherals.length
      )}

    </span>

    dari

    <span className="mx-1 font-semibold text-black">

      {filteredPeripherals.length}

    </span>

    Peripheral

  </div>

</div>

      {/* card view */}

      <div >

      {loading ? (

  <div className="text-center py-20">

    Loading...

  </div>

) : peripherals.length === 0 ? (

  <div className="rounded-lg border p-10 text-center text-gray-500">

    Belum ada Peripheral

  </div>

) : (

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

    {paginatedPeripherals.map((item) => (

     <PeripheralCard
        key={item.id}
        peripheral={item}
        addons={addons}
        onAssignAddon={(id) => {
            setSelectedPeripheral(id);
            setShowAssignModal(true);
        }}
        onRemovePeripheral={removePeripheral}
        onRemoveAddon={removeAddonFromPeripheral}
        onUploadScanner={(id) => {
            setSelectedPeripheral(id);
            setShowUploadModal(true);
        }}

        onDetail={(peripheral) => {

            setSelectedDetail(peripheral);

            setShowDetailModal(true);

        }}
        
    />

    ))}

  </div>

)}
<div className="mt-8 flex items-center justify-center gap-2">

  <button

    disabled={page === 1}

    onClick={() =>

      setPage(page - 1)

    }

    className="rounded border px-3 py-2 disabled:opacity-40"

  >

    ←

  </button>

  {Array.from(
    { length: totalPages },
    (_, i) => (

      <button

        key={i}

        onClick={() =>
          setPage(i + 1)
        }

        className={`rounded px-3 py-2 border

          ${page === i + 1

            ? "bg-blue-600 text-white"

            : "bg-white"

          }`}

      >

        {i + 1}

      </button>

    )
  )}

  <button

    disabled={page === totalPages}

    onClick={() =>

      setPage(page + 1)

    }

    className="rounded border px-3 py-2 disabled:opacity-40"

  >

    →

  </button>

</div>
      </div>

     <HardwareDetailModal
  open={showDetailModal}
  peripheral={selectedDetail}
  onClose={() => {
    setShowDetailModal(false);
    setSelectedDetail(null);
  }}
/>


      <AddPeripheralModal
        open={showPeripheralModal}
        devices={availableDevices}
        onClose={() =>
          setShowPeripheralModal(false)
        }
        onSave={addPeripheral}
      />

    <AddonManagerModal
      open={showAddonModal}
      addons={addons}
      onClose={() =>
        setShowAddonModal(false)
      }
      onAdd={addAddon}
      onDelete={removeAddon}
    />

      <AssignAddonModal
          open={showAssignModal}
          addons={addons}
          onClose={() => {

            setShowAssignModal(false);

            setSelectedPeripheral(null);

          }}
          onSave={async (addonIds) => {

            if (!selectedPeripheral) return;

            for (const addonId of addonIds) {

              await addAddonToPeripheral(
                selectedPeripheral,
                addonId
              );

            }

            setShowAssignModal(false);

            setSelectedPeripheral(null);

          }}
        />

        <UploadScannerModal

        open={showUploadModal}

        peripheralId={selectedPeripheral}

        onClose={() =>
          setShowUploadModal(false)
        }

        onSuccess={() =>
          loadPeripherals()
        }

      />


    </div>
  );
}