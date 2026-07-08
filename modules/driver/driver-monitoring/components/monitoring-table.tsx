import {
calculateDuration,
}
from "../helpers/duration-helper";

interface Props {

  data: any[];

  onView: (
    item: any
  ) => void;

  onVerify?: (
    id: number
  ) => void;

  canVerify?: boolean;

}

function getStatusClass(
status: string
) {

switch (
status
) {


case "pending":

  return `
    bg-yellow-100
    text-yellow-700
  `;

case "on_progress":

  return `
    bg-blue-100
    text-blue-700
  `;

case "completed":

  return `
    bg-green-100
    text-green-700
  `;

default:

  return `
    bg-slate-100
  `;


}

}

export function MonitoringTable({

  data,
  onView,
  onVerify,
  canVerify,

}: Props) {

return (


<>

  {/* MOBILE */}

  <div
    className="
      divide-y
      md:hidden
    "
  >

    {

      data.map(
        (item) => (

          <div

            key={item.id}

            className="
              p-4
            "

          >

            <div
              className="
                flex
                items-start
                justify-between
                mt-1
              "
            >

              <div>

                <div
                  className="
                    font-semibold
                  "
                >

                  {item.nomor_task}

                </div>

                <div
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >

                  {
                    item.profiles
                      ?.full_name
                  }

                </div>

              </div>

               

            </div>

            <div className="flex
                items-start
                justify-between
                p-4
                ">

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



                  {item.is_verified ? (

                    <span
                      className="
                        rounded-full
                        bg-green-100
                        px-3
                        py-1
                        text-xs
                        text-green-700
                      "
                    >
                      Verified
                    </span>

                  ) : (

                    <span
                      className="
                        rounded-full
                        bg-red-100
                        px-3
                        py-1
                        text-xs
                        text-red-700
                      "
                    >
                       Not Verified
                    </span>

                  )}

                </div>


            <div className="
                mt-4
                flex
                gap-2
              "
                >

                  <button
                    onClick={() => onView(item)}
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
          Dibuat Oleh
        </th>
          <th className="p-4 text-left">
            Driver
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
            Durasi
          </th>
         
          <th className="p-4 text-left">
          Verifikasi
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

                key={item.id}

                className="
                  border-t
                  hover:bg-slate-50
                "

              >

                <td className="p-4">
                  {item.nomor_task}
                </td>

                <td className="p-4">
                  {item.creator?.full_name || "-"}
                </td>

                <td className="p-4">
                  {
                   item.driver?.full_name
                    || "-"
                  }
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

                    calculateDuration(

                      item.assigned_at,

                      item.completed_at

                    )

                  }

                </td>
                <td className="p-4">

                  {item.is_verified ? (

                    <span
                      className="
                        rounded-full
                        bg-green-100
                        px-3
                        py-1
                        text-xs
                        text-green-700
                      "
                    >
                      Verified
                    </span>

                  ) : (

                    <span
                      className="
                        rounded-full
                        bg-red-100
                        px-3
                        py-1
                        text-xs
                        text-red-700
                      "
                    >
                      Not Verified
                    </span>

                  )}

                </td>
              <td className="p-4">

                <div className="flex gap-2">

                  <button
                    onClick={() => onView(item)}
                    className="
                      rounded-lg
                      border
                      px-3
                      py-1
                    "
                  >
                    Detail
                  </button>

                  
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
