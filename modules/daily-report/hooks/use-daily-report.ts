"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createClient,
} from "@/lib/supabase/client";

import {

  DailyActivity,

  DailyReport,

} from "../types/daily-report.types";

import {

  getTodayReport,

  getUserActivities,

  submitDailyReport,

} from "../services/daily-report-service";

export function useDailyReport() {

    const [

  loading,

  setLoading,

] = useState(false);

const [

  report,

  setReport,

] = useState<DailyReport | null>(null);

const [

  activities,

  setActivities,

] = useState<DailyActivity[]>([]);

const [

  additionalNotes,

  setAdditionalNotes,

] = useState("");

const supabase =
  createClient();

  const today =

  new Date()

    .toISOString()

    .split("T")[0];


    useEffect(() => {

  loadData();

}, []);

async function loadData() {

  try {

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const [

      activities,

      report,

    ] = await Promise.all([

      getUserActivities(
        user.id,
        today,
      ),

      getTodayReport(
        user.id,
        today,
      ),

    ]);

    setActivities(
      activities
    );

    setReport(
      report
    );

    setAdditionalNotes(
      report?.additional_notes ?? ""
    );

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

}

async function submit() {

  try {

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    await submitDailyReport(

      user.id,

      today,

      additionalNotes,

    );

    await loadData();

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

}

return {

  loading,

  activities,

  report,

  additionalNotes,

  setAdditionalNotes,

  submit,

  reload: loadData,

};
}