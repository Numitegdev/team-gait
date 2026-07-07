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

  console.log("INSERT RESULT", data);
console.log("INSERT ERROR", error);

const paymentInfo =
  data?.payment_type === "cash"

    ? `Cash Rp ${Number(
        data.cash_amount || 0
      ).toLocaleString("id-ID")}`

    : data?.payment_type === "transfer"

    ? `Transfer Rp ${Number(
        data.cash_amount || 0
      ).toLocaleString("id-ID")}`

    : data?.payment_type === "tempo"

    ? "Tempo"

    : "Tidak Ada";
    
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

Kirim Ke :
${data.pengirim}

Ambil dari:
${data.penerima}

Deskripsi:
${data.deskripsi || "-"}

Payment:
${paymentInfo}

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

Kirim ke :
${data.pengirim}

Ambil dari
${data.penerima}

Deskripsi:
${data.deskripsi || "-"}

Payment:
${paymentInfo}

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

Kirim ke:
${task.pengirim}

Ambil dari:
${task.penerima}

Deskripsi:
${task.deskripsi || "-"}

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

Kirim ke:
${task.pengirim}

Ambil dari:
${task.penerima}

Catatan Driver:
${task.completion_note || "-"}`

  );

}
else {

  await sendTelegramMessage(

`🟩 TASK SELESAI

No Task:
${task.nomor_task}

Kirim ke:
${task.pengirim}

Ambil dari:
${task.penerima}

Catatan Driver:
${task.completion_note || "-"}`

  );

}

}

export async function cancelTask(
  id: number
) {

  const task =
    await getTaskDetail(id);

  if (
    task.status !==
    "pending"
  ) {

    throw new Error(
      "Task sudah dikerjakan dan tidak bisa dibatalkan"
    );

  }

  // hapus foto dari storage
  if (
    task.task_photo_url
  ) {

    const fileName =
      task.task_photo_url
        .split("/")
        .pop();

    if (fileName) {

      await supabase.storage

        .from(
          "driver_photos"
        )

        .remove([
          fileName
        ]);

    }

  }

  // hapus task
  const { error } =
    await supabase

      .from(
        "driver_tasks"
      )

      .delete()

      .eq(
        "id",
        id
      );

  if (error)
    throw error;

  // telegram notif
  await sendTelegramMessage(

`🟥 TASK DIBATALKAN

No Task:
${task.nomor_task}

Pengirim:
${task.pengirim}

Penerima:
${task.penerima}

Status:
Cancelled`

  );

}