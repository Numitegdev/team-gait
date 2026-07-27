import {
  DailyReportMonitor,
} from "../types/daily-report-monitor.types";

import {
  DailyReportSummary,
} from "./DailyReportSummary";

import {
  DailyReportTimeline,
} from "./DailyReportTimeline";

import {
  DailyAdditionalNotes,
} from "./DailyAdditionalNotes";

interface Props {

  open: boolean;

  report: DailyReportMonitor | null;

  onClose: () => void;

  onVerify: (
    reportId: number
  ) => void;

}

export function DailyReportDetailModal({

  open,

  report,

  onClose,

  onVerify,

}: Props) {

  if (!open || !report) {

    return null;

  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">

              {report.fullName}

            </h2>

            <p className="text-sm text-gray-500">

              {report.report.report_date}

            </p>

          </div>

          <button

            onClick={onClose}

            className="rounded-lg border px-3 py-2 hover:bg-gray-100"

          >

            Tutup

          </button>

        </div>

        {/* Body */}

        <div className="space-y-6 p-6">

          <DailyReportSummary

            summary={report.summary}

          />

          <DailyReportTimeline

            activities={report.activities}

          />

          <DailyAdditionalNotes

            notes={report.report.additional_notes}

          />

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t pt-4">

    <button

        onClick={onClose}

        className="rounded-lg border px-4 py-2"

    >

        Tutup

    </button>

    {

        !report?.report.is_verified && (

            <button

                onClick={() =>

                    onVerify(

                        report.report.id

                    )

                }

                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"

            >

                Verifikasi

            </button>

        )

    }

</div>

      </div>

    </div>

  );

}