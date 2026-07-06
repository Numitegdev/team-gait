"use client";

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

  selectedCPU: string;

  selectedRAM: string;

selectedDDR: string;

selectedWindows: string;

 selectedScan: string;

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

 


onCPUChange: (value: string) => void;

   onSoftwareChange:(value:string)=>void;

   sortBy: string;

onSortChange: (
    value: string
)=>void;

onRAMChange: (value: string) => void;

onDDRChange: (value: string) => void;


onWindowsChange: (
  value: string
) => void;

 onReset: () => void;

onScanChange: (
  value: string
) => void;

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

selectedCPU,
onCPUChange,

sortBy,
onSortChange,

selectedRAM,
onRAMChange,

selectedDDR ,
onDDRChange ,
selectedWindows ,
onWindowsChange,

selectedScan , 
onScanChange

}: Props) {


 const softwareOptions = [

  "Accurate 5",
  "Accurate 4",
  "SQL Server",
  "Otomax Server",
  "AnyDesk",
  "UltraViewer",

];

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

    value={selectedCPU}

    onChange={(e)=>

        onCPUChange(e.target.value)

    }

    className="rounded-lg border px-3 py-2"

>

  <option value="">
    Semua Processor
</option>

<optgroup label="Intel">

<option value="i3">
    Intel Core i3
</option>

<option value="i5">
    Intel Core i5
</option>

<option value="i7">
    Intel Core i7
</option>

<option value="i9">
    Intel Core i9
</option>

</optgroup>

<optgroup label="AMD">

<option value="Ryzen 3">
    Ryzen 3
</option>

<option value="Ryzen 5">
    Ryzen 5
</option>

<option value="Ryzen 7">
    Ryzen 7
</option>

<option value="Ryzen 9">
    Ryzen 9
</option>

</optgroup>

<optgroup label="Server">

<option value="Xeon">
    Intel Xeon
</option>

</optgroup>

</select>

<select
  value={selectedRAM}
  onChange={(e) =>
    onRAMChange(e.target.value)
  }

   className="rounded-lg border px-3 py-2"
>
  <option value="">
    Semua RAM
  </option>

  <option value="8">
    8 GB+
  </option>

  <option value="16">
    16 GB+
  </option>

  <option value="32">
    32 GB+
  </option>

  <option value="64">
    64 GB+
  </option>

</select>

<select
  value={selectedDDR}
  onChange={(e) =>
    onDDRChange(e.target.value)
  }

   className="rounded-lg border px-3 py-2"
>

<option value="">
Semua DDR
</option>

<option value="DDR3">
DDR3
</option>

<option value="DDR4">
DDR4
</option>

<option value="DDR5">
DDR5
</option>

</select>

<select
  value={selectedWindows}
  onChange={(e) =>
    onWindowsChange(e.target.value)
  }
  className="rounded-lg border px-3 py-2"
>

  <option value="">
    Semua Windows
  </option>

  <option value="Windows 11">
    Windows 11
  </option>

  <option value="Windows 10">
    Windows 10
  </option>

  <option value="Windows Server">
    Windows Server
  </option>

</select>

<select
    value={selectedSoftware}
    onChange={(e) =>
        onSoftwareChange(e.target.value)
    }
       className="rounded-lg border px-3 py-2"
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
     className="rounded-lg border px-3 py-2"
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
     className="rounded-lg border px-3 py-2"
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


  {/* short nilai tertinggi ke rendah dan sebaliknya */}

  <select
    value={sortBy}
    onChange={(e)=>
        onSortChange(e.target.value)
    }
    className="rounded-lg border px-3 py-2"
  >

    <option value="default">
        Urutan Default
    </option>

    <option value="score_desc">
        ⭐ Score Tertinggi
    </option>

    <option value="score_asc">
        ⭐ Score Terendah
    </option>

    <option value="latest_scan">
        Scan Terbaru
    </option>

    <option value="oldest_scan">
        Scan Terlama
    </option>

    </select>

    <select
  value={selectedScan}
  onChange={(e) =>
    onScanChange(e.target.value)
  }
  className="rounded-lg border px-3 py-2"
>

  <option value="all">
    Semua Scan
  </option>

  <option value="scanned">
    Sudah Scan
  </option>

  <option value="not_scanned">
    Belum Scan
  </option>

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