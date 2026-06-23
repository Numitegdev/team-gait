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
      z-[999]
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
        max-w-lg
        rounded-2xl
        bg-white
        shadow-xl
        max-h-[90vh]
        overflow-y-auto
      "
    >

      <div
        className="
          border-b
          p-5
        "
      >

        <h2
          className="
            text-xl
            font-bold
          "
        >

          Tambah Reminder Kendaraan

        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >

          Reminder service atau pajak kendaraan.

        </p>

      </div>

      <div
        className="
          space-y-4
          p-5
        "
      >

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >

            Nama Reminder

          </label>

          <input

            value={reminderName}

            onChange={(e) =>
              setReminderName(
                e.target.value
              )
            }

            placeholder="
              Contoh:
              Ganti Oli Mesin
            "

            className="
              w-full
              rounded-xl
              border
              bg-slate-50
              p-3
            "

          />

        </div>

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >

            Jenis Reminder

          </label>

          <select

            value={type}

            onChange={(e) =>
              setType(
                e.target.value
              )
            }

            className="
              w-full
              rounded-xl
              border
              bg-slate-50
              p-3
            "

          >

            <option value="service">
              Service
            </option>

            <option value="pajak">
              Pajak
            </option>

          </select>

        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
          "
        >

          <div>

            <label
              className="
                mb-1
                block
                text-sm
                font-medium
              "
            >

              Bulan

            </label>

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
                w-full
                rounded-xl
                border
                bg-slate-50
                p-3
              "
            >

              {months.map(
                (item) => (

                  <option
                    key={item.value}
                    value={item.value}
                  >

                    {item.label}

                  </option>

                )
              )}

            </select>

          </div>

          <div>

            <label
              className="
                mb-1
                block
                text-sm
                font-medium
              "
            >

              Tanggal

            </label>

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
                w-full
                rounded-xl
                border
                bg-slate-50
                p-3
              "
            >

              {Array.from(

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

              )}

            </select>

          </div>

        </div>

      </div>

      <div
        className="
          flex
          flex-col-reverse
          gap-2
          border-t
          p-5
          md:flex-row
          md:justify-end
        "
      >

        <button

          onClick={onClose}

          className="
            rounded-xl
            border
            px-5
            py-3
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
            rounded-xl
            bg-blue-600
            px-5
            py-3
            text-white
          "

        >

          Simpan Reminder

        </button>

      </div>

    </div>

  </div>

);

}