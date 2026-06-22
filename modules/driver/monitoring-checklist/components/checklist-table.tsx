"use client";

interface Props {

  data: any[];

  onDetail: (
    item: any
  ) => void;

}

export function ChecklistTable({

  data,

  onDetail,

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

              <th className="p-4 text-left">
                Tanggal
              </th>

              <th className="p-4 text-left">
                Plat
              </th>

              <th className="p-4 text-left hidden md:table-cell">
                Kendaraan
              </th>

              <th className="p-4 text-left hidden md:table-cell">
                Driver
              </th>

              <th className="p-4 text-center">
                Status
              </th>

              <th className="p-4 text-center">
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

                    <td className="p-4">

                      {
                        item.checklist_date
                      }

                    </td>

                    <td className="p-4">

                      {
                        item.vehicles
                          ?.plat_nomor
                      }

                    </td>

                    <td
                      className="
                        p-4
                        hidden
                        md:table-cell
                      "
                    >

                      {
                        item.vehicles
                          ?.nama_kendaraan
                      }

                    </td>

                    <td
                      className="
                        p-4
                        hidden
                        md:table-cell
                      "
                    >

                      {
                        item.profiles
                          ?.full_name
                      }

                    </td>

                    <td
                      className="
                        p-4
                        text-center
                      "
                    >

                      {

                        item.status ===
                        "verified"

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

                            Verified

                          </span>

                        )

                        : (

                          <span
                            className="
                              rounded-lg
                              bg-yellow-100
                              px-3
                              py-1
                              text-yellow-700
                            "
                          >

                            Pending

                          </span>

                        )

                      }

                    </td>

                    <td
                      className="
                        p-4
                        text-center
                      "
                    >

                      <button

                        onClick={() =>
                          onDetail(
                            item
                          )
                        }

                        className="
                          rounded-lg
                          bg-blue-600
                          px-4
                          py-2
                          text-white
                        "

                      >

                        Detail

                      </button>

                    </td>

                  </tr>

                )
              )

            }

            {

              data.length === 0 && (

                <tr>

                  <td
                    colSpan={6}
                    className="
                      p-8
                      text-center
                      text-slate-500
                    "
                  >

                    Belum ada data

                  </td>

                </tr>

              )

            }

          </tbody>

        </table>

      </div>

    </div>

  );

}