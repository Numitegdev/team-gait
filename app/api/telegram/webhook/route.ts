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
    "CAPTION:",
    caption
  );

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