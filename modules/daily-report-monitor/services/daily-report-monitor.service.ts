import { createClient } from "@/lib/supabase/client";

import {
  getUserActivities,
} from "@/modules/daily-report/services/daily-report-service";

import {
  DailyReportMonitor,
} from "../types/daily-report-monitor.types";

const supabase = createClient();

export async function getDailyReports(
  reportDate?: string
): Promise<DailyReportMonitor[]> {


    
let query =

  supabase

    .from("daily_reports")

    .select(`
      *,
      profiles!daily_reports_user_id_fkey(
        full_name
      )
    `);

if (reportDate) {

  query = query.eq(
    "report_date",
    reportDate
  );

}

const {

  data,

  error,

} = await query.order(

  "submitted_at",

  {

    ascending: false,

  }

);


  if (error)
    throw error;

  

  return await Promise.all(

  (data ?? []).map(async (item) => {

  const activities =
  await getUserActivities(

    item.user_id,

    item.report_date

  );

    const summary = {

      driver:
        activities.filter(
          (a) => a.module === "driver"
        ).length,

      checklist:
        activities.filter(
          (a) => a.module === "checklist"
        ).length,

      security:
        activities.filter(
          (a) => a.module === "security"
        ).length,

      total:
        activities.length,

    };
console.log(data);

    return {

      report: item,

      userId:
        item.user_id,

      fullName:
        item.profiles?.full_name ??
        "Unknown",

      activities,

      summary,

    };

  })

);

  

}

export async function verifyDailyReport(

  reportId: number,

  verifiedBy: string,

): Promise<void> {

  const supabase =
    createClient();

  const { error } =

    await supabase

      .from("daily_reports")

      .update({

        is_verified: true,

        verified_by: verifiedBy,

        verified_at:
          new Date().toISOString(),

      })

      .eq("id", reportId)

      .eq("is_verified", false);

  if (error) {

    throw error;

  }

}


