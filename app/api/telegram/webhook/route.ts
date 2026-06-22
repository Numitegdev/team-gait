import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase/admin";

export async function POST(
  req: Request
) {
  console.log(
  "WEBHOOK VERSION 22 JUNI 2026"
);

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

console.log("================================");
console.log("TEXT MASUK:", message.text);
console.log("CAPTION MASUK:", message.caption);
console.log("FULL MESSAGE:", JSON.stringify(message));
console.log("================================");

  console.log("CAPTION:");
console.log(caption);

const command =
  caption
    .split("\n")[0]
    .trim();

  
console.log("COMMAND:");
console.log(command);

  let telegramPhotoUrl:
    string | null =
      null;

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

  const filePath =
    telegramData.result
      .file_path;

  const originalTelegramUrl =

`https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/${filePath}`;

  const imageResponse =
    await fetch(
      originalTelegramUrl
    );

  const imageBuffer =
    Buffer.from(
      await imageResponse.arrayBuffer()
    );

  const fileName =
    `telegram-${Date.now()}.jpg`;

  const {
    error: uploadError,
  } =
    await supabaseAdmin.storage

      .from(
        "driver_photos"
      )

      .upload(
        fileName,
        imageBuffer,
        {
          contentType:
            "image/jpeg",
        }
      );

  if (uploadError) {

    console.error(
      "UPLOAD ERROR:",
      uploadError
    );

  } else {

    const {
      data: photoData,
    } =
      supabaseAdmin.storage

        .from(
          "driver_photos"
        )

        .getPublicUrl(
          fileName
        );

    telegramPhotoUrl =
      photoData.publicUrl;

    console.log(
      "SUPABASE PHOTO URL:",
      telegramPhotoUrl
    );

  }

}
  // payment

    if (
  command ===
  "/payment"
) {

  const content =
    caption
      .replace(
        "/payment",
        ""
      )
      .trim();

  const parts =
    content.split("_");

  const pengirim =
    parts[0];

  const deskripsi =
    parts[1];

  const paymentType =
    parts[2] || "none";

  const cashAmount =

    paymentType === "cash"

      ? Number(
          parts[3] || 0
        )

      : null;

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
        null,

      deskripsi,

      payment_type:
        paymentType,

      cash_amount:
        cashAmount,

      status:
        "pending",

      task_photo_url:
        telegramPhotoUrl,

    });

}

  //  resi

else   if (
  command ===
  "/resi"
) {

  const content =
    caption
      .replace(
        "/resi",
        ""
      )
      .trim();

      console.log("CONTENT:", content);
console.log("PARTS:", content.split("_"));

  const [

    penerima,

    nomorResi,

    deskripsi,

  ] =
    content.split("_");

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

      payment_type:
        "none",

      cash_amount:
        null,

      status:
        "pending",

      task_photo_url:
        telegramPhotoUrl,

    });

}

// penerimaan umum
else if (
  command ===
  "/pengiriman"
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

      deskripsi,

    ] =
      content.split(
        "_"
      );

    const nomorTask =
      `DRV-${Date.now()}`;

   await supabaseAdmin
  .from("driver_tasks")
  .insert({

    nomor_task:
      nomorTask,

    jenis:
      "pengiriman",

    pengirim,

    penerima:
      "-",

    nomor_resi:
      null,

    deskripsi,

    payment_type:
      "none",

    cash_amount:
      null,

    status:
      "pending",

    task_photo_url:
      telegramPhotoUrl,

  });

  }

  // pengambilan umum

else if (
  command ===
  "/pengambilan"
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

       payment_type:
        "none",

      cash_amount:
        null,

        deskripsi,

        status:
          "pending",

        task_photo_url:
          telegramPhotoUrl,

      });

  }

  return NextResponse.json({
    ok: true,
  });

}