import {
  DailyActivity,
} from "../types/daily-report.types";

import {
  DailyActivityCard,
} from "./DailyActivityCard";

import { EmptyActivity } from "./EmptyActivity";

interface Props {

  activities: DailyActivity[];

}

export function DailyTimeline({

  activities,

}: Props) {

 if (activities.length === 0) {

  return <EmptyActivity />;

}

  return (

    <div className="space-y-4">

      {activities.map((activity) => (

        <DailyActivityCard

          key={`${activity.module}-${activity.id}`}

          title={activity.title}

          description={activity.description}

          module={activity.module}

          time={activity.activityTime}

        />

      ))}

    </div>

  );

}