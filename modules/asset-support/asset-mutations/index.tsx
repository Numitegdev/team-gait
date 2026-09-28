"use client";

import MutationToolbar
from "./components/MutationToolbar";

import MutationTable
from "./components/MutationTable";

import {
  useMutations,
} from "./hooks/use-mutations";

import { useMemo, useState } from "react";

import MutationRequestModal
from "./components/MutationRequestModal";

import MutationDetailModal
from "./components/MutationDetailModal";

export default function AssetMutationPage() {

const [

  selectedMutation,

  setSelectedMutation,

] = useState<number | null>(null);

const [

  openDetail,

  setOpenDetail,

] = useState(false);

    const [

    openMutationModal,

    setOpenMutationModal,

    ] = useState(false);

    const [search, setSearch] =
  useState("");

const [statusFilter, setStatusFilter] =
  useState("ALL");

  const [fromCompanyFilter, setFromCompanyFilter] =
  useState("ALL");

const [toCompanyFilter, setToCompanyFilter] =
  useState("ALL");

const {
  mutations,

  loading,

  reload,

  page,

  pageSize,

  total,

  totalPages,

  setPageSize,

  nextPage,

  previousPage,

} = useMutations({

  search,

  status:
    statusFilter,

  fromCompanyId:
    fromCompanyFilter === "ALL"
      ? null
      : Number(fromCompanyFilter),

  toCompanyId:
    toCompanyFilter === "ALL"
      ? null
      : Number(toCompanyFilter),

});

const fromCompanyOptions =
  useMemo(() => {

    const companies = new Map<
      number,
      string
    >();

    mutations.forEach((mutation) => {

      if (
        mutation.from_company_id &&
        mutation.from_company?.name
      ) {

        companies.set(
          mutation.from_company_id,
          mutation.from_company.name
        );

      }

    });

    return Array.from(
      companies.entries()
    ).sort((a, b) =>
      a[1].localeCompare(b[1])
    );

  }, [mutations]);


const toCompanyOptions =
  useMemo(() => {

    const companies = new Map<
      number,
      string
    >();

    mutations.forEach((mutation) => {

      if (
        mutation.to_company_id &&
        mutation.to_company?.name
      ) {

        companies.set(
          mutation.to_company_id,
          mutation.to_company.name
        );

      }

    });

    return Array.from(
      companies.entries()
    ).sort((a, b) =>
      a[1].localeCompare(b[1])
    );

  }, [mutations]);



const [
  detailOpen,
  setDetailOpen,
] = useState(false);

const [
  selectedMutationId,
  setSelectedMutationId,
] = useState<number | null>(null);

  return (

    <div
      className="
        space-y-6
      "
    >

    <MutationToolbar

        onCreate={() =>

            setOpenMutationModal(true)

        }

        />

  <div
    className="
      grid
      gap-3
      md:grid-cols-4
    "
  >

    {/* Search */}

    <input
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
      placeholder="
        Cari mutation no, asset code, atau asset name...
      "
      className="
        h-11
        rounded-xl
        border
        px-4
        outline-none
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-100
        md:col-span-2
      "
    />

    {/* Status */}

    <select
      value={statusFilter}
      onChange={(e) =>
        setStatusFilter(e.target.value)
      }
      className="
        h-11
        rounded-xl
        border
        bg-white
        px-4
        outline-none
        focus:border-blue-500
      "
    >

      <option value="ALL">
        Semua Status
      </option>

      <option value="PENDING">
        Pending
      </option>

      <option value="APPROVED">
        Approved
      </option>

      <option value="REJECTED">
        Rejected
      </option>

      <option value="EXECUTED">
        Executed
      </option>

    </select>

    {/* From Company */}

    <select
      value={fromCompanyFilter}
      onChange={(e) =>
        setFromCompanyFilter(
          e.target.value
        )
      }
      className="
        h-11
        rounded-xl
        border
        bg-white
        px-4
        outline-none
        focus:border-blue-500
      "
    >

      <option value="ALL">
        Semua From Company
      </option>

      {fromCompanyOptions.map(
        ([id, name]) => (

          <option
            key={id}
            value={id}
          >
            From: {name}
          </option>

        )
      )}

    </select>

    {/* To Company */}

    <select
      value={toCompanyFilter}
      onChange={(e) =>
        setToCompanyFilter(
          e.target.value
        )
      }
      className="
        h-11
        rounded-xl
        border
        bg-white
        px-4
        outline-none
        focus:border-blue-500
      "
    >

      <option value="ALL">
        Semua To Company
      </option>

      {toCompanyOptions.map(
        ([id, name]) => (

          <option
            key={id}
            value={id}
          >
            To: {name}
          </option>

        )
      )}

    </select>

  </div>

<MutationTable

  mutations={mutations}

  loading={loading}

  onView={(id) => {

    setSelectedMutationId(id);

    setDetailOpen(true);

  }}

/>


{/* Pagination */}

<div
  className="
    flex
    flex-col
    gap-4
    rounded-xl
    border
    bg-white
    p-4
    md:flex-row
    md:items-center
    md:justify-between
  "
>

  {/* Info */}

  <div
    className="
      text-sm
      text-gray-500
    "
  >

    {total === 0 ? (

      "Tidak ada mutation"

    ) : (

      <>
        Menampilkan{" "}
        <span
          className="
            font-medium
            text-gray-700
          "
        >
          {(page - 1) * pageSize + 1}
        </span>

        {" - "}

        <span
          className="
            font-medium
            text-gray-700
          "
        >
          {Math.min(
            page * pageSize,
            total
          )}
        </span>

        {" dari "}

        <span
          className="
            font-medium
            text-gray-700
          "
        >
          {total}
        </span>

        {" mutation"}

      </>

    )}

  </div>


  {/* Controls */}

  <div
    className="
      flex
      items-center
      justify-between
      gap-3
      md:justify-end
    "
  >

    {/* Page Size */}

    <div
      className="
        flex
        items-center
        gap-2
      "
    >

      <span
        className="
          hidden
          text-sm
          text-gray-500
          sm:block
        "
      >
        Per halaman
      </span>

      <select

        value={pageSize}

        onChange={(e) =>
          setPageSize(
            Number(
              e.target.value
            )
          )
        }

        className="
          h-9
          rounded-lg
          border
          bg-white
          px-3
          text-sm
          outline-none
          focus:border-blue-500
        "

      >

        <option value={10}>
          10
        </option>

        <option value={25}>
          25
        </option>

        <option value={50}>
          50
        </option>

      </select>

    </div>


    {/* Previous */}

    <button

      type="button"

      onClick={previousPage}

      disabled={
        loading ||
        page <= 1
      }

      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        text-sm
        transition
        hover:bg-gray-50
        disabled:cursor-not-allowed
        disabled:opacity-40
      "

    >

      ←

    </button>


    {/* Page Indicator */}

    <div
      className="
        min-w-17.5
        text-center
        text-sm
        font-medium
        text-gray-700
      "
    >

      {page}

      <span
        className="
          mx-1
          text-gray-400
        "
      >
        /
      </span>

      {totalPages || 1}

    </div>


    {/* Next */}

    <button

      type="button"

      onClick={nextPage}

      disabled={
        loading ||
        page >= totalPages
      }

      className="
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        text-sm
        transition
        hover:bg-gray-50
        disabled:cursor-not-allowed
        disabled:opacity-40
      "

    >

      →

    </button>

  </div>

</div>

{/* batas pagination */}

      <MutationRequestModal

        open={openMutationModal}

        onClose={() =>

            setOpenMutationModal(false)

        }

        onSuccess={() => {

            setOpenMutationModal(false);

            reload();

        }}

        />

<MutationDetailModal

  open={detailOpen}

  mutationId={selectedMutationId}

  onClose={() => {

    setDetailOpen(false);

  }}

  onSuccess={() => {

    setDetailOpen(false);

    setSelectedMutationId(null);

    reload();

  }}

/>   

    </div>

  );

}


