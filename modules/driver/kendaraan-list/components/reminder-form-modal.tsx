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

  reminder?: any;

}

export function ReminderFormModal({

  open,

  onClose,

  onSubmit,

  reminder,

}: Props) {

 const [

  reminderName,

  setReminderName,

] = useState(

  reminder?.reminder_name
  ?? ""

);

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

const months = [

  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },

];

const daysInMonth =
  new Date(
    2024,
    month,
    0
  ).getDate();

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

{/* bulan */}
<select

  value={month}

  onChange={(e) => {

    setMonth(
      Number(
        e.target.value
      )
    );

    setDay(1);

  }}

  className="
    mt-3
    w-full
    rounded-lg
    border
    p-2
  "

>

  {

    months.map(
      (item) => (

        <option
          key={item.value}
          value={item.value}
        >

          {item.label}

        </option>

      )
    )

  }

</select>
{/* hari */}
       <select

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

>

  {

    Array.from(

      {
        length:
          daysInMonth
      },

      (_, index) => (

        <option
          key={index + 1}
          value={index + 1}
        >

          {index + 1}

        </option>

      )

    )

  }

</select>

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