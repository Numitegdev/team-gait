import { ActivityBadge } from "./ActivityBadge";

interface Props {

  title: string;

  description?: string;

  module: string;

  time: string;

}

export function DailyActivityCard({

  title,

  description,

  module,

  time,

}: Props) {

  return (

<div className="flex gap-4 rounded-2xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">

  <div className="flex flex-col items-center">

    <div className="h-3 w-3 rounded-full bg-blue-500" />

    <div className="mt-1 w-px flex-1 bg-gray-300" />

</div>

    <div className="flex-1">

        <div className="flex justify-between items-start">

            <div>

                <ActivityBadge module={module as any}/>

                <h3 className="mt-2 text-lg font-semibold">

                    {title}

                </h3>

                {description && (

                    <p className="mt-1 text-sm text-gray-600">

                        {description}

                    </p>

                )}

            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">

                {time}

            </span>
             
        </div>

    </div>

    </div>

  );

}