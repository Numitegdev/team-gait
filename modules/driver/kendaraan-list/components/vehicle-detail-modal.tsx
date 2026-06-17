interface Props {

  open: boolean;

  vehicle: any;

  reminders: any[];

  reminderLogs: any[];

  onClose: () => void;

  onAddReminder: () => void;

  onDeleteReminder: (
    id: number
  ) => void;

  onEditReminder: (
    reminder: any
  ) => void;

  onVerifyReminder: (
    reminder: any
  ) => void;

}

export function VehicleDetailModal({

  open,

  vehicle,

  reminders,

  reminderLogs,

  onClose,

  onAddReminder,

  onDeleteReminder,

  onEditReminder,

  onVerifyReminder,

}: Props) {

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
      "
    >

      <div
        className="
          w-full
          max-w-2xl
          rounded-xl
          bg-white
          p-6
        "
      >

        <h2
          className="
            text-xl
            font-bold
          "
        >
          Detail Kendaraan
        </h2>

        <div className="mt-4">

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

        <div className="mt-6">

          <h3
            className="
              font-semibold
              mb-2
            "
          >
            Reminder Aktif
          </h3>

          {

            reminders.length === 0

            ? (

              <div
                className="
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
                        p-3
                      "

                    >

                      <div
                        className="
                          font-medium
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
                              mt-2
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

        <button

          onClick={
            onAddReminder
          }

          className="
            mt-4
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-white
          "
        >

          + Tambah Reminder

        </button>

        <button

          onClick={
            onClose
          }

          className="
            mt-6
            ml-2
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

  );

}