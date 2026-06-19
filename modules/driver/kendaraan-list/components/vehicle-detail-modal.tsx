interface Props {

  open: boolean;

  vehicle: any;

  reminders: any[];

  bookings: any[];

  reminderLogs: any[];

  onClose: () => void;

  onAddReminder: () => void;

  onAddBooking: () => void;

  onDeleteReminder: (
    id: number
  ) => void;

  onEditReminder: (
    reminder: any
  ) => void;

  onVerifyReminder: (
    reminder: any
  ) => void;

  onEditBooking: (
  booking: any
) => void;

onDeleteBooking: (
  id: number
) => void;

}

export function VehicleDetailModal({

  open,
  vehicle,
  reminders,
  bookings,
  reminderLogs,
  onClose,
  onAddReminder,
  onAddBooking,
  onDeleteReminder,
  onEditReminder,
  onVerifyReminder,
  onEditBooking,
onDeleteBooking,


}: Props){

  if (
    !open ||
    !vehicle
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
        rounded-xl
        bg-white
        p-6
        max-h-[90vh]
        overflow-y-auto
      "
    >

      {/* Header */}

      <div
        className="
          border-b
          pb-4
        "
      >

        <h2
          className="
            text-2xl
            font-bold
          "
        >
          Detail Kendaraan
        </h2>

        <div className="mt-3">

          <div
            className="
              text-lg
              font-semibold
            "
          >
            {vehicle.plat_nomor}
          </div>

          <div
            className="
              text-slate-500
            "
          >
            {vehicle.nama_kendaraan}
          </div>

        </div>

      </div>

      {/* Content */}

      <div
        className="
          mt-6
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
        "
      >

        {/* Reminder */}

        <div>

          <div
            className="
              flex
              items-center
              justify-between
              mb-3
            "
          >

            <h3
              className="
                font-semibold
                text-lg
              "
            >
              Reminder Aktif
            </h3>

            <button

              onClick={
                onAddReminder
              }

              className="
                rounded-lg
                bg-blue-600
                px-3
                py-2
                text-sm
                text-white
              "
            >

              + Reminder

            </button>

          </div>

          {

            reminders.length === 0

            ? (

              <div
                className="
                  rounded-lg
                  border
                  p-4
                  text-sm
                  text-slate-500
                "
              >
                Belum ada reminder
              </div>

            )

            : (

              reminders.map(
                (item) => {

                  const verified =
                    reminderLogs.some(

                      (log) =>

                        log.reminder_id ===
                        item.id

                    );

                  const now =
                    new Date();

                  const currentYear =
                    now.getFullYear();

                  let nextDate =
                    new Date(

                      currentYear,

                      item.month - 1,

                      item.day

                    );

                  if (
                    nextDate < now
                  ) {

                    nextDate =
                      new Date(

                        currentYear + 1,

                        item.month - 1,

                        item.day

                      );

                  }

                  const daysRemaining =
                    Math.ceil(

                      (
                        nextDate.getTime()
                        -
                        now.getTime()
                      )

                      /

                      (
                        1000 *
                        60 *
                        60 *
                        24
                      )

                    );

                  const canVerify =
                    daysRemaining <= 60;

                  return (

                    <div

                      key={item.id}

                      className="
                        mb-3
                        rounded-lg
                        border
                        p-4
                      "

                    >

                      <div
                        className="
                          font-semibold
                        "
                      >
                        {item.reminder_name}
                      </div>

                      <div
                        className="
                          text-sm
                          text-slate-500
                        "
                      >
                        {item.day} / {item.month}
                      </div>

                      {

                        verified && (

                          <div
                            className="
                              mt-2
                              text-sm
                              font-medium
                              text-green-600
                            "
                          >
                            ✓ Sudah Diverifikasi
                          </div>

                        )

                      }

                      <div
                        className="
                          mt-3
                          flex
                          flex-wrap
                          gap-2
                        "
                      >

                        <button

                          onClick={() =>
                            onEditReminder(
                              item
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
                            onDeleteReminder(
                              item.id
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

                        {

                          !verified &&
                          canVerify && (

                            <button

                              onClick={() =>
                                onVerifyReminder(
                                  item
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

                              Verify

                            </button>

                          )

                        }

                      </div>

                    </div>

                  );

                }
              )

            )

          }

        </div>

        {/* Booking */}

        <div>

          <div
            className="
              flex
              items-center
              justify-between
              mb-3
            "
          >

            <h3
              className="
                font-semibold
                text-lg
              "
            >
              Booking Kendaraan
            </h3>

            <button

              onClick={
                onAddBooking
              }

              className="
                rounded-lg
                bg-indigo-600
                px-3
                py-2
                text-sm
                text-white
              "
            >

              + Booking

            </button>

          </div>

          {

  bookings.length === 0

  ? (

    <div
      className="
        rounded-lg
        border
        p-4
        text-sm
        text-slate-500
      "
    >
      Belum ada booking
    </div>

  )

  : (

    bookings.map(
      (item: any) => (

        <div

          key={item.id}

          className="
            mb-3
            rounded-lg
            border
            p-4
            bg-white
          "

        >

          <div
            className="
              font-medium
              text-slate-900
            "
          >
            {item.booked_by}
          </div>

          <div
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >
          {item.booking_date}

          {" - "}

          {item.end_date}
          </div>

          {

            item.duration_days && (

              <div
                className="
                  mt-1
                  text-sm
                  text-indigo-600
                "
              >
                Durasi {item.duration_days} Hari
              </div>

            )

          }

          {

            item.purpose && (

              <div
                className="
                  mt-2
                  text-sm
                  text-slate-700
                "
              >
                {item.purpose}
              </div>

            )

          }

          <div
            className="
              mt-3
              flex
              gap-2
            "
          >

            <button

              onClick={() =>
                onEditBooking(item)
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
                onDeleteBooking(
                  item.id
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

        </div>

      )

    )

  )

}

        </div>

      </div>

      {/* Footer */}

      <div
        className="
          mt-6
          flex
          justify-end
        "
      >

        <button

          onClick={
            onClose
          }

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

    </div>

  </div>

);

}