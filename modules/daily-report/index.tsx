"use client";

import { DailyTimeline } from "./components/DailyTimeline";
import { DailyReportForm } from "./components/DailyReportForm";
import { useDailyReport } from "./hooks/use-daily-report";
import {
  DailySummary,
} from "./components/DailySummary";
export default function DailyReportPage() {

const {

  activities,

  report,

  additionalNotes,

  setAdditionalNotes,

  submit,

  loading,

} = useDailyReport();

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-2xl font-bold">

          Daily Report

        </h1>

        <p className="text-gray-500">

          Aktivitas hari ini akan muncul otomatis dari sistem.

        </p>

      </div>

            <DailySummary
    activities={activities}
/>

      <DailyTimeline
        activities={activities}
      />

   <DailyReportForm

    additionalNotes={additionalNotes}

    onChange={setAdditionalNotes}

    onSubmit={submit}

    loading={loading}

    isSubmitted={!!report}

    submittedAt={report?.submitted_at}

/>



    </div>

  );

}