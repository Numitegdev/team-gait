export type ActivityModule =
  | "driver"
  | "checklist"
  | "security";

export interface DailyActivity {

  id: number;

  module: ActivityModule;

  title: string;

  description?: string;

  activityDate: string;

  activityTime: string;

  activityDateTime: string;

  sourceId: number;

}

export interface DailyReport {

  id: number;

  user_id: string;

  report_date: string;

  additional_notes: string | null;

  submitted_at: string;

  created_at: string;

  updated_at: string;

  is_verified: boolean;

verified_by?: string | null;

verified_at?: string | null;

}