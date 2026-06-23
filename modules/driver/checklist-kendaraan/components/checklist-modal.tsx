"use client";

import {
  useState,
} from "react";

interface Props {

  open: boolean;

  onClose: () => void;

  vehicle: any;

  checklistItems: any[];

    onSubmit: (
    payload: any
    ) => void;

}

export function ChecklistModal({

  open,

  onClose,

  vehicle,

  checklistItems,

  onSubmit,

}: Props) {

    const [

        answers,

        setAnswers,

        ] = useState<any>(
        {}
        );

        const [

        notes,

        setNotes,

        ] = useState<any>(
        {}
        );

    const [

            photos,

            setPhotos,

            ] = useState<any>(
            {}
    );
        

  if (!open)
    return null;

return (

  <div
    className="
      fixed
      inset-0
      z-[999]
      flex
      items-center
      justify-center
      bg-black/60
      p-3
      md:p-6
    "
  >

    <div
      className="
        w-full
        max-w-4xl
        rounded-3xl
        bg-white
        shadow-2xl
        max-h-[95vh]
        overflow-hidden
      "
    >

      {/* Header */}

      <div
        className="
          border-b
          px-5
          py-4
          md:px-6
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                text-xl
                md:text-2xl
                font-bold
              "
            >
              Checklist Kendaraan
            </h2>

            <p
              className="
                text-sm
                text-slate-500
              "
            >
              Pastikan seluruh item diperiksa sebelum kendaraan digunakan.
            </p>

          </div>

          <button

            onClick={onClose}

            className="
              rounded-xl
              border
              px-4
              py-2
              text-sm
              hover:bg-slate-50
            "

          >

            Tutup

          </button>

        </div>

      </div>

      {/* Content */}

      <div
        className="
          max-h-[75vh]
          overflow-y-auto
          px-5
          py-5
          md:px-6
        "
      >

        {/* Info Kendaraan */}

        <div
          className="
            rounded-2xl
            border
            bg-blue-50
            p-4
          "
        >

          <div
            className="
              grid
              gap-4
              md:grid-cols-3
            "
          >

            <div>

              <div
                className="
                  text-xs
                  text-slate-500
                "
              >
                Plat Nomor
              </div>

              <div
                className="
                  font-semibold
                "
              >
                {vehicle?.plat_nomor}
              </div>

            </div>

            <div>

              <div
                className="
                  text-xs
                  text-slate-500
                "
              >
                Kendaraan
              </div>

              <div
                className="
                  font-semibold
                "
              >
                {vehicle?.nama_kendaraan}
              </div>

            </div>

            <div>

              <div
                className="
                  text-xs
                  text-slate-500
                "
              >
                Tanggal
              </div>

              <div
                className="
                  font-semibold
                "
              >
                {
                  new Date()
                  .toLocaleDateString(
                    "id-ID"
                  )
                }
              </div>

            </div>

          </div>

        </div>

        {/* Checklist */}

        <div
          className="
            mt-6
            space-y-4
          "
        >

          {

            checklistItems.map(
              (item: any) => (

                <div

                  key={item.id}

                  className="
                    rounded-2xl
                    border
                    bg-white
                    p-5
                    shadow-sm
                  "

                >

                  <div
                    className="
                      font-semibold
                      text-slate-800
                    "
                  >

                    {item.name}

                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      flex-col
                      gap-3
                      md:flex-row
                    "
                  >

                    <label
                      className={`
                        flex
                        cursor-pointer
                        items-center
                        gap-2
                        rounded-xl
                        border
                        px-4
                        py-3
                        transition
                        ${
                          answers[item.id] === "aman"
                            ? "border-green-500 bg-green-50"
                            : ""
                        }
                      `}
                    >

                      <input

                        type="radio"

                        name={`item-${item.id}`}

                        checked={
                          answers[item.id]
                          === "aman"
                        }

                        onChange={() =>

                          setAnswers({

                            ...answers,

                            [item.id]:
                              "aman",

                          })

                        }

                      />

                      <span>
                        ✅ Aman
                      </span>

                    </label>

                    <label
                      className={`
                        flex
                        cursor-pointer
                        items-center
                        gap-2
                        rounded-xl
                        border
                        px-4
                        py-3
                        transition
                        ${
                          answers[item.id] === "tidak_aman"
                            ? "border-red-500 bg-red-50"
                            : ""
                        }
                      `}
                    >

                      <input

                        type="radio"

                        name={`item-${item.id}`}

                        checked={
                          answers[item.id]
                          === "tidak_aman"
                        }

                        onChange={() =>

                          setAnswers({

                            ...answers,

                            [item.id]:
                              "tidak_aman",

                          })

                        }

                      />

                      <span>
                        ❌ Tidak Aman
                      </span>

                    </label>

                  </div>

                  {

                    answers[item.id] ===
                    "tidak_aman"

                    &&

                    (

                      <div
                        className="
                          mt-4
                          rounded-xl
                          border
                          border-red-200
                          bg-red-50
                          p-4
                        "
                      >

                        <div
                          className="
                            mb-2
                            text-sm
                            font-medium
                            text-red-700
                          "
                        >

                          Detail Kerusakan

                        </div>

                        <input

                          type="file"

                          className="
                            w-full
                            rounded-xl
                            border
                            bg-white
                            p-2
                          "

                          onChange={(e) =>

                            setPhotos({

                              ...photos,

                              [item.id]:
                                e.target.files?.[0],

                            })

                          }

                        />

                        {

                          photos[item.id]

                          &&

                          (

                            <div
                              className="
                                mt-2
                                text-sm
                                text-green-600
                              "
                            >

                              ✓ {
                                photos[item.id]
                                .name
                              }

                            </div>

                          )

                        }

                        <textarea

                          value={
                            notes[item.id]
                            ?? ""
                          }

                          onChange={(e) =>

                            setNotes({

                              ...notes,

                              [item.id]:
                                e.target.value,

                            })

                          }

                          placeholder="
                            Jelaskan kerusakan atau kondisi kendaraan...
                          "

                          className="
                            mt-3
                            w-full
                            rounded-xl
                            border
                            bg-white
                            p-3
                          "

                          rows={3}

                        />

                      </div>

                    )

                  }

                </div>

              )

            )

          }

        </div>

      </div>

      {/* Footer */}

      <div
        className="
          border-t
          bg-white
          p-5
        "
      >

        <button

          onClick={() => {

            const totalItems =
              checklistItems.length;

            const answeredItems =
              Object.keys(
                answers
              ).length;

            if (
              answeredItems <
              totalItems
            ) {

              alert(
                "Semua checklist harus diisi."
              );

              return;

            }

            onSubmit({

              answers,

              photos,

              notes,

            });

          }}

          className="
            w-full
            rounded-2xl
            bg-blue-600
            py-4
            text-lg
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "

        >

          Submit Checklist

        </button>

      </div>

    </div>

  </div>

);

}