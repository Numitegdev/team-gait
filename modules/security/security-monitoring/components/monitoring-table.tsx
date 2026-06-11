"use client";

import {
  format,
} from "date-fns";

interface Props {

  data: any[];

  role: string;

  onView: (
    id: number
  ) => void;

  onDelete: (
    id: number
  ) => void;

  onExportPdf: (
    id: number
  ) => void;

}

export function MonitoringTable({

  data,

  role,

  onView,

  onDelete,

  onExportPdf,

}: Props) {

  return (

    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        bg-white
      "
    >

      <div
        className="
          overflow-x-auto
        "
      >

        <table
          className="
            w-full
            text-sm
          "
        >

          <thead
            className="
              bg-slate-100
            "
          >

            <tr>

              <th
                className="
                  p-4
                  text-left
                "
              >
                Tanggal
              </th>

              <th
                className="
                  p-4
                  text-left
                  hidden md:table-cell
                "
              >
                Petugas
              </th>

              <th
                className="
                  p-4
                  text-left
                  hidden md:table-cell
                "
              >
                Shift
              </th>

              <th
                className="
                  p-4
                  text-left
                  hidden md:table-cell
                "
              >
                Catatan
              </th>

              <th
                className="
                  p-4 flex justify-center gap-2
                 
                "
              >
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map(
              (item) => (

                <tr
                  key={item.id}
                  className="
                    border-t
                  "
                >

                  <td
                    className="
                      p-4 
                    "
                  >

                    {format(

                      new Date(
                        item.tanggal
                      ),

                      "dd/MM/yyyy HH:mm"

                    )}

                  </td>

                  <td
                    className="
                      p-4
                      hidden md:table-cell
                    "
                  >

                    {item.petugas}

                  </td>

                  <td
                    className="
                      p-4
                      hidden md:table-cell
                    "
                  >

                    {item.shift}

                  </td>

                  <td
                    className="
                      p-4
                      max-w-xs
                      truncate
                      hidden md:table-cell
                    "
                  >

                    {item.catatan}

                  </td>

                  <td
                    className="
                      p-4
                      flex justify-center gap-2
                    "
                  >

                    <button

                      onClick={() =>
                        onView(
                          item.id
                        )
                      }

                      className="
                        rounded-lg
                        bg-blue-600
                        px-3
                        py-2
                        text-white
                      "
                    >

                      View

                    </button>
                  {[
                    "ga_admin",
                    "it_admin",
                  ].includes(role) && (

                   <button

                    onClick={() =>
                      onExportPdf(
                        item.id
                      )
                    }

                    className="
                      rounded-lg
                      bg-green-600
                      px-3
                      py-1
                      text-white
                    "
                  >

                    PDF

                  </button>

                  )}

                  {[
                    "ga_admin",
                    "it_admin",
                  ].includes(role) && (

                    <button
                      onClick={() =>
                        onDelete(item.id)
                      }
                      className="
                        rounded-lg
                        bg-red-500
                        px-3
                        py-1
                        text-white
                      "
                    >
                      Delete
                    </button>
                  )}

                  </td>

                </tr>

              )
            )}

            {data.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="
                    p-8
                    text-center
                    text-slate-500
                  "
                >

                  Belum ada data

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}