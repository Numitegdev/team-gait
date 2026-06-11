"use client";

import {
useState,
} from "react";

interface Props {

onSubmit: (
payload: any
) => Promise<void>;

}

export function TaskForm({

onSubmit,

}: Props) {

const [


form,

setForm,


] = useState({


jenis:
  "pengiriman",

pengirim:
  "",

penerima:
  "",

nomor_resi:
  "",

deskripsi:
  "",


});

const [


taskPhoto,

setTaskPhoto,


] = useState<File>();

async function handleSubmit(
e: React.FormEvent
) {


e.preventDefault();

await onSubmit({

  ...form,

  taskPhoto,

});

setForm({

  jenis:
    "pengiriman",

  pengirim:
    "",

  penerima:
    "",

  nomor_resi:
    "",

  deskripsi:
    "",

});

setTaskPhoto(
  undefined
);


}

return (


<form

  onSubmit={
    handleSubmit
  }

  className="
    space-y-6
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
          text-sm
          font-medium
        "
      >

        Jenis Task

      </label>

      <select

        value={
          form.jenis
        }

        onChange={(e) =>

          setForm({

            ...form,

            jenis:
              e.target
                .value,

          })

        }

        className="
          w-full
          rounded-lg
          border
          px-3
          py-2
        "

      >

        <option value="pengiriman">
          Pengiriman
        </option>

        <option value="penerimaan">
          Penerimaan
        </option>

      </select>

    </div>

    <div>

      <label
        className="
          mb-2
          block
          text-sm
          font-medium
        "
      >

        Foto Barang

      </label>

      <input

        type="file"

        accept="image/*"

        onChange={(e) =>

          setTaskPhoto(
            e.target.files?.[0]
          )

        }

        className="
          w-full
          rounded-lg
          border
          p-2
        "

      />

      {

        taskPhoto && (

          <p
            className="
              mt-2
              text-xs
              text-slate-500
            "
          >

            {taskPhoto.name}

          </p>

        )

      }

    </div>

    <div>

      <label
        className="
          mb-2
          block
          text-sm
          font-medium
        "
      >

        Pengirim

      </label>

      <input

        value={
          form.pengirim
        }

        onChange={(e) =>

          setForm({

            ...form,

            pengirim:
              e.target
                .value,

          })

        }

        placeholder="
          Nama pengirim
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

    <div>

      <label
        className="
          mb-2
          block
          text-sm
          font-medium
        "
      >

        Penerima

      </label>

      <input

        value={
          form.penerima
        }

        onChange={(e) =>

          setForm({

            ...form,

            penerima:
              e.target
                .value,

          })

        }

        placeholder="
          Nama penerima
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

    <div
      className="
        md:col-span-2
      "
    >

      <label
        className="
          mb-2
          block
          text-sm
          font-medium
        "
      >

        Nomor Resi

      </label>

      <input

        value={
          form.nomor_resi
        }

        onChange={(e) =>

          setForm({

            ...form,

            nomor_resi:
              e.target
                .value,

          })

        }

        placeholder="
          Masukkan nomor resi
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

    <div
      className="
        md:col-span-2
      "
    >

      <label
        className="
          mb-2
          block
          text-sm
          font-medium
        "
      >

        Deskripsi

      </label>

      <textarea

        rows={4}

        value={
          form.deskripsi
        }

        onChange={(e) =>

          setForm({

            ...form,

            deskripsi:
              e.target
                .value,

          })

        }

        placeholder="
          Tambahkan deskripsi task
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

  </div>

  <div
    className="
      flex
      justify-end
    "
  >

    <button

      type="submit"

      className="
        rounded-lg
        bg-blue-600
        px-6
        py-3
        font-medium
        text-white
        transition
        hover:bg-blue-700
      "

    >

      Simpan Task

    </button>

  </div>

</form>


);

}
