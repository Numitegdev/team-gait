import {
  DailyActivity,
} from "../types/daily-report.types";

interface Props {

  activities: DailyActivity[];

}

export function DailySummary({

  activities,

}: Props) {

  const driver =

    activities.filter(

      (x) => x.module === "driver"

    ).length;

  const checklist =

    activities.filter(

      (x) => x.module === "checklist"

    ).length;

  const security =

    activities.filter(

      (x) => x.module === "security"

    ).length;

  return (

    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <h2 className="text-lg font-semibold">

        Ringkasan Hari Ini

      </h2>

      <div className="mt-4 space-y-3">

        <div className="flex justify-between">

          <span>🚚 Driver</span>

          <span className="font-semibold">

            {driver}

          </span>

        </div>

        <div className="flex justify-between">

          <span>✅ Checklist</span>

          <span className="font-semibold">

            {checklist}

          </span>

        </div>

        <div className="flex justify-between">

          <span>🛡️ Security</span>

          <span className="font-semibold">

            {security}

          </span>

        </div>

      </div>

      <div className="mt-5 border-t pt-4">

        <div className="flex justify-between">

          <span className="font-semibold">

            Total Aktivitas

          </span>

          <span className="text-xl font-bold">

            {activities.length}

          </span>

        </div>

      </div>

    </div>

  );

}