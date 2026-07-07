"use client";

import {
  useChecklistKendaraan,
}
from "./hooks/use-checklist-kendaraan";

import {
  getNearestReminder,
}
from "../kendaraan-list/helpers/reminder-helper";

import {
  getNearestBooking,
}
from "../kendaraan-list/helpers/booking-helper";

import {
  getBookingStatus,
}
from "../kendaraan-list/helpers/booking-status-helper";

import {
  ChecklistModal,
}
from "./components/checklist-modal";

export default function ChecklistKendaraanPage() {

  const {

    
   
    checklistItems,

    openChecklist,

    setOpenChecklist,

    selectedVehicle,

    setSelectedVehicle,

    handleSubmitChecklist,

    search,
    setSearch,

    filteredVehicles,

      submitting,

  }

  = useChecklistKendaraan();

  return (

    <div
      className="
        p-4
        md:p-6
      "
    >

      <h1
        className="
          text-2xl
          font-bold
        "
      >
        Checklist Kendaraan
      </h1>

<div
  className="
    mt-4
    mb-6
  "
>

  <div
    className="
      flex
      items-center
      rounded-2xl
      border
      border-slate-300
      bg-white
      px-4
      shadow-sm
    "
  >

    <span
      className="
        mr-3
        text-slate-400
      "
    >
      🔍
    </span>

    <input

      value={search}

      onChange={(e) =>
        setSearch(
          e.target.value
        )
      }

      placeholder="
        Cari plat nomor atau kendaraan...
      "

      className="
        h-12
        w-full
        bg-transparent
        outline-none
      "

    />

  </div>

</div>




      <div
        className="
          mt-6
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        

        {

         filteredVehicles.map(
            (vehicle: any) => {

                const nearestReminder =
                getNearestReminder(
                    vehicle.reminders ?? [],
                    []
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

                key={
                  vehicle.id
                }

                className="
                  rounded-xl
                  border
                  bg-white
                  p-4
                "

              >

                {
                    vehicle.foto_url
                    ? (

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

                    )

                    : (

                        <div
                        className="
                            aspect-video
                            rounded-lg
                            bg-slate-100
                        "
                        />

                    )

                    }

                <div
                  className="
                    font-semibold
                  "
                >
                  {
                    vehicle.plat_nomor
                  }
                </div>

                <div
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  {
                    vehicle.nama_kendaraan
                  }
                </div>
                    {
                    nearestReminder && (

                        <div
                       className={`
                        mt-3
                        rounded-lg
                        p-2
                        text-sm
                        ${reminderColor}
                        `}
                        >

                        <div
                            className="
                            font-medium
                            "
                        >

                            {
                            nearestReminder.type ===
                            "service"

                                ? "🛠 Service"

                                : "🧾 Pajak"

                            }

                        </div>

                        <div>

                            {
                            nearestReminder.reminder_name
                            }

                        </div>

                        <div
                            className="
                            text-slate-500
                            "
                        >

                            {
                            nearestReminder.day
                            }
                            /
                            {
                            nearestReminder.month
                            }

                        </div>

                        </div>

                    )
                    }

                   {
                        nearestBooking && (

                          <div
                            className={`
                                mt-2
                                rounded-lg
                                p-2
                                text-sm
                                ${bookingStatus?.color}
                            `}
                            >

                            <div
                                className="
                                font-medium
                                "
                            >

                               📅 {bookingStatus?.text}

                            </div>

                            <div>

                                {
                                nearestBooking.booked_by
                                }

                            </div>

                            <div
                                className="
                                text-slate-500
                                "
                            >

                                {
                                nearestBooking.booking_date
                                }

                            </div>

                            </div>

                        )
                        }

                <button

                onClick={() => {

                  setSelectedVehicle(
                    vehicle
                  );

                  setOpenChecklist(
                    true
                  );

                }}

                className="
                  mt-4
                  w-full
                  rounded-lg
                  bg-blue-600
                  py-2
                  text-white
                "

              >

                Checklist

              </button>

                  <ChecklistModal

                    open={
                      openChecklist
                    }

                    vehicle={
                      selectedVehicle
                    }

                    checklistItems={
                      checklistItems
                    }

                    onClose={() =>
                      setOpenChecklist(
                        false
                      )
                    }

                    submitting={submitting}

                    onSubmit={
                      handleSubmitChecklist
                    }

                  />
 
            </div>

            );

         
          }
         )

        }

      </div>

    </div>

  );

}