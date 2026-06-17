interface Props {

  open: boolean;

  vehicle: any;

  reminders: any[];

  onClose: () => void;

  onAddReminder:
() => void;

}

export function VehicleDetailModal({

  open,

  vehicle,

  reminders,

  onClose,

  onAddReminder,

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
            "
          >
            Reminder
          </h3>

          <div
            className="
              mt-3
              space-y-3
            "
          >

            {reminders.map(
              (item) => (

                <div

                  key={item.id}

                  className="
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
                    {item.day}
                    {" / "}
                    {item.month}
                  </div>

                </div>

              )
            )}

          </div>
        
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