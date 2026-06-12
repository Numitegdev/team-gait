import {
  NextResponse,
}
from "next/server";

import {
  supabaseAdmin,
}
from "@/lib/supabase/admin";
export async function POST(
  req: Request
) {

  const body =
    await req.json();

  const message =
    body.message;

  if (!message) {

    return NextResponse.json({
      ok: true,
    });

  }

const caption =
  message.caption ||
  message.text ||
  "";

console.log(
  "PHOTO:",
  message.photo
);

if (message.photo) {

  const biggestPhoto =
    message.photo[
      message.photo.length - 1
    ];

  const fileId =
    biggestPhoto.file_id;

  const telegramFile =
    await fetch(

`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`

    );

  const telegramData =
    await telegramFile.json();

  console.log(
    "FILE DATA",
    telegramData
  );

}

  if (
  caption.startsWith(
    "/pengiriman"
  )
) {

  const content =
    caption
      .replace(
        "/pengiriman",
        ""
      )
      .trim();

  const [

    pengirim,

    nomorResi,

    deskripsi,

  ] =
    content.split(
      "_"
    );

  const nomorTask =
    `DRV-${Date.now()}`;

  await supabaseAdmin

    .from(
      "driver_tasks"
    )

    .insert({

      nomor_task:
        nomorTask,

      jenis:
        "pengiriman",

      pengirim,

      penerima:
        "-",

      nomor_resi:
        nomorResi,

      deskripsi,

      status:
        "pending",

    });

}


if (
  caption.startsWith(
    "/pengambilan"
  )
) {

  const content =
    caption
      .replace(
        "/pengambilan",
        ""
      )
      .trim();

  const [

    penerima,

    nomorResi,

    deskripsi,

  ] =
    content.split(
      "_"
    );

  const nomorTask =
    `DRV-${Date.now()}`;

  await supabaseAdmin

    .from(
      "driver_tasks"
    )

    .insert({

      nomor_task:
        nomorTask,

      jenis:
        "penerimaan",

      pengirim:
        "-",

      penerima,

      nomor_resi:
        nomorResi,

      deskripsi,

      status:
        "pending",

    });

}

  return NextResponse.json({
    ok: true,
  });

}