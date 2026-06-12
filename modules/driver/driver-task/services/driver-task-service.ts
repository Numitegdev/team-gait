import { createClient }
from "@/lib/supabase/client";
import {

  sendTelegramMessage,

  sendTelegramPhoto,

}
from "@/modules/telegram/services/telegram-service";

const supabase = createClient();

export async function getTasks() {

const { data, error } =
  await supabase
    .from("driver_tasks")
    .select("*")

.in(
  "status",
  [
    "pending",
    "on_progress"
  ]
)
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

if (error)
throw error;

return data;

}

export async function createTask(
payload: any
) {


const nomorTask =
`DRV-${Date.now()}`;

const { data, error } =
await supabase

  .from(
    "driver_tasks"
  )

  .insert([
    {
      ...payload,
      nomor_task:
        nomorTask,
      status:
        "pending",
    },
  ])

  .select()

  .single();


if (error)
throw error;

if (
  data.task_photo_url
) {

  await sendTelegramPhoto(

    data.task_photo_url,

`🚚 TASK BARU

No Task:
${data.nomor_task}

Jenis:
${data.jenis}

Pengirim:
${data.pengirim}

Penerima:
${data.penerima}

Status:
Pending`

  );

} else {

  await sendTelegramMessage(

`🚚 TASK BARU

No Task:
${data.nomor_task}

Jenis:
${data.jenis}

Pengirim:
${data.pengirim}

Penerima:
${data.penerima}

Status:
Pending`

  );

}

return data;

}

export async function getTaskDetail(
  id: number
) {

  const { data, error } =
    await supabase

      .from(
        "driver_tasks"
      )

      .select("*")

      .eq(
        "id",
        id
      )

      .single();

  if (error)
    throw error;

  return data;

}

export async function startTask(
id: number,
 userId: string
) {

const { error } =
await supabase


  .from(
    "driver_tasks"
  )

  .update({

  status:
    "on_progress",

  assigned_at:
    new Date()
      .toISOString(),

  assigned_user_id:
    userId,

})

.eq(
  "id",
  id
)

.eq(
  "status",
  "pending"
)


if (error)
throw error;

await supabase

.from(
  "driver_task_logs"
)

.insert([
  {
    task_id:
      id,

    status:
      "on_progress",

    catatan:
      "Driver mulai mengerjakan task",
  },
]);
const task =
  await getTaskDetail(
    id
  );

await sendTelegramMessage(

`🟦 DRIVER MULAI

No Task:
${task.nomor_task}

Pengirim:
${task.pengirim}

Penerima:
${task.penerima}

Status:
On Progress`

);
}

export async function completeTask(

  id: number,

  catatan: string,

  photoUrl?: string

) {

  const { error } =
    await supabase

      .from(
        "driver_tasks"
      )

      .update({

        status:
          "completed",

        completed_at:
          new Date()
            .toISOString(),

        completion_note:
          catatan,

        completion_photo_url:
          photoUrl || null,

      })

      .eq(
        "id",
        id
      );

  if (error)
    throw error;

  await supabase

    .from(
      "driver_task_logs"
    )

    .insert([
      {

        task_id:
          id,

        status:
          "completed",

        catatan,

      },
    ]);

    const task =
  await getTaskDetail(
    id
  );

if (
  task.completion_photo_url
) {

  await sendTelegramPhoto(

    task.completion_photo_url,

`🟩 TASK SELESAI

No Task:
${task.nomor_task}

Pengirim:
${task.pengirim}

Penerima:
${task.penerima}

Catatan:
${catatan || "-"}`

  );

}
else {

  await sendTelegramMessage(

`🟩 TASK SELESAI

No Task:
${task.nomor_task}

Pengirim:
${task.pengirim}

Penerima:
${task.penerima}

Catatan:
${catatan || "-"}`

  );

}

}