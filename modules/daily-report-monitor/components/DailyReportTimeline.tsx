import {
  DailyActivity,
} from "@/modules/daily-report/types/daily-report.types";

import {
  DailyActivityItem,
} from "./DailyActivityItem";

import {
  EmptyReport,
} from "./EmptyReport";

interface Props {

  activities: DailyActivity[];

}

export function DailyReportTimeline({

  activities,

}: Props) {

  return (

    <div className="space-y-4">

      <div>

        <h3 className="text-sm font-semibold text-gray-700">

          Timeline Aktivitas

        </h3>

        <p className="text-sm text-gray-500">

          Aktivitas yang dilakukan pada hari tersebut.

        </p>

      </div>

      {activities.length === 0 ? (

        <EmptyReport />

      ) : (

        <div className="space-y-3">

          {activities.map((activity) => (

            <DailyActivityItem

              key={`${activity.module}-${activity.id}`}

              activity={activity}

            />

          ))}

        </div>

      )}

    </div>

  );

}