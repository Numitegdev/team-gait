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

            Checklist Kendaraan

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
            text-sm
          "
        >

          <div>

            Kendaraan :

            {" "}

            {vehicle?.plat_nomor}

          </div>

          <div>

            Nama :

            {" "}

            {vehicle?.nama_kendaraan}

          </div>

          <div>

            Tanggal :

            {" "}

            {
              new Date()
              .toLocaleDateString(
                "id-ID"
              )
            }

          </div>

        </div>

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

                    {item.name}

                  </div>

                  <div
                    className="
                      mt-3
                      flex
                      gap-4
                    "
                  >

                    <label>

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

                      {" "}

                      Aman

                    </label>

                    <label>

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


                      {" "}

                      Tidak Aman

                    </label>

                  </div>

               {

                    answers[item.id] ===
                    "tidak_aman"

                    &&

                    (

                        <>

                        <input

                          type="file"

                          className="
                            mt-3
                            w-full
                            rounded-lg
                            border
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
                            Jelaskan kerusakan...
                            "

                            className="
                            mt-3
                            w-full
                            rounded-lg
                            border
                            p-2
                            "

                            rows={3}

                        />

                        </>

                    )

                    }
                </div>

              )
            )

          }

        </div>

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

            console.log(
              "PHOTOS STATE:",
              photos
            );
            
            onSubmit({

                answers,

                photos,

                notes,

            });

            }}
            className="
                mt-6
                w-full
                rounded-lg
                bg-blue-600
                py-3
                text-white
            "

            >

            Submit Checklist

            </button>

      </div>

    </div>

  );

}