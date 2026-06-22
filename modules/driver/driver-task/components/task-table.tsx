"use client";

import {
format,
}
from "date-fns";

interface Props {

data: any[];

onView: (
id: number
) => void;

onStart: (
id: number
) => void;

}

function getStatusClass(
status: string
) {

switch (status) {


case "pending":
  return "bg-yellow-100 text-yellow-700";

case "on_progress":
  return "bg-blue-100 text-blue-700";

case "completed":
  return "bg-green-100 text-green-700";

default:
  return "bg-slate-100 text-slate-700";


}

}

export function TaskTable({

data,

onView,

onStart,

}: Props) {

return (


<>

  {/* MOBILE */}

  <div
    className="
      space-y-3
      p-4
      md:hidden
    "
  >

    {

      data.map(
        (item) => (

          <div

            key={
              item.id
            }

            className="
              rounded-xl
              border
              p-4
            "

          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <div
                  className="
                    font-semibold
                  "
                >

                  {
                    item.nomor_task
                  }

                </div>

                <div
                  className="
                    text-xs
                    text-slate-500
                  "
                >

                  {

                    format(

                      new Date(
                        item.created_at
                      ),

                      "dd/MM/yyyy HH:mm"

                    )

                  }

                </div>

              </div>

              <span

                className={`
                  rounded-full
                  px-3
                  py-1
                  text-xs
                  font-medium
                  ${getStatusClass(
                    item.status
                  )}
                `}

              >

                {item.status}

              </span>

            </div>

            <div
              className="
                mt-4
                flex
                gap-2
              "
            >

              <button

                onClick={() =>
                  onView(
                    item.id
                  )
                }

                className="
                  flex-1
                  rounded-lg
                  bg-blue-600
                  px-3
                  py-2
                  text-white
                "

              >

                Detail

              </button>

              {

                item.status ===
                  "pending" && (

                  <button

                    onClick={() =>
                      onStart(
                        item.id
                      )
                    }

                    className="
                      flex-1
                      rounded-lg
                      bg-green-600
                      px-3
                      py-2
                      text-white
                    "

                  >

                    Kerjakan

                  </button>

                )

              }

            </div>

          </div>

        )
      )

    }

  </div>

  {/* DESKTOP */}

  <div
    className="
      hidden
      overflow-x-auto
      md:block
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
          bg-slate-50
        "
      >

        <tr>

          <th className="p-4 text-left">
            No Task
          </th>

          <th className="p-4 text-left">
            Jenis
          </th>

          <th className="p-4 text-left">
            Kirim Ke
          </th>

          <th className="p-4 text-left">
            Ambil dari
          </th>

          <th className="p-4 text-left">
            Status
          </th>

          <th className="p-4 text-left">
            Tanggal
          </th>

          <th className="p-4 text-left">
            Action
          </th>

        </tr>

      </thead>

      <tbody>

        {

          data.map(
            (item) => (

              <tr

                key={
                  item.id
                }

                className="
                  border-t
                  hover:bg-slate-50
                "

              >

                <td className="p-4 font-medium">
                  {item.nomor_task}
                </td>

                <td className="p-4">
                  {item.jenis}
                </td>

                <td className="p-4">
                  {item.pengirim}
                </td>

                <td className="p-4">
                  {item.penerima}
                </td>

                <td className="p-4">

                  <span

                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-xs
                      font-medium
                      ${getStatusClass(
                        item.status
                      )}
                    `}

                  >

                    {item.status}

                  </span>

                </td>

                <td className="p-4">

                  {

                    format(

                      new Date(
                        item.created_at
                      ),

                      "dd/MM/yyyy HH:mm"

                    )

                  }

                </td>

                <td className="p-4">

                  <div
                    className="
                      flex
                      gap-2
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

                      Detail

                    </button>

                    {

                      item.status ===
                        "pending" && (

                        <button

                          onClick={() =>
                            onStart(
                              item.id
                            )
                          }

                          className="
                            rounded-lg
                            bg-green-600
                            px-3
                            py-2
                            text-white
                          "

                        >

                          Kerjakan

                        </button>

                      )

                    }

                  </div>

                </td>

              </tr>

            )
          )

        }

      </tbody>

    </table>

  </div>

</>


);

}
