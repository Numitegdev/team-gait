"use client";

import { MaintenanceHistory }
from "../types/maintenance-history";

interface Props {

  data:
    MaintenanceHistory[];

  page: number;

  setPage: (
    page: number
  ) => void;

  totalPages: number;

  onView: (
    item: MaintenanceHistory
  ) => void;

  onDelete: (
    id: number
  ) => void;

}

export function
MaintenanceHistoryTable({

  data,

  page,
  setPage,
  totalPages,

  onView,
  onDelete,

}: Props) {

    

  return (

    <div
      className="
        overflow-x-auto
        rounded-2xl
        border
      "
    >

      <table
        className="
          w-full
          text-sm
        "
      >

        <thead>

          <tr
            className="
              bg-slate-50
              border-b
            "
          >

            <th className="p-3 text-left hidden md:table-cell">
              Tanggal
            </th>

            <th className="p-3 text-left">
              Kode PC
            </th>

            <th className="p-3 text-left hidden md:table-cell">
              Ruangan
            </th>

            <th className="p-3 text-left hidden md:table-cell">
              Teknisi
            </th>

            <th className="p-3 text-left hidden md:table-cell">
              Keluhan
            </th>

            <th className="p-3 text-left">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map((item) => (

            <tr
              key={item.id}
              className="
                border-b
              "
            >

              <td className="p-3 hidden md:table-cell">
                {item.tanggal}
              </td>

              <td className="p-3">
                {item.kode_pc}
              </td>

              <td className="p-3 hidden md:table-cell">
                {item.ruangan}
              </td>

              <td className="p-3 hidden md:table-cell">
                {item.teknisi}
              </td>

              <td className="p-3 hidden md:table-cell">
                {item.keluhan}
              </td>

              <td className="p-3">

                <div
                  className="
                    flex
                    gap-2
                  "
                >

                  <button
                    onClick={() =>
                      onView(item)
                    }
                    className="
                      rounded-lg
                      bg-blue-600
                      px-3
                      py-1
                      text-white
                    "
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      onDelete(item.id)
                    }
                    className="
                      rounded-lg
                      bg-red-600
                      px-3
                      py-1
                      text-white
                    "
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>



      </table>
<div
  className="
    border-t
    p-4
    flex
    items-center
    justify-center
    gap-4
  "
>

  <button
    disabled={page === 1}
    onClick={() =>
      setPage(page - 1)
    }
    className="
      rounded-lg
      border
      px-3
      py-1
      disabled:opacity-50
    "
  >
    Prev
  </button>

  <span>
    Page {page} / {totalPages}
  </span>

  <button
    disabled={
      page === totalPages
    }
    onClick={() =>
      setPage(page + 1)
    }
    className="
      rounded-lg
      border
      px-3
      py-1
      disabled:opacity-50
    "
  >
    Next
  </button>

</div>



    </div>

  );

}
