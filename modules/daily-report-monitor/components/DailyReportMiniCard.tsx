import {
  DailyReportMonitor,
} from "../types/daily-report-monitor.types";

interface Props {

  report: DailyReportMonitor;

  onDetail?: (
    report: DailyReportMonitor
  ) => void;

}

export function DailyReportMiniCard({

  report,

  onDetail,

}: Props) {

  return (

    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Header */}

      <div>

        <h3 className="font-semibold text-gray-900">

          {report.fullName}

        </h3>

        <p className="text-xs text-gray-500">

          {report.report.report_date}

        </p>

      </div>

      {/* Summary */}

      <div className="mt-4 space-y-2 text-sm">

        <div className="flex justify-between">

          <span>🚚 Driver</span>

          <span className="font-semibold">

            {report.summary.driver}

          </span>

        </div>

        <div className="flex justify-between">

          <span>✅ Checklist</span>

          <span className="font-semibold">

            {report.summary.checklist}

          </span>

        </div>

        <div className="flex justify-between">

          <span>🛡 Security</span>

          <span className="font-semibold">

            {report.summary.security}

          </span>

        </div>

      </div>

      {/* Notes */}

      <div className="mt-5 border-t pt-4">

        <p className="mb-2 text-xs font-medium uppercase text-gray-400">

          Catatan

        </p>

        <p className="line-clamp-3 text-sm text-gray-600">

          {report.report.additional_notes ||

            "Tidak ada catatan tambahan."}

        </p>

      </div>

      {/* Footer */}

    {/* Footer */}

<div className="mt-5 flex items-center justify-between border-t pt-4">

  {report.report.is_verified ? (

    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">

      ✓ Verified

    </span>

  ) : (

    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">

      Pending

    </span>

  )}

  <button

    onClick={() =>

      onDetail?.(report)

    }

    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700"

  >

    Detail

  </button>

</div>
    </div>

  );

}