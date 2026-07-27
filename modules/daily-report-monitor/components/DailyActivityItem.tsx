import { ActivityBadge } from "@/modules/daily-report/components/ActivityBadge";

import {
  DailyActivity,
} from "@/modules/daily-report/types/daily-report.types";

interface Props {

  activity: DailyActivity;

}

export function DailyActivityItem({

  activity,

}: Props) {

  return (

    <div className="flex items-start gap-4 rounded-lg border bg-white p-4 transition hover:shadow-sm">

      <div className="mt-1 h-3 w-3 rounded-full bg-blue-500" />

      <div className="flex-1">

        <div className="flex items-center justify-between">

          <div>

            <ActivityBadge
              module={activity.module}
            />

          </div>

          <span className="text-xs text-gray-500">

            {activity.activityTime}

          </span>

        </div>

        <h4 className="mt-2 font-medium text-gray-900">

          {activity.title}

        </h4>

        {activity.description && (

          <p className="mt-1 text-sm text-gray-500">

            {activity.description}

          </p>

        )}

      </div>

    </div>

  );

}