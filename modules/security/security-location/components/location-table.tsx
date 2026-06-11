"use client";

interface Props {

  data: any[];

  onToggle: (
    id: number,
    aktif: boolean
  ) => Promise<void>;

   onEdit: (
    id: number,
    nama: string
  ) => Promise<void>;

}
import {
  Eye,
  EyeOff,
} from "lucide-react";

export function LocationTable({

  data,

  onToggle,

  onEdit,

}: Props) {

  return (

    <div
      className="
        overflow-hidden
        rounded-xl
        border
        bg-white
      "
    >

      <table
        className="
          w-full
        "
      >

        <thead
          className="
            bg-slate-100
          "
        >

          <tr>

            <th
              className="
                p-4
                text-left
              "
            >
              Nama Lokasi
            </th>

            <th
              className="
                p-4
                text-left
              "
            >
              Status
            </th>

            <th
              className="
                p-4
                text-center
              "
            >
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map(
            (item) => (

              <tr
                key={item.id}
                className="
                  border-t
                "
              >

                <td
                  className="
                    p-4
                  "
                >

                  {
                    item.nama_lokasi
                  }

                </td>

                <td
                  className="
                    p-4
                  "
                >

                  {item.aktif
                    ? "Aktif"
                    : "Nonaktif"}

                </td>

                <td
                  className="
                    p-4
                    text-center
                  "
                >

                  <button

                    onClick={() =>
                      onToggle(
                        item.id,
                        !item.aktif
                      )
                    }

                    title={
                      item.aktif
                        ? "Nonaktifkan"
                        : "Aktifkan"
                    }

                    className={`
                      rounded-lg
                      p-2
                      text-white
                      mr-3
                      transition
                      hover:scale-105
                      ${
                        item.aktif
                          ? "bg-blue-600"
                          : "bg-slate-400"
                      }
                    `}
                  >

                    {item.aktif ? (

                      <Eye
                        size={18}
                      />

                    ) : (

                      <EyeOff
                        size={18}
                      />

                    )}

                  </button>

                    <button

                    onClick={async () => {

                        const namaBaru =
                        prompt(
                            "Edit Nama Lokasi",
                            item.nama_lokasi
                        );

                        if (
                        !namaBaru
                        )
                        return;

                        await onEdit(
                        item.id,
                        namaBaru
                        );

                    }}

                    className="
                        rounded-lg
                        bg-amber-500
                        px-3
                        py-2
                        text-white
                        mr-2
                    "
                    >

                    Edit

                    </button>




                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}