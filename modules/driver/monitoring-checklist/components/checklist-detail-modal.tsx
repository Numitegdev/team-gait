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

                      item.condition ===
                      "aman"

                        ? "✅ Aman"

                        : "❌ Tidak Aman"

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

                      <img

                        src={
                          item.photo_url
                        }

                        alt="foto"

                        className="
                          mt-3
                          h-40
                          rounded-lg
                          border
                        "

                      />

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