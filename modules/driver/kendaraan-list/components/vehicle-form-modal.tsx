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
        z-50
        flex
        items-center
        justify-center
        bg-black/40
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
            mb-4
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

        <div className="space-y-4">

          <input

            value={platNomor}

            onChange={(e) =>
              setPlatNomor(
                e.target.value
              )
            }

            placeholder="Plat Nomor"

            className="
              w-full
              rounded-lg
              border
              px-3
              py-2
            "

          />

          <input

            value={
              namaKendaraan
            }

            onChange={(e) =>
              setNamaKendaraan(
                e.target.value
              )
            }

            placeholder="
              Nama Kendaraan
            "

            className="
              w-full
              rounded-lg
              border
              px-3
              py-2
            "

          />

        </div>

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
                rounded-lg
                border
                px-3
                py-2
            "

            />

        <div
          className="
            mt-6
            flex
            justify-end
            gap-2
          "
        >

          <button

            onClick={onClose}

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