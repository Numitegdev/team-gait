"use client";

import { useState } from "react";
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

const filteredPeripherals =
  useMemo(() => {

    return peripherals.filter(
      (item) => {

        const keyword =
          search.toLowerCase();

        const matchSearch =

          item.ip_management.device
            .toLowerCase()
            .includes(keyword)

          ||

          item.ip_management.ip_terkini
            .toLowerCase()
            .includes(keyword)

          ||

          item.ip_management.ruangan
            .toLowerCase()
            .includes(keyword)

          ||

          item.ip_management.jenis_network
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
  selectedRoom === "" ||
  item.ip_management.ruangan.trim().toLowerCase() ===
    selectedRoom.trim().toLowerCase();

const matchNetwork =
  selectedNetwork === "" ||
  item.ip_management.jenis_network.trim().toLowerCase() ===
    selectedNetwork.trim().toLowerCase();
 
    const matchSoftware =

  selectedSoftware === "all"

  ||

  item.software?.some(

    (software) =>

      software.name === selectedSoftware &&

      software.installed

  );
      
  return (

        matchSearch &&

        matchAddon &&

        matchRoom &&

       matchNetwork &&

    matchSoftware


      );

    

      }
    );

  }, [
  peripherals,
  search,
  selectedAddon,
  selectedRoom,
  selectedNetwork,
  selectedSoftware,
]);
  
const [showDetailModal, setShowDetailModal] =
  useState(false);

const [selectedDetail, setSelectedDetail] =
  useState<Peripheral | null>(null);
  
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

                }}

                 selectedSoftware={selectedSoftware}
                  onSoftwareChange={setSelectedSoftware}

                />
</div>
                {/* jumlah data  */}
              <div className="flex items-center justify-between">

                  <div className="text-sm text-gray-500">

                      Menampilkan

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

    {filteredPeripherals.map((item) => (

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