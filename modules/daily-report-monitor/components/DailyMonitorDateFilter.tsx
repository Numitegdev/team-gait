interface Props {

  value: string;

  onChange: (
    value: string
  ) => void;

}

export function DailyMonitorDateFilter({

  value,

  onChange,

}: Props) {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  return (

    <div className="rounded-xl border bg-white p-4 shadow-sm space-y-3">

      <div className="flex items-center justify-between">

        <p className="text-sm font-medium text-gray-700">

          Tanggal Laporan

        </p>

        {value ? (

          <button

            onClick={() => onChange("")}

            className="text-xs text-red-600 hover:underline"

          >

            Semua Tanggal

          </button>

        ) : null}

      </div>

      <input

        type="date"

        value={value}

        onChange={(e) =>
          onChange(e.target.value)
        }

        className="
          w-full
          rounded-lg
          border
          px-4
          py-2
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200
        "

      />

      <div className="flex gap-2">

        <button

          onClick={() => onChange(today)}

          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"

        >

          Hari Ini

        </button>

        <button

          onClick={() => onChange("")}

          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"

        >

          Reset

        </button>

      </div>

    </div>

  );

}