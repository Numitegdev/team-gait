import {
  NextResponse,
}
from "next/server";

import {
  createTask,
}
from "@/modules/driver/driver-task/services/driver-task-service";

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
    message.caption || "";

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

    await createTask({

      jenis:
        "pengiriman",

      pengirim,

      penerima:
        "-",

      nomor_resi:
        nomorResi,

      deskripsi,

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

    await createTask({

      jenis:
        "penerimaan",

      pengirim:
        "-",

      penerima,

      nomor_resi:
        nomorResi,

      deskripsi,

    });

  }

  return NextResponse.json({
    ok: true,
  });

}