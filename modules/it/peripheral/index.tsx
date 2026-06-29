"use client";

import { useState } from "react";

import AddAddonModal from "./components/add-addon-modal";
import AddPeripheralModal from "./components/add-peripheral-modal";

import { usePeripheral } from "./hooks/use-peripheral";

import AssignAddonModal from "./components/assign-addon-modal";

import PeripheralCard from "./components/peripheral-card";

import PeripheralFilter from "./components/peripheral-filter";

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
  } = usePeripheral();
  

  const [showPeripheralModal, setShowPeripheralModal] =
    useState(false);

  const [showAddonModal, setShowAddonModal] =
    useState(false);

    const [showAssignModal, setShowAssignModal] =
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

      return (

        matchSearch &&

        matchAddon &&

        matchRoom &&

        matchNetwork

      );

      }
    );

  }, [
    peripherals,
    search,
    selectedAddon,
    selectedRoom,
selectedNetwork,
  ]);
  
  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-semibold">
          Peripheral
        </h1>

        <button
          onClick={() =>
            setShowPeripheralModal(true)
          }
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Tambah PC
        </button>

      </div>

      {/* card view */}

      <div className="border rounded-lg overflow-hidden">

      {loading ? (

  <div className="text-center py-20">

    Loading...

  </div>

) : peripherals.length === 0 ? (

  <div className="rounded-lg border p-10 text-center text-gray-500">

    Belum ada Peripheral

  </div>

) : (

  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

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
      />

    ))}

  </div>

)}

      </div>

      {/* MASTER ADDON */}

      <div>

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-semibold">
            Master Addon
          </h2>

          <button
            onClick={() =>
              setShowAddonModal(true)
            }
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Tambah Addon
          </button>

        </div>

        <div className="border rounded-lg">

          {addons.length === 0 ? (

            <div className="p-4 text-gray-500">
              Belum ada addon.
            </div>

          ) : (

            addons.map((addon) => (

              <div
                key={addon.id}
                className="flex items-center justify-between border-b p-4"
              >

                <span>
                  {addon.addon_name}
                </span>

                <button
                  onClick={() =>
                    removeAddon(addon.id)
                  }
                  className="text-red-600"
                >
                  Hapus
                </button>

              </div>

            ))

          )}

        </div>

      </div>

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

/>


      <AddPeripheralModal
        open={showPeripheralModal}
        devices={availableDevices}
        onClose={() =>
          setShowPeripheralModal(false)
        }
        onSave={addPeripheral}
      />

      <AddAddonModal
        open={showAddonModal}
        onClose={() =>
          setShowAddonModal(false)
        }
        onSave={addAddon}
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


    </div>
  );
}