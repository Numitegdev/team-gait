"use client";

import { rooms } from "../constants/room-options";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  selectedRoom: string;
  setSelectedRoom: (
    value: string
  ) => void;

  selectedNetwork: string;
  setSelectedNetwork: (
    value: string
  ) => void;
}

export function IPManagementFilters({
  search,
  setSearch,

  selectedRoom,
  setSelectedRoom,

  selectedNetwork,
  setSelectedNetwork,
}: Props) {
  return (
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
          setSearch(
            e.target.value
          )
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
          setSelectedRoom(
            e.target.value
          )
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
          setSelectedNetwork(
            e.target.value
          )
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
  );
}