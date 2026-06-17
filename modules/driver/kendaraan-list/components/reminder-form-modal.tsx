import {
  useState,
}
from "react";

interface Props {

  open: boolean;

  onClose: () => void;

  onSubmit: (
    payload: any
  ) => void;

}

export function ReminderFormModal({

  open,

  onClose,

  onSubmit,

}: Props) {

  const [

    reminderName,

    setReminderName,

  ] = useState("");

  const [

    type,

    setType,

  ] = useState(
    "service"
  );

  const [

    month,

    setMonth,

  ] = useState(1);

  const [

    day,

    setDay,

  ] = useState(1);

  if (!open)
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
          max-w-md
          rounded-xl
          bg-white
          p-6
        "
      >

        <h2
          className="
            text-lg
            font-semibold
          "
        >
          Tambah Reminder
        </h2>

        <input
          placeholder="Nama Reminder"
          value={reminderName}
          onChange={(e) =>
            setReminderName(
              e.target.value
            )
          }
          className="
            mt-4
            w-full
            rounded-lg
            border
            p-2
          "
        />

        <select

          value={type}

          onChange={(e) =>
            setType(
              e.target.value
            )
          }

          className="
            mt-3
            w-full
            rounded-lg
            border
            p-2
          "
        >

          <option value="service">
            Service
          </option>

          <option value="pajak">
            Pajak
          </option>

        </select>

        <input
          type="number"
          min={1}
          max={12}
          value={month}
          onChange={(e) =>
            setMonth(
              Number(
                e.target.value
              )
            )
          }
          className="
            mt-3
            w-full
            rounded-lg
            border
            p-2
          "
        />

        <input
          type="number"
          min={1}
          max={31}
          value={day}
          onChange={(e) =>
            setDay(
              Number(
                e.target.value
              )
            )
          }
          className="
            mt-3
            w-full
            rounded-lg
            border
            p-2
          "
        />

        <div
          className="
            mt-4
            flex
            justify-end
            gap-2
          "
        >

          <button
            onClick={onClose}
            className="
              rounded-lg
              border
              px-4
              py-2
            "
          >
            Batal
          </button>

          <button

            onClick={() =>

              onSubmit({

                reminder_name:
                  reminderName,

                type,

                month,

                day,

              })

            }

            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-white
            "
          >

            Simpan

          </button>

        </div>

      </div>

    </div>

  );

}