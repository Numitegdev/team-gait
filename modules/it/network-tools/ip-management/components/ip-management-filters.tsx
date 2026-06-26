"use client";

import { rooms } from "../constants/room-options";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  selectedRoom: string;
  setSelectedRoom: (value: string) => void;

  selectedNetwork: string;
  setSelectedNetwork: (value: string) => void;

  selectedISPUtama: string;
  setSelectedISPUtama: (value: string) => void;

  selectedISPBackup: string;
  setSelectedISPBackup: (value: string) => void;

  ispUtamaOptions: string[];
  ispBackupOptions: string[];
}

export function IPManagementFilters({

  search,
  setSearch,

  selectedRoom,
  setSelectedRoom,

  selectedNetwork,
  setSelectedNetwork,

  selectedISPUtama,
  setSelectedISPUtama,

  selectedISPBackup,
  setSelectedISPBackup,

  ispUtamaOptions,
  ispBackupOptions,

}: Props) {
  return (
 <div className="space-y-4">

  {/* Baris 1 */}
  <div
    className="
      grid
      gap-4
      md:grid-cols-3
    "
  >
    {/* Search */}
    <input
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      placeholder="Cari device atau IP..."
      className="
        h-11
        rounded-xl
        border
        px-4
        outline-none
        focus:border-blue-500
      "
    />

    {/* Room */}
    <select
      value={selectedRoom}
      onChange={(e) =>
        setSelectedRoom(e.target.value)
      }
      className="
        h-11
        rounded-xl
        border
        px-4
      "
    >
      <option value="">
        Semua Ruangan
      </option>

      {rooms.map((room) => (
        <option
          key={room}
          value={room}
        >
          {room}
        </option>
      ))}
    </select>

    {/* Network */}
    <select
      value={selectedNetwork}
      onChange={(e) =>
        setSelectedNetwork(e.target.value)
      }
      className="
        h-11
        rounded-xl
        border
        px-4
      "
    >
      <option value="">
        Semua Network
      </option>

      <option value="Network Office">
        Network Office
      </option>

      <option value="Network Server">
        Network Server
      </option>
    </select>
  </div>

  {/* Baris 2 */}
  <div
    className="
      grid
      gap-4
      md:grid-cols-3
    "
  >
    {/* ISP Utama */}
    <select
      value={selectedISPUtama}
      onChange={(e) =>
        setSelectedISPUtama(e.target.value)
      }
      className="
        h-11
        rounded-xl
        border
        px-4
      "
    >
      <option value="">
        Semua ISP Utama
      </option>

      {ispUtamaOptions.map((isp) => (
        <option
          key={isp}
          value={isp}
        >
          {isp}
        </option>
      ))}
    </select>

    {/* ISP Backup */}
    <select
      value={selectedISPBackup}
      onChange={(e) =>
        setSelectedISPBackup(e.target.value)
      }
      className="
        h-11
        rounded-xl
        border
        px-4
      "
    >
      <option value="">
        Semua ISP Backup
      </option>

      {ispBackupOptions.map((isp) => (
        <option
          key={isp}
          value={isp}
        >
          {isp}
        </option>
      ))}
    </select>

    {/* Kolom kosong agar sejajar */}
    <div />
  </div>

</div>
  );
}