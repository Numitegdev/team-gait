"use client";

interface Props {

  search: string;

  setSearch: (
    value: string
  ) => void;

  room: string;

  setRoom: (
    value: string
  ) => void;

  technician: string;

  setTechnician: (
    value: string
  ) => void;

  date: string;

  setDate: (
    value: string
  ) => void;

}

export function MaintenanceHistoryFilter({

  search,
  setSearch,

  room,
  setRoom,

  technician,
  setTechnician,

  date,
  setDate,

}: Props) {

  return (

    <div
      className="
        mb-6
        grid
        gap-3
        md:grid-cols-4
      "
    >

      <input
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        placeholder="
          Cari Kode PC
        "
        className="
          rounded-xl
          border
          p-3
        "
      />

      <input
        value={room}
        onChange={(e) =>
          setRoom(
            e.target.value
          )
        }
        placeholder="
          Cari Ruangan
        "
        className="
          rounded-xl
          border
          p-3
        "
      />

      <input
        value={technician}
        onChange={(e) =>
          setTechnician(
            e.target.value
          )
        }
        placeholder="
          Cari Teknisi
        "
        className="
          rounded-xl
          border
          p-3
        "
      />

      <input
        type="date"
        value={date}
        onChange={(e) =>
          setDate(
            e.target.value
          )
        }
        className="
          rounded-xl
          border
          p-3
        "
      />

    </div>

  );

}