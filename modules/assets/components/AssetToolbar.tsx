"use client";

import { Plus } from "lucide-react";

interface AssetToolbarProps {

  search: string;

  setSearch: (
    value: string
  ) => void;

  onAdd: () => void;

}

export default function AssetToolbar({

  search,

  setSearch,

  onAdd,

}: AssetToolbarProps) {

  return (

    <div
      className="
        mb-5
        flex
        flex-col
        gap-3
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >

      <div
        className="
          flex
          flex-1
          flex-col
          gap-3
          md:flex-row
        "
      >

        <input

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          placeholder="Cari asset..."

          className="
            h-11
            w-full
            rounded-xl
            border
            px-4
            outline-none
            focus:border-blue-500
          "

        />

        <select

          disabled

          className="
            h-11
            rounded-xl
            border
            px-3
            text-gray-500
          "

        >

          <option>

            Company

          </option>

        </select>

        <select

          disabled

          className="
            h-11
            rounded-xl
            border
            px-3
            text-gray-500
          "

        >

          <option>

            Category

          </option>

        </select>

        <select

          disabled

          className="
            h-11
            rounded-xl
            border
            px-3
            text-gray-500
          "

        >

          <option>

            Status

          </option>

        </select>

      </div>

      <button

        onClick={onAdd}

        className="
          flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          px-5
          font-medium
          text-white
          hover:bg-blue-700
        "

      >

        <Plus size={18} />

        Add Asset

      </button>

    </div>

  );

}