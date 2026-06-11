"use client";

import {
  useState,
} from "react";

import {
  useSecurityCheck,
} from "./hooks/use-security-check";

import {
  LocationCard,
} from "./components/location-card";

export default function SecurityCheckPage() {

const {

  locations,

  loading,

  saveCheck,

  petugas,

} =
  useSecurityCheck();

  const [

    shift,

    setShift,

  ] =
    useState("");

  const [

    catatan,

    setCatatan,

  ] =
    useState("");

  const [

    details,

    setDetails,

  ] =
    useState<any[]>([]);

  // sementara hardcode
  // nanti diganti user login


  function updateLocation(

    locationId: number,

    value: any

  ) {

    setDetails((prev) => {

      const exists =
        prev.find(

          (item) =>

            item.lokasi_id ===
            locationId

        );

      if (exists) {

        return prev.map(

          (item) =>

            item.lokasi_id ===
            locationId

              ? value

              : item

        );

      }

      return [

        ...prev,

        value,

      ];

    });

  }

  async function handleSubmit() {

    if (!shift) {

      alert(
        "Pilih shift terlebih dahulu"
      );

      return;

    }

    await saveCheck({

      shift,

      petugas,

      catatan,

      details,

    });

    alert(
      "Data berhasil disimpan"
    );

    setShift("");

    setCatatan("");

    setDetails([]);

  }

  return (

    <div
      className="
        space-y-6
      "
    >

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >

          Security Check

        </h1>

        <p
          className="
            text-slate-500
          "
        >

          Form pengecekan ruangan

        </p>

      </div>

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-6
        "
      >

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >

          <div>

            <label
              className="
                mb-2
                block
                font-medium
              "
            >

              Nama Petugas

            </label>

            <input

              value={
                petugas
              }

              readOnly

              className="
                w-full
                rounded-xl
                border
                p-3
                bg-slate-100
              "
            />

          </div>

          <div>

            <label
              className="
                mb-2
                block
                font-medium
              "
            >

              Shift

            </label>

            <select

              value={
                shift
              }

              onChange={(e) =>
                setShift(
                  e.target.value
                )
              }

              className="
                w-full
                rounded-xl
                border
                p-3
              "
            >

              <option value="">
                Pilih Shift
              </option>

              <option value="Pagi">
                Pagi
              </option>

              <option value="Siang">
                Siang
              </option>

              <option value="Malam">
                Malam
              </option>

            </select>

          </div>

        </div>

      </div>

      <div
        className="
          grid
          gap-4
          lg:grid-cols-2
        "
      >

        {locations.map(
          (location) => (

            <LocationCard

              key={
                location.id
              }

              locationId={
                location.id
              }

              locationName={
                location.nama_lokasi
              }

              value={

                details.find(

                  (item) =>

                    item.lokasi_id ===
                    location.id

                ) || {

                  lokasi_id:
                    location.id,

                  file:
                    null,

                  status:
                    "",

                  catatan:
                    "",

                }

              }

              onChange={(
                value
              ) =>

                updateLocation(

                  location.id,

                  value

                )

              }

            />

          )
        )}

      </div>

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-6
        "
      >

        <label
          className="
            mb-2
            block
            font-medium
          "
        >

          Catatan Tambahan

        </label>

        <textarea

          rows={4}

          value={
            catatan
          }

          onChange={(e) =>
            setCatatan(
              e.target.value
            )
          }

          className="
            w-full
            rounded-xl
            border
            p-3
          "

        />

      </div>

      <button

        onClick={
          handleSubmit
        }

        disabled={
          loading
        }

        className="
          rounded-xl
          bg-blue-600
          px-6
          py-3
          font-medium
          text-white
        "
      >

        {loading

          ? "Menyimpan..."

          : "Submit"

        }

      </button>

    </div>

  );

}