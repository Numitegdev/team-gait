"use client";

interface Props {

  open: boolean;

  onClose: () => void;

  checklist: any;

  details: any[];

  role: string;

onVerify: (
  checklistId: number
) => void;
}

export function ChecklistDetailModal({

  open,

  onClose,

  checklist,

  details,

  role,

onVerify,

}: Props) {

  if (!open)
    return null;

  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-3xl
          rounded-xl
          bg-white
          p-6
          max-h-[90vh]
          overflow-y-auto
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <h2
            className="
              text-xl
              font-bold
            "
          >

            Detail Checklist

          </h2>

          <button

            onClick={onClose}

            className="
              rounded-lg
              border
              px-3
              py-1
            "

          >

            Tutup

          </button>

        </div>

        <div
            className="
                mt-4
                rounded-lg
                bg-slate-50
                p-4
                space-y-2
            "
            >

            <div>

                Kendaraan :

                {" "}

                {
                checklist?.vehicles
                    ?.plat_nomor
                }

            </div>

            <div>

                Driver :

                {" "}

                {
                checklist?.profiles
                    ?.full_name
                }

            </div>

            <div>

                Tanggal :

                {" "}

                {
                checklist?.checklist_date
                }

            </div>

            <div>

                Status :

                {" "}

                {
                checklist?.status
                }

            </div>

            </div>

        <div
          className="
            mt-6
            space-y-3
          "
        >

          {

            details.map(
              (item: any) => (

                <div

                  key={item.id}

                  className="
                    rounded-lg
                    border
                    p-4
                  "

                >

                  <div
                    className="
                      font-medium
                    "
                  >

                    {
                      item
                      .checklist_items
                      ?.name
                    }

                  </div>

                  <div
  className="
    mt-2
  "
>

  {

    item.checklist_items
      ?.input_type ===
      "option"

      ? (

          item.condition ===
          "aman"

            ? "✅ Aman"

            : "❌ Tidak Aman"

        )

      : (

          <span
            className="
              font-medium
              text-blue-600
            "
          >

            {
              item.value_text
            }

          </span>

        )

  }

</div>

                  {

                    item.notes && (

                      <div
                        className="
                          mt-2
                          text-sm
                        "
                      >

                        Catatan:

                        {" "}

                        {
                          item.notes
                        }

                      </div>

                    )

                  }

                  {

                    item.photo_url && (

                      <div
                        className="
                          mt-3
                        "
                      >

                        <img

                          src={
                            item.photo_url
                          }

                          alt="foto"

                          className="
                            h-40
                            rounded-lg
                            border
                            object-cover
                          "

                        />

                        <div
                          className="
                            mt-2
                            flex
                            gap-2
                          "
                        >

                          <a

                            href={
                              item.photo_url
                            }

                            target="_blank"

                            className="
                              rounded-lg
                              bg-blue-600
                              px-3
                              py-2
                              text-sm
                              text-white
                            "

                          >

                            Lihat Foto

                          </a>

                          <a

                            href={
                              item.photo_url
                            }

                            download

                            className="
                              rounded-lg
                              bg-green-600
                              px-3
                              py-2
                              text-sm
                              text-white
                            "

                          >

                            Download

                          </a>

                        </div>

                      </div>

                    )

                  }

                </div>

              )
            )

          }

        </div>

        {

          checklist?.status !==
          "verified"

          &&

          [

            "ga_admin",

          ].includes(
            role
          )

          && (

            <button

              onClick={() =>

                onVerify(
                  checklist.id
                )

              }

              className="
                mt-6
                w-full
                rounded-lg
                bg-green-600
                py-3
                text-white
              "

            >

              Verify Checklist

            </button>

          )

        }

      </div>

    </div>

  );

}