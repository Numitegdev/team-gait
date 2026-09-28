"use client";
import {

useEffect,

 } from "react";
 import {

   useMutationForm,

 } from "../hooks/use-mutation-form";
interface MutationRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MutationRequestModal({
   open,

  onClose,

  onSuccess,
}: MutationRequestModalProps) {
const {
  form,
  loading,
  assets,
  companies,
  locations,
  loadMasterData,
  handleChange,
  handleSubmit,
} = useMutationForm();

const selectedAsset = assets.find(
  (asset) => asset.id === form.asset_id
);

useEffect(() => {

  if (!open) return;

  loadMasterData();

}, [open]);

  if (!open) return null;

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
        rounded-2xl
        bg-white
        shadow-xl
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          p-6
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-bold
            "
          >

            Request Asset Mutation

          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >

            Buat permintaan perpindahan asset.

          </p>

        </div>

        <button

          onClick={onClose}

          className="
            text-2xl
            text-gray-400
            hover:text-gray-600
          "

        >

          ×

        </button>

      </div>

      {/* Body */}

     {/* Body */}

<div
  className="
    space-y-5
    p-6
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

      Asset

    </label>

    <select

      value={form.asset_id}

     onChange={(e) => {

  const assetId = Number(e.target.value);

  handleChange(
    "asset_id",
    assetId
  );

  const asset = assets.find(
    (x) => x.id === assetId
  );

  if (asset) {

    handleChange(
      "from_company_id",
      asset.company_id
    );

    handleChange(
      "from_location_id",
      asset.location_id
    );

  }

}}

      className="
        w-full
        rounded-xl
        border
        px-4
        py-3
        outline-none
        focus:border-blue-500
      "

    >

      <option value={0}>

        -- Pilih Asset --

      </option>

      {assets.map((asset) => (

        <option

          key={asset.id}

          value={asset.id}

        >

          {asset.asset_code} - {asset.asset_name}

        </option>

      ))}

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
    From Company
  </label>

  <input

    readOnly

    value={

      companies.find(
        (c) =>
          c.id === form.from_company_id
      )?.name ?? ""

    }

    className="
      w-full
      rounded-xl
      border
      bg-gray-100
      px-4
      py-3
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
    From Location
  </label>

  <input

    readOnly

    value={

      locations.find(
        (l) =>
          l.id === form.from_location_id
      )?.name ?? ""

    }

    className="
      w-full
      rounded-xl
      border
      bg-gray-100
      px-4
      py-3
    "

  />

</div>

<div
  className="
    grid
    gap-5
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
    To Company
  </label>

  <select

    value={form.to_company_id}

    onChange={(e) =>

      handleChange(
        "to_company_id",
        Number(e.target.value)
      )

    }

    className="
      w-full
      rounded-xl
      border
      px-4
      py-3
      outline-none
      focus:border-blue-500
    "

  >

    <option value={0}>
      -- wajib pilih company --
    </option>

    {companies.map((company) => (

      <option

        key={company.id}

        value={company.id}

      >

        {company.name}

      </option>

    ))}

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
    To Location
  </label>

  <select

    value={form.to_location_id}

    onChange={(e) =>

      handleChange(
        "to_location_id",
        Number(e.target.value)
      )

    }

    className="
      w-full
      rounded-xl
      border
      px-4
      py-3
      outline-none
      focus:border-blue-500
    "

  >

    <option value={0}>
      -- Tetap di lokasi sekarang --
    </option>

    {locations
  .filter(
    (location) =>
      location.id !==
      form.from_location_id
  )
  .map((location) => (

      <option

        key={location.id}

        value={location.id}

      >

        {location.name}

      </option>

    ))}

  </select>

</div>

</div>

<div
  className="
    mt-5
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
    Remarks
  </label>

  <textarea

    value={form.remarks}

    onChange={(e) =>

      handleChange(
        "remarks",
        e.target.value
      )

    }

    rows={4}

    placeholder="
      Contoh:
      Dipindahkan ke ruang meeting karena digunakan oleh Finance.
    "

    className="
      w-full
      rounded-xl
      border
      px-4
      py-3
      outline-none
      focus:border-blue-500
      resize-none
    "

  />

</div>

</div>

      {/* Footer */}

      <div
        className="
          flex
          justify-end
          gap-3
          border-t
          p-6
        "
      >

        <button

          onClick={onClose}

          className="
            rounded-xl
            border
            px-5
            py-2
          "

        >

          Cancel

        </button>

        <button

       onClick={async () => {

        const success = await handleSubmit();

        if (success) {

          onSuccess();

        }

      }}

          className="
            rounded-xl
            bg-blue-600
            px-5
            py-2
            font-medium
            text-white
            hover:bg-blue-700
            disabled:opacity-50
          "

        >

          Submit

        </button>

      </div>

    </div>

  </div>

);

}