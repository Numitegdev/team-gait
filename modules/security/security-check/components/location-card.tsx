"use client";

interface Props {

  locationId: number;

  locationName: string;

  value: {

    lokasi_id: number;

    file: File | null;

    status: string;

    catatan: string;

  };

  onChange: (
    value: any
  ) => void;

}

export function LocationCard({

  locationId,

  locationName,

  value,

  onChange,

}: Props) {

  return (

    <div
      className="
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
      "
    >

      <h3
        className="
          mb-4
          text-lg
          font-semibold
        "
      >

        📍 {locationName}

      </h3>

      <div
        className="
          space-y-4
        "
      >

        <label
          className="
            flex
            min-h-45
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-2xl
            border-2
            border-dashed
            border-slate-300
            bg-slate-50
            p-6
            text-center
            transition
            hover:border-blue-500
            hover:bg-blue-50
          "
        >

          <input

            type="file"

            accept="image/*"

            capture="environment"

            className="hidden"

            onChange={(e) => {

              const file =
                e.target.files?.[0]
                || null;

              onChange({

                ...value,

                lokasi_id:
                  locationId,

                file,

              });

            }}

          />

          {!value.file ? (

            <>

              <div
                className="
                  mb-2
                  text-4xl
                "
              >

                📷

              </div>

              <div
                className="
                  font-medium
                "
              >

                Klik untuk Upload Foto

              </div>

              <div
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >

                JPG, PNG, WEBP

              </div>

            </>

          ) : (

            <>

              <div
                className="
                  text-4xl
                "
              >

                ✅

              </div>

              <div
                className="
                  mt-2
                  font-medium
                  text-green-600
                "
              >

                Foto Dipilih

              </div>

              <div
                className="
                  mt-1
                  break-all
                  text-sm
                  text-slate-600
                "
              >

                {value.file.name}

              </div>

            </>

          )}

        </label>

        <select

          value={value.status}

          onChange={(e) =>

            onChange({

              ...value,

              lokasi_id:
                locationId,

              status:
                e.target.value,

            })

          }

          className="
            w-full
            rounded-xl
            border
            p-3
          "

        >

          <option value="">
            Pilih Status
          </option>

          <option value="Aman">
            ✅ Aman
          </option>

          <option value="Kerusakan">
            ⚠️ Terdapat Kerusakan
          </option>

          <option value="Other">
            📝 Other
          </option>

        </select>

        <textarea

          rows={3}

          value={value.catatan}

          onChange={(e) =>

            onChange({

              ...value,

              lokasi_id:
                locationId,

              catatan:
                e.target.value,

            })

          }

          placeholder="
Catatan lokasi
"

          className="
            w-full
            rounded-xl
            border
            p-3
          "

        />

      </div>

    </div>

  );

}