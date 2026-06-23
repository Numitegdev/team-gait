"use client";

import {

  Pencil,

  Ban,

} from "lucide-react";

interface Props {

  data: any[];

  onEdit: (
    item: any
  ) => void;

  onDeactivate: (
    id: number
  ) => void;

}

export function ChecklistItemsTable({

  data,

  onEdit,

  onDeactivate,

}: Props) {

  return (

    <div
      className="
        overflow-hidden
        rounded-xl
        border
        bg-white
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
              Nama Item
            </th>

            <th
              className="
                p-4
                text-center
              "
            >
              Status
            </th>

            <th
              className="
                p-4
                text-center
              "
            >
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {

            data.map(
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

                    {item.name}

                  </td>

                  <td
                    className="
                      p-4
                      text-center
                    "
                  >

                    {

                      item.active

                      ? (

                        <span
                          className="
                            rounded-lg
                            bg-green-100
                            px-3
                            py-1
                            text-green-700
                          "
                        >

                          Aktif

                        </span>

                      )

                      : (

                        <span
                          className="
                            rounded-lg
                            bg-red-100
                            px-3
                            py-1
                            text-red-700
                          "
                        >

                          Non Aktif

                        </span>

                      )

                    }

                  </td>

                  <td
                    className="
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        justify-center
                        gap-2
                      "
                    >

                      <button

                        onClick={() =>
                          onEdit(
                            item
                          )
                        }

                        className="
                          rounded-lg
                          bg-blue-600
                          p-2
                          text-white
                        "

                      >

                        <Pencil
                          className="
                            h-4
                            w-4
                          "
                        />

                      </button>

                      {

                        item.active && (

                          <button

                            onClick={() =>
                              onDeactivate(
                                item.id
                              )
                            }

                            className="
                              rounded-lg
                              bg-red-600
                              p-2
                              text-white
                            "

                          >

                            <Ban
                              className="
                                h-4
                                w-4
                              "
                            />

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

  );

}