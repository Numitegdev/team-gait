interface Props {

  totalReports: number;

  pendingReports: number;

  verifiedReports: number;

  totalActivities: number;

}

export function DailyMonitorHeader({

  totalReports,

  pendingReports,

  verifiedReports,

  totalActivities,

}: Props) {

  return (

    <div className="space-y-6">


      <div className="grid gap-3 sm:grid-cols-1 xl:grid-cols-3">

        <SummaryCard

          title="Total Report"

          value={totalReports}

        />

        <SummaryCard

          title="Pending"

          value={pendingReports}

        />

        <SummaryCard

          title="Verified"

          value={verifiedReports}

        />

        {/* <SummaryCard

          title="Total Activity"

          value={totalActivities}

        /> */}

      </div>

    </div>

  );

}

interface SummaryCardProps {

  title: string;

  value: number;

}

function SummaryCard({

  title,

  value,

}: SummaryCardProps) {

  return (

    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <p className="text-sm text-gray-500">

        {title}

      </p>

      <h2 className="mt-2 text-3xl font-bold">

        {value}

      </h2>

    </div>

  );

}