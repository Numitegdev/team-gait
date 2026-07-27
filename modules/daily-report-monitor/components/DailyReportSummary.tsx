interface Props {

  summary: {

    driver: number;

    checklist: number;

    security: number;

    total: number;

  };

}

export function DailyReportSummary({

  summary,

}: Props) {

  return (

    <div className="rounded-lg border bg-gray-50 p-4">

      <h3 className="mb-4 text-sm font-semibold text-gray-700">

        Ringkasan Aktivitas

      </h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

        <SummaryItem
          label="Driver"
          value={summary.driver}
        />

        <SummaryItem
          label="Checklist"
          value={summary.checklist}
        />

        <SummaryItem
          label="Security"
          value={summary.security}
        />

        <SummaryItem
          label="Total"
          value={summary.total}
          highlight
        />

      </div>

    </div>

  );

}

interface SummaryItemProps {

  label: string;

  value: number;

  highlight?: boolean;

}

function SummaryItem({

  label,

  value,

  highlight = false,

}: SummaryItemProps) {

  return (

    <div
      className={`
        rounded-lg
        border
        bg-white
        p-4
        text-center
        transition

        ${
          highlight
            ? "border-blue-500"
            : ""
        }
      `}
    >

      <div
        className={`
          text-2xl
          font-bold

          ${
            highlight
              ? "text-blue-600"
              : "text-gray-800"
          }
        `}
      >

        {value}

      </div>

      <div className="mt-1 text-sm text-gray-500">

        {label}

      </div>

    </div>

  );

}