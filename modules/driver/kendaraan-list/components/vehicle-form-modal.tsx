"use client";

import {
  useEffect,
  useState,
} from "react";

interface Props {

  open: boolean;

  onClose: () => void;

  onSubmit: (
    payload: {
     plat_nomor: string;
    nama_kendaraan: string;
    photo?: File | null;
    }
  ) => void;

  vehicle?: any;

}

export function VehicleFormModal({

  open,

  onClose,

  onSubmit,

  vehicle,

}: Props) {

  const [
        photo,
        setPhoto,
        ] = useState<File | null>(
        null
        );

  const [
    platNomor,
    setPlatNomor,
  ] = useState("");

  const [
    namaKendaraan,
    setNamaKendaraan,
  ] = useState("");

  useEffect(() => {

    if (vehicle) {

      setPlatNomor(
        vehicle.plat_nomor
      );

      setNamaKendaraan(
        vehicle.nama_kendaraan
      );

    } else {

      setPlatNomor("");

      setNamaKendaraan("");

    }

  }, [vehicle]);

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
        max-w-lg
        rounded-2xl
        bg-white
        shadow-xl
        max-h-[90vh]
        overflow-y-auto
      "
    >

      <div
        className="
          border-b
          p-5
        "
      >

        <h2
          className="
            text-xl
            font-bold
          "
        >

          {
            vehicle
              ? "Edit Kendaraan"
              : "Tambah Kendaraan"
          }

        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >

          Lengkapi informasi kendaraan.

        </p>

      </div>

      <div
        className="
          space-y-4
          p-5
        "
      >

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >

            Plat Nomor

          </label>

          <input

            value={platNomor}

            onChange={(e) =>
              setPlatNomor(
                e.target.value
              )
            }

            placeholder="
              Contoh: AB 1234 CD
            "

            className="
              w-full
              rounded-xl
              border
              bg-slate-50
              p-3
            "

          />

        </div>

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >

            Nama Kendaraan

          </label>

          <input

            value={namaKendaraan}

            onChange={(e) =>
              setNamaKendaraan(
                e.target.value
              )
            }

            placeholder="
              Contoh: Toyota Avanza
            "

            className="
              w-full
              rounded-xl
              border
              bg-slate-50
              p-3
            "

          />

        </div>

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >

            Foto Kendaraan

          </label>

          <input

            type="file"

            accept="image/*"

            onChange={(e) =>

              setPhoto(
                e.target.files?.[0]
                || null
              )

            }

            className="
              w-full
              rounded-xl
              border
              bg-slate-50
              p-3
            "

          />

          {

            photo && (

              <div
                className="
                  mt-2
                  text-sm
                  text-green-600
                "
              >

                ✓ {photo.name}

              </div>

            )

          }

        </div>

      </div>

      <div
        className="
          flex
          flex-col-reverse
          gap-2
          border-t
          p-5
          md:flex-row
          md:justify-end
        "
      >

        <button

          onClick={onClose}

          className="
            rounded-xl
            border
            px-5
            py-3
          "

        >

          Batal

        </button>

        <button

          onClick={() =>

            onSubmit({

              plat_nomor:
                platNomor,

              nama_kendaraan:
                namaKendaraan,

              photo,

            })

          }

          className="
            rounded-xl
            bg-blue-600
            px-5
            py-3
            text-white
          "

        >

          Simpan Kendaraan

        </button>

      </div>

    </div>

  </div>

);
}