"use client";

import {
calculateDuration,
}
from "../helpers/duration-helper";

interface Props {

open: boolean;

data: any;

onClose: () => void;

  onVerify?: (
    id: number
  ) => void;

  canVerify?: boolean;

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


export function MonitoringDetailModal({

open,

data,

onClose,

  onVerify,
  canVerify,

}: Props) {

if (
!open ||
!data
)
return null;

return (


<div
  className="
    fixed
    inset-0
    z-50
    flex
    items-center
    justify-center
    bg-black/50
    p-4
  "
>

  <div
    className="
      w-full
      max-w-6xl
      max-h-[90vh]
      overflow-y-auto
      rounded-2xl
      bg-white
      shadow-2xl
    "
  >

    {/* HEADER */}

    <div
      className="
        sticky
        top-0
        z-10
        flex
        items-center
        justify-between
        border-b
        bg-white
        px-6
        py-4
      "
    >

      <div>

        <h2
          className="
            text-2xl
            font-bold
          "
        >

          {data.nomor_task}

        </h2>

        <p
          className="
            text-sm
            text-slate-500
          "
        >

          Driver Monitoring Detail

        </p>

      </div>

      <button

        onClick={onClose}

        className="
          rounded-lg
          border
          px-4
          py-2
        "

      >

        Tutup

      </button>

    </div>

    <div
      className="
        p-6
        space-y-6
      "
    >

      {/* SUMMARY */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-3
        "
      >

        <div
          className="
            rounded-xl
            border
            p-4
          "
        >

          <div
            className="
              text-sm
              text-slate-500
            "
          >

            Driver

          </div>

          <div
            className="
              mt-1
              font-semibold
            "
          >

            {
              data.profiles
                ?.full_name
              || "-"
            }

          </div>

        </div>

        <div
          className="
            rounded-xl
            border
            p-4
          "
        >

          <div
            className="
              text-sm
              text-slate-500
            "
          >

            Status

          </div>

          <div className="mt-2">

            <span

              className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-medium
                ${getStatusClass(
                  data.status
                )}
              `}

            >

              {data.status}

            </span>

          </div>

        </div>

        <div
          className="
            rounded-xl
            border
            p-4
          "
        >

          <div
            className="
              text-sm
              text-slate-500
            "
          >

            Durasi

          </div>

          <div
            className="
              mt-1
              font-semibold
            "
          >

            {

              calculateDuration(

                data.assigned_at,

                data.completed_at

              )

            }

          </div>

        </div>

      </div>

      {/* INFORMASI TASK */}

      <div
        className="
          rounded-xl
          border
          p-5
        "
      >

        <h3
          className="
            mb-4
            text-lg
            font-semibold
          "
        >

          Informasi Task

        </h3>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >

          <div>

            <div
              className="
                text-sm
                text-slate-500
              "
            >

              Jenis

            </div>

            <div>
              {data.jenis}
            </div>

          </div>

          <div>

            <div
              className="
                text-sm
                text-slate-500
              "
            >

              Pengirim

            </div>

            <div>
              {data.pengirim}
            </div>

          </div>

          <div>

            <div
              className="
                text-sm
                text-slate-500
              "
            >

              Penerima

            </div>

            <div>
              {data.penerima}
            </div>

          </div>

          <div>

            <div
              className="
                text-sm
                text-slate-500
              "
            >

              Nomor Resi

            </div>

            <div>
              {data.nomor_resi}
            </div>

          </div>

          {/* payment */}
          <div>

              <div
                className="
                  text-sm
                  text-slate-500
                "
              >
                Payment
              </div>

              <div>

                {data.payment_type === "none" && (
                  <span>Tidak Ada Payment</span>
                )}

                {data.payment_type === "tempo" && (
                  <span>Tempo</span>
                )}

                {data.payment_type === "cash" && (
                  <span>
                    Cash - Rp{" "}
                    {Number(
                      data.cash_amount || 0
                    ).toLocaleString("id-ID")}
                  </span>
                )}

              </div>

            </div>

        </div>

      </div>

      {/* WAKTU */}

      <div
        className="
          rounded-xl
          border
          p-5
        "
      >

        <h3
          className="
            mb-4
            text-lg
            font-semibold
          "
        >

          Waktu Proses

        </h3>

        <div
          className="
            space-y-3
          "
        >

          <div>

            <span className="text-slate-500">
              Created :
            </span>

            {" "}

            {

              data.created_at &&

              new Date(
                data.created_at
              ).toLocaleString(
                "id-ID"
              )

            }

          </div>

          <div>

            <span className="text-slate-500">
              Assigned :
            </span>

            {" "}

            {

              data.assigned_at &&

              new Date(
                data.assigned_at
              ).toLocaleString(
                "id-ID"
              )

            }

          </div>

          <div>

            <span className="text-slate-500">
              Completed :
            </span>

            {" "}

            {

              data.completed_at &&

              new Date(
                data.completed_at
              ).toLocaleString(
                "id-ID"
              )

            }

          </div>

        </div>

      </div>

      {/* FOTO */}

      {

        (
          data.task_photo_url ||
          data.completion_photo_url
        ) && (

          <div
            className="
              rounded-xl
              border
              p-5
            "
          >

            <h3
              className="
                mb-4
                text-lg
                font-semibold
              "
            >

              Dokumentasi

            </h3>

            <div
              className="
                grid
                gap-4
                md:grid-cols-2
              "
            >

              {

                data.task_photo_url && (

                  <div>

                    <div
                      className="
                        mb-2
                        font-medium
                      "
                    >

                      Foto Barang

                    </div>

                    <img

                      src={
                        data.task_photo_url
                      }

                      alt=""

                      className="
                        max-h-[400px]
                        w-full
                        rounded-xl
                        border
                        bg-slate-50
                        object-contain
                      "

                    />

                  </div>

                )

              }

              {

                data.completion_photo_url && (

                  <div>

                    <div
                      className="
                        mb-2
                        font-medium
                      "
                    >

                      Foto Penyelesaian

                    </div>

                    <img

                      src={
                        data.completion_photo_url
                      }

                      alt=""

                      className="
                        max-h-[400px]
                        w-full
                        rounded-xl
                        border
                        bg-slate-50
                        object-contain
                      "

                    />

                  </div>

                )

              }

            </div>

          </div>

        )

      }

      {/* TIMELINE */}

      <div
        className="
          rounded-xl
          border
          p-5
        "
      >

        <h3
          className="
            mb-4
            text-lg
            font-semibold
          "
        >

          Timeline Aktivitas

        </h3>

        <div
          className="
            space-y-3
          "
        >

          {

            data.driver_task_logs
              ?.map(
                (
                  log: any
                ) => (

                  <div

                    key={
                      log.id
                    }

                    className="
                      rounded-xl
                      border
                      p-4
                    "

                  >

                    <div
                      className="
                        font-semibold
                      "
                    >

                      {log.status}

                    </div>

                    <div
                      className="
                        text-xs
                        text-slate-500
                      "
                    >

                      {

                        new Date(
                          log.created_at
                        )
                        .toLocaleString(
                          "id-ID"
                        )

                      }

                    </div>

                    <div
                      className="
                        mt-2
                      "
                    >

                      {log.catatan}

                    </div>

                  </div>

                )
              )

          }

        </div>

      </div>
<div className="flex gap-2 justify-center ">

  {data.status === "completed" &&
    !data.is_verified &&
    canVerify && (

    <button
      onClick={async () => {
        await onVerify?.(data.id);
        onClose();
      }}
      className="
                mt-6
                w-full
                rounded-lg
                bg-green-600
                py-3
                text-white
        
      "
    >
      Verifikasi
    </button>

  )}
  
</div>
    </div>

  </div>
{/* button verify */}



</div>


);

}
