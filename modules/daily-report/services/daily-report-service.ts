import { createClient } from "@/lib/supabase/client";

import {
  DailyActivity,
  DailyReport,
} from "../types/daily-report.types";

const supabase = createClient();

async function loadDriverActivities(
  userId: string,
  reportDate: string
): Promise<DailyActivity[]> {

  const { data, error } =
    await supabase

      .from("driver_tasks")

      .select(`
        id,
        nomor_task,
        jenis,
        pengirim,
        penerima,
        completed_at
      `)

      .eq(
        "assigned_user_id",
        userId
      )

      .eq(
        "status",
        "completed"
      )

      .gte(
        "completed_at",
        `${reportDate}T00:00:00`
      )

      .lt(
        "completed_at",
        `${reportDate}T23:59:59`
      );

  if (error)
    throw error;

  return (
  data?.map((item) => ({

    id: item.id,

    module: "driver",

    title: item.nomor_task,

    description:
      `${item.jenis} • ${item.pengirim} → ${item.penerima}`,

    activityDate: reportDate,

    activityTime:
      item.completed_at
        ?.split("T")[1]
        ?.substring(0, 5) ?? "",

    activityDateTime:
      item.completed_at ?? "",

    sourceId: item.id,

  })) ?? []
);

}

async function loadChecklistActivities(
  userId: string,
  reportDate: string,
): Promise<DailyActivity[]> {

  const { data, error } = await supabase

    .from("checklist_headers")

    .select(`
      id,
      checklist_date,
      created_at,
      vehicles(
        plat_nomor,
        nama_kendaraan
      )
    `)

    .eq("user_id", userId)

    .eq("checklist_date", reportDate);

  if (error) {
    throw error;
  }

return (
  data?.map((item) => {

    const vehicle =
      item.vehicles?.[0];

    return {

      id: item.id,

      module: "checklist",

      title: "Checklist Kendaraan",

      description:
        vehicle
          ? `${vehicle.nama_kendaraan} (${vehicle.plat_nomor})`
          : "Checklist Kendaraan",

      activityDate: reportDate,

      activityTime:
        item.created_at
          ?.split("T")[1]
          ?.substring(0, 5) ?? "",

      activityDateTime:
        item.created_at ?? "",

      sourceId: item.id,

    };

  }) ?? []
);
}

async function loadSecurityActivities(
  userId: string,
  reportDate: string,
): Promise<DailyActivity[]> {

  const { data, error } =
    await supabase

      .from("security_checks")

      .select(`
        id,
        tanggal,
        shift,
        petugas,
        catatan,
        created_at
      `)

      .eq("user_id", userId)

      .gte(
        "tanggal",
        `${reportDate}T00:00:00`
      )

      .lt(
        "tanggal",
        `${reportDate}T23:59:59`
      );

  if (error) {
    throw error;
  }

  return (
    data?.map((item) => ({

      id: item.id,

      module: "security",

      title: `Patroli Shift ${item.shift}`,

      description:
        item.catatan || "Patroli Security",

      activityDate: reportDate,

      activityTime:
        item.tanggal
          ?.split("T")[1]
          ?.substring(0, 5) ?? "",

      activityDateTime:
        item.tanggal ?? "",

      sourceId: item.id,

    })) ?? []
  );

}

export async function getUserActivities(
  userId: string,
  reportDate: string
): Promise<DailyActivity[]> {

  const [

    driver,

    checklist,

    security,

  ] = await Promise.all([

    loadDriverActivities(
      userId,
      reportDate
    ),

    loadChecklistActivities(
      userId,
      reportDate
    ),

    loadSecurityActivities(
      userId,
      reportDate
    ),

  ]);

  console.log("Driver:", driver);

console.log("Checklist:", checklist);

console.log("Security:", security);

  return [

    ...driver,

    ...checklist,

    ...security,

  ]

        .sort(

        (a,b)=>

        new Date(a.activityDateTime).getTime()

        -

        new Date(b.activityDateTime).getTime()

    );

}

export async function getTodayReport(
  userId: string,
  reportDate: string
): Promise<DailyReport | null> {

  const {

    data,

    error,

  } = await supabase

    .from(
      "daily_reports"
    )

    .select("*")

    .eq(
      "user_id",
      userId
    )

    .eq(
      "report_date",
      reportDate
    )

    .maybeSingle();

  if (error)
    throw error;

  return data;

}

export async function submitDailyReport(
  userId: string,
  reportDate: string,
  additionalNotes: string
): Promise<void> {

  const report =
    await getTodayReport(
      userId,
      reportDate
    );

  if (report) {

    const { error } =
      await supabase

        .from(
          "daily_reports"
        )

        .update({

          additional_notes:
            additionalNotes,

          submitted_at:
            new Date()
              .toISOString(),

        })

        .eq(
          "id",
          report.id
        );

    if (error)
      throw error;

    return;

  }

  const { error } =

    await supabase

      .from(
        "daily_reports"
      )

      .insert({

        user_id:
          userId,

        report_date:
          reportDate,

        additional_notes:
          additionalNotes,

      });

  if (error)
    throw error;

}

