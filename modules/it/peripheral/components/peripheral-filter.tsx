"use client";
import { useEffect, useState } from "react";
import { Addon } from "../types/peripheral.types";

interface Props {

  search: string;

  selectedAddon: string;

  selectedRoom: string;

  selectedNetwork: string;

  addons: Addon[];

  rooms: string[];

  networks: string[];

  selectedSoftware: string;

  onSearchChange: (
    value: string
  ) => void;

  onAddonChange: (
    value: string
  ) => void;

  onRoomChange: (
    value: string
  ) => void;

  onNetworkChange: (
    value: string
  ) => void;

  onReset: () => void;



   onSoftwareChange:(value:string)=>void;
}
export default function PeripheralFilter({

search,

selectedAddon,

selectedRoom,

selectedNetwork,

addons,

rooms,

networks,

onSearchChange,

onAddonChange,

onRoomChange,

onNetworkChange,

onReset,

selectedSoftware,

onSoftwareChange,

}: Props) {


 const softwareOptions = [

  "Accurate 5",
  "Accurate 4",
  "SQL Server",
  "Otomax Server",
  "AnyDesk",
  "UltraViewer",

];

const [software, setSoftware] =
  useState("all");

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

  {/* SEARCH */}

  <input
    value={search}
    onChange={(e)=>
      onSearchChange(
        e.target.value
      )
    }
    placeholder="Cari Device / IP / Ruangan..."
    className="rounded-lg border px-3 py-2"
  />

  {/* ADDON */}

  <select
    value={selectedAddon}
    onChange={(e)=>
      onAddonChange(
        e.target.value
      )
    }
    className="rounded-lg border px-3 py-2"
  >

    <option value="">
      Semua Addon
    </option>

    {addons.map(a=>(

      <option
        key={a.id}
        value={a.id}
      >

        {a.addon_name}

      </option>

    ))}

  </select>

<select
    value={selectedSoftware}
    onChange={(e) =>
        onSoftwareChange(e.target.value)
    }
>
    <option value="all">
        Semua Software
    </option>

    {softwareOptions.map((item) => (
        <option
            key={item}
            value={item}
        >
            {item}
        </option>
    ))}
</select>

  <select
  value={selectedRoom}
  onChange={(e) => {
    console.log("ROOM :", e.target.value);
    onRoomChange(e.target.value);
  }}
>

    <option value="">
      Semua Ruangan
    </option>

    {rooms.map(room=>(

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
  onChange={(e) => {
    console.log("Network :", e.target.value);
      onNetworkChange(e.target.value);
  }}
>

    <option value="">
      Semua Network
    </option>

    {networks.map(network=>(

      <option
        key={network}
        value={network}
      >

        {network}

      </option>

    ))}

  </select>

  {/* RESET */}

  <button
    onClick={onReset}
    className="rounded-lg bg-gray-200 px-4 py-2"
  >

    Reset Filter

  </button>

</div>
  );
}