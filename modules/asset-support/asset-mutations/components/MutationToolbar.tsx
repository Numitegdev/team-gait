"use client";

interface MutationToolbarProps {

  onCreate: () => void;

}

export default function MutationToolbar({

  onCreate,

}: MutationToolbarProps) {


  return (

    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >

      <div>

        <h1
          className="
            text-3xl
            font-bold
          "
        >

          Asset Mutation

        </h1>

        <p
          className="
            text-sm
            text-gray-500
          "
        >

          Kelola perpindahan asset.

        </p>

      </div>

      <button

        onClick={onCreate}

        className="
          rounded-xl
          bg-blue-600
          px-5
          py-3
          font-medium
          text-white
          hover:bg-blue-700
        "

      >

        + Request Mutation

      </button>

    </div>

  );

}