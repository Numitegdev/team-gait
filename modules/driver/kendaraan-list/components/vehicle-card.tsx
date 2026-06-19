interface Props {

  vehicle: any;

reminderLogs: any[];
  
onEdit?: (
    vehicle: any
  ) => void;

  onDelete?: (
    id: number
  ) => void;

   onDetail: (
    vehicle: any
  ) => void;


}

import {
  getNearestReminder,
}
from "../helpers/reminder-helper";

import {
  getNearestBooking,
}
from "../helpers/booking-helper";

import {
  getBookingStatus,
}
from "../helpers/booking-status-helper";

export function VehicleCard({

  vehicle,

  onEdit,

  onDelete,

  onDetail,

   reminderLogs,

}: Props) {

const nearestReminder =
  getNearestReminder(

    vehicle.reminders ?? [],

    reminderLogs ?? []

  );

const nearestBooking =
  getNearestBooking(
    vehicle.bookings ?? []
  );

const bookingStatus =
  nearestBooking
    ? getBookingStatus(
        nearestBooking
      )
    : null;

  let reminderColor =
  "bg-slate-50";

if (
  nearestReminder
) {

  if (
    nearestReminder.daysRemaining <= 7
  ) {

    reminderColor =
      "bg-red-300";

  }

  else if (

    nearestReminder.daysRemaining <= 30

  ) {

    reminderColor =
      "bg-orange-300";

  }

}

  return (

    <div
      className="
        rounded-xl
        border
        bg-white
        p-4
        shadow-sm
        justify-between
      "
    >
         <div
            className="
                mt-4
                flex
                gap-2
            "
            >

            <button

                onClick={() =>
                onEdit?.(
                    vehicle
                )
                }

                className="
                rounded-lg
                border
                px-3
                py-1
                "
            >

                Edit

            </button>

            <button

                onClick={() =>
                onDelete?.(
                    vehicle.id
                )
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

    {vehicle.foto_url ? (

        <img

            src={
            vehicle.foto_url
            }

            alt={
            vehicle.nama_kendaraan
            }

            className="
            aspect-video
            w-full
            rounded-lg
            object-cover
            "

        />
        

        ) : (

        <div
            className="
            aspect-video
            rounded-lg
            bg-slate-100
            "
        />

        )}

      <div className="mt-3">

        <div
          className="
            font-semibold
          "
        >
          {vehicle.plat_nomor}
        </div>

        <div
          className="
            text-sm
            text-slate-500
          "
        >
          {vehicle.nama_kendaraan}
        </div>
        {/* reminder */}
       {nearestReminder && (

          <div

            className={`
              mt-3
              rounded-lg
              p-3
              text-sm
              ${reminderColor}
            `}

          >

            <div
              className="
                font-medium
              "
            >

              {nearestReminder.type ===
              "service"

                ? "🛠 Service"

                : "🧾 Pajak"}

            </div>

            <div
              className="
                text-slate-600
              "
            >

              {
                nearestReminder.daysRemaining
              }
              {" "}
              hari lagi

            </div>

          </div>

        )}
        {/* booking */}
        {

          nearestBooking && (

            <div
              className="
                mt-3
                rounded-lg
                border
                p-2
                text-sm
              ${bookingStatus?.color}
              "
              
            >

              <div
                className="
                  font-medium
                  text-indigo-700
                "
              >
                📅 {bookingStatus?.text}
              </div>

              <div>
                {nearestBooking.booked_by}
              </div>

              <div
                className="
                  text-slate-500
                "
              >
                {nearestBooking.daysRemaining}
                {" "}
                hari lagi
              </div>

            </div>

          )

        }

      </div>
           <div>
            <button

            onClick={() =>
            onDetail(vehicle)
              }

            className="
                mt-3
                w-full
                rounded-lg
                border
                px-3
                py-2
            "
            >

            Detail

            </button>

            </div>
    </div>

  );

}