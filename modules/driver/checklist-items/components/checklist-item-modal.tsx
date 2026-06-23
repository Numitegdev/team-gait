"use client";

import {
  useEffect,
  useState,
} from "react";

interface Props {

  open: boolean;

  onClose: () => void;

  item?: any;

  onSubmit: (
    payload: any
  ) => void;

}

export function ChecklistItemModal({

  open,

  onClose,

  item,

  onSubmit,

}: Props) {

  const [

    name,

    setName,

  ] = useState(
    ""
  );

  useEffect(() => {

    if (item) {

      setName(
        item.name
      );

    } else {

      setName(
        ""
      );

    }

  }, [item]);

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
          max-w-md
          rounded-xl
          bg-white
          p-6
        "
      >

        <h2
          className="
            text-xl
            font-bold
          "
        >

          {

            item

              ? "Edit Checklist Item"

              : "Tambah Checklist Item"

          }

        </h2>

        <div
          className="
            mt-4
          "
        >

          <label
            className="
              text-sm
              font-medium
            "
          >

            Nama Item

          </label>

          <input

            value={
              name
            }

            onChange={(e) =>

              setName(
                e.target.value
              )

            }

            className="
              mt-2
              w-full
              rounded-lg
              border
              p-3
            "

            placeholder="
              Contoh:
              Oli Mesin
            "

          />

        </div>

        <div
          className="
            mt-6
            flex
            justify-end
            gap-2
          "
        >

          <button

            onClick={
              onClose
            }

            className="
              rounded-lg
              border
              px-4
              py-2
            "

          >

            Batal

          </button>

          <button

            onClick={() => {

              if (
                !name.trim()
              ) {

                alert(
                  "Nama item wajib diisi"
                );

                return;

              }

              onSubmit({

                name,

                active:
                  true,

              });

            }}

            className="
              rounded-lg
              bg-blue-600
              px-4
              py-2
              text-white
            "

          >

            Simpan

          </button>

        </div>

      </div>

    </div>

  );

}