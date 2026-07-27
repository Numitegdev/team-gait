import {
  DailyActivity,
  DailyReport,
} from "@/modules/daily-report/types/daily-report.types";

export interface DailyReportSummary {

  driver: number;

  checklist: number;

  security: number;

  total: number;

}

export interface DailyReportMonitor {

  report: DailyReport;

  userId: string;

  fullName: string;

  activities: DailyActivity[];

  summary: DailyReportSummary;

}