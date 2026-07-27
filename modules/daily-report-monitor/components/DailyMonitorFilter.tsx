interface Props {

  value: string;

  onChange: (
    value: string
  ) => void;

}

const filters = [

  {
    label: "Semua",
    value: "all",
  },

  {
    label: "Pending",
    value: "pending",
  },

  {
    label: "Verified",
    value: "verified",
  },

];

export function DailyMonitorFilter({

  value,

  onChange,

}: Props) {

  return (

    <div className="flex flex-wrap gap-3">

      {filters.map((filter) => (

        <button

          key={filter.value}

          onClick={() =>
            onChange(filter.value)
          }

          className={`rounded-full px-4 py-2 text-sm transition
          ${
            value === filter.value
              ? "bg-blue-600 text-white"
              : "border bg-white hover:bg-gray-100"
          }`}

        >

          {filter.label}

        </button>

      ))}

    </div>

  );

}