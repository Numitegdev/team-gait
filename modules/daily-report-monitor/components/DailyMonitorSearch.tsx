interface Props {

  value: string;

  onChange: (
    value: string
  ) => void;

}

export function DailyMonitorSearch({

  value,

  onChange,

}: Props) {

  return (

    <div className="rounded-xl border bg-white p-4 shadow-sm">

      <label className="mb-2 block text-sm font-medium text-gray-700">

        Cari Karyawan

      </label>

      <input

        type="text"

        value={value}

        onChange={(e) =>
          onChange(e.target.value)
        }

        placeholder="Masukkan nama karyawan..."

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

    </div>

  );

}