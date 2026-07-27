"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  DailyReportMonitor,
} from "../types/daily-report-monitor.types";

import {
  getDailyReports,
} from "../services/daily-report-monitor.service";

import {

  verifyDailyReport,

} from "../services/daily-report-monitor.service";

import {
  createClient,
} from "@/lib/supabase/client";

export function useDailyReportMonitor(

    selectedDate: string

) {

    const [

        loading,

        setLoading,

    ] = useState(false);

    const [

        reports,

        setReports,

    ] = useState<DailyReportMonitor[]>([]);

    useEffect(() => {

        loadData();

    }, [

        selectedDate,

    ]);

  async function loadData() {

  try {

    setLoading(true);

    const reports = await getDailyReports(

      selectedDate || undefined

    );

    setReports(reports);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

}

    async function verify(

  reportId: number,

) {

  try {

    const supabase =
      createClient();

    const {
  data: { user },
} = await supabase.auth.getUser();

    if (!user) {

      return;

    }

    await verifyDailyReport(

      reportId,

      user.id,

    );

    await loadData();

  } catch (error) {

    console.error(error);

  }

}

return {

  reports,

  loading,

  reload: loadData,

  verify,

};

}