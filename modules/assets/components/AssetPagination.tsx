"use client";

import {

  ChevronLeft,

  ChevronRight,

} from "lucide-react";

interface AssetPaginationProps {

  page: number;

  totalPages: number;

  setPage: (
    page: number
  ) => void;

}

export default function AssetPagination({

  page,

  totalPages,

  setPage,

}: AssetPaginationProps) {

  return (

    <div
      className="
        mt-5
        flex
        items-center
        justify-between
      "
    >

      <button

        disabled={page === 1}

        onClick={() =>
          setPage(page - 1)
        }

        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          px-4
          py-2
          disabled:opacity-40
        "

      >

        <ChevronLeft size={18} />

        Previous

      </button>

      <span
        className="
          text-sm
          font-medium
        "
      >

        Page {page} of {totalPages}

      </span>

      <button

        disabled={
          page === totalPages
        }

        onClick={() =>
          setPage(page + 1)
        }

        className="
          flex
          items-center
          gap-2
          rounded-xl
          border
          px-4
          py-2
          disabled:opacity-40
        "

      >

        Next

        <ChevronRight size={18} />

      </button>

    </div>

  );

}