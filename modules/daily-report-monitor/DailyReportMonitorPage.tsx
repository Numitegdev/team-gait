"use client";
import {useState} from "react"
import { useDailyReportMonitor } from "./hooks/use-daily-report-monitor";
import {
  DailyMonitorHeader,
} from "./components/DailyMonitorHeader";
import { EmptyReport } from "./components/EmptyReport";
import { DailyReportMiniCard } from "./components/DailyReportMiniCard";
import {
  DailyReportMonitor,
} from "./types/daily-report-monitor.types";
import {
  DailyReportDetailModal,
} from "./components/DailyReportDetailModal";
import {
  DailyMonitorSearch,
} from "./components/DailyMonitorSearch";
import {
  DailyMonitorFilter,
} from "./components/DailyMonitorFilter";

import {
  DailyMonitorDateFilter,
} from "./components/DailyMonitorDateFilter";

export default function DailyReportMonitorPage() {


const [

  selectedReport,

  setSelectedReport,

] = useState<DailyReportMonitor | null>(null);

const [

  openDetail,

  setOpenDetail,

] = useState(false);


  const [

  search,

  setSearch,

] = useState("");

const [

  filter,

  setFilter,

] = useState("all");

const [

  selectedDate,

  setSelectedDate,

] = useState(

  new Date()

    .toISOString()

    .split("T")[0]

);


const {

    reports,

    loading,

    verify,

} = useDailyReportMonitor(

    selectedDate

);

const filteredReports = reports.filter((report) => {

  const matchSearch =
    report.fullName
      .toLowerCase()
      .includes(search.toLowerCase());

  if (!matchSearch) {

    return false;

  }

  switch (filter) {

    case "today":

      return report.summary.total > 0;

    case "pending":

      return !report.report.is_verified;

    case "verified":

      return report.report.is_verified;

    default:

      return true;

  }

});
  if (loading) {

    return (

      <div className="p-6">

        Memuat laporan...

      </div>

    );

  }

const totalReports = reports.length;

const verifiedReports = reports.filter(

  report => report.report.is_verified

).length;

const pendingReports = reports.filter(

  report => !report.report.is_verified

).length;

const totalActivities = reports.reduce(

    (total, report) =>

        total + report.summary.total,

    0

);



  return (

    <div className="space-y-6 p-6">

      {/* Header */}

      
      <div>

        <h1 className="text-3xl font-bold">

          Daily Report Monitor

        </h1>

        <p className="text-gray-500">

          Monitoring laporan harian team operational umum dan teknik

        </p>

      </div>

<DailyMonitorHeader

  totalReports={totalReports}

  pendingReports={pendingReports}

  verifiedReports={verifiedReports}

  totalActivities={totalActivities}

/>

  <div className="grid gap-4 lg:grid-cols-2">

      <DailyMonitorSearch

        value={search}

        onChange={setSearch}

      />
      <DailyMonitorDateFilter

        value={selectedDate}

        onChange={setSelectedDate}

      />

      <DailyMonitorFilter

        value={filter}

        onChange={setFilter}

      />
  </div>


      {/* Empty */}

      {reports.length === 0 ? (

        <EmptyReport />

      ) : (


        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
          "
        >
          

          {filteredReports.map((report) => (

          <DailyReportMiniCard

            key={report.userId}

            report={report}

            onDetail={(item) => {

                setSelectedReport(item);

                setOpenDetail(true);

            }}

        />
        
                ))}

              
        <DailyReportDetailModal

          report={selectedReport}

          open={!!selectedReport}

          onClose={() =>

              setSelectedReport(null)

          }

         onVerify={async (id) => {

    await verify(id);

    setSelectedReport(null);

}}

      />
        
        </div>

      )}

    </div>

  );

}