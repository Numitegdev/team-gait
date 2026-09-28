"use client";

import {
  useMemo,
   useEffect,
  useState,
} from "react";

import AssetLoanTable
  from "./components/AssetLoanTable";

import AssetLoanDetailModal
  from "./components/AssetLoanDetailModal";

import AssetLoanCreateModal
  from "./components/AssetLoanCreateModal";

import {
  useAssetLoans,
} from "./hooks/use-asset-loans";

import { createClient } from "@/lib/supabase/client";


export default function AssetLoansPage() {

  // ==========================================
  // FILTER
  // ==========================================

  const [
    search,
    setSearch,
  ] = useState("");


  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ALL");

const [
  companies,
  setCompanies,
] = useState<
  {
    id: number;
    name: string;
  }[]
>([]);

  const [
    ownerCompanyFilter,
    setOwnerCompanyFilter,
  ] = useState("ALL");


  const [
    borrowerCompanyFilter,
    setBorrowerCompanyFilter,
  ] = useState("ALL");


  // ==========================================
  // ASSET LOANS
  // ==========================================

  const {
    loans,
    loading,
    reload,

    approveLoan,
    rejectLoan,
    executeLoan,
    returnLoan,

    currentUserCompanyId,
    isItAdmin,

    page,
    pageSize,
    total,
    totalPages,

    setPageSize,
    nextPage,
    previousPage,

  } = useAssetLoans({

    search,

    status:
      statusFilter,

    ownerCompanyId:
      ownerCompanyFilter === "ALL"
        ? null
        : Number(
            ownerCompanyFilter
          ),

    borrowerCompanyId:
      borrowerCompanyFilter === "ALL"
        ? null
        : Number(
            borrowerCompanyFilter
          ),

  });


  // ==========================================
  // MODAL
  // ==========================================

  const [
    selectedLoanId,
    setSelectedLoanId,
  ] = useState<
    number | null
  >(null);


  const [
    detailOpen,
    setDetailOpen,
  ] = useState(false);


  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);


  useEffect(() => {

  async function loadCompanies() {

    try {

      const supabase =
        createClient();


      const {
        data,
        error,
      } =
        await supabase

          .from("companies")

          .select(`
            id,
            name
          `)

          .order(
            "name",
            {
              ascending: true,
            }
          );


      if (error) {
        throw error;
      }


      setCompanies(
        data ?? []
      );

    } catch (error) {

      console.error(
        "Gagal load companies:",
        error
      );

    }

  }


  loadCompanies();

}, []);

  // ==========================================
  // COMPANY OPTIONS
  // ==========================================
  //
  // Untuk sementara kita ambil dari loan
  // yang tersedia.
  //
  // Nanti kalau diperlukan kita bisa pindahkan
  // ke master companies.
  //

  // const companyOptions =
  //   useMemo(() => {

  //     const companies =
  //       new Map<
  //         number,
  //         string
  //       >();


  //     loans.forEach(
  //       (loan) => {

  //         if (
  //           loan.owner_company_id &&
  //           loan.owner_company?.name
  //         ) {

  //           companies.set(
  //             loan.owner_company_id,
  //             loan.owner_company.name
  //           );

  //         }


  //         if (
  //           loan.borrower_company_id &&
  //           loan.borrower_company?.name
  //         ) {

  //           companies.set(
  //             loan.borrower_company_id,
  //             loan.borrower_company.name
  //           );

  //         }

  //       }
  //     );


  //     return Array.from(
  //       companies.entries()
  //     ).sort(
  //       (a, b) =>
  //         a[1].localeCompare(
  //           b[1]
  //         )
  //     );

  //   }, [
  //     loans,
  //   ]);


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <div
      className="
        space-y-6
      "
    >

      {/* =====================================
          HEADER
      ====================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            Asset Loan
          </h1>


          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Kelola peminjaman asset antar company.
          </p>

        </div>


        <button
          type="button"

          onClick={() =>
            setCreateOpen(true)
          }

          className="
            rounded-xl
            bg-black
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            hover:bg-gray-800
          "
        >
          + Tambah Peminjaman
        </button>

      </div>


      {/* =====================================
          FILTER
      ====================================== */}

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
            setSearch(
              e.target.value
            )
          }

          placeholder="
            Cari loan no, asset code, atau asset name...
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

          value={
            statusFilter
          }

          onChange={(e) =>
            setStatusFilter(
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
            Semua Status
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="RETURNED">
            Returned
          </option>

          <option value="REJECTED">
            Rejected
          </option>

          <option value="CANCELLED">
            Cancelled
          </option>

        </select>


        {/* Owner */}

        <select

          value={
            ownerCompanyFilter
          }

          onChange={(e) =>
            setOwnerCompanyFilter(
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
            Semua Owner Company
          </option>


          {companies.map(
              (company) => (

                <option
                  key={company.id}
                  value={company.id}
                >
                  Owner: {company.name}
                </option>

              )
            )}

        </select>


        {/* Borrower */}

        <select

          value={
            borrowerCompanyFilter
          }

          onChange={(e) =>
            setBorrowerCompanyFilter(
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
            Semua Borrower Company
          </option>


          {companies.map(
  (company) => (

    <option
      key={company.id}
      value={company.id}
    >
      Borrower: {company.name}
    </option>

  )
)}

        </select>

      </div>


      {/* =====================================
          TABLE
      ====================================== */}

      <AssetLoanTable

        loans={
          loans
        }

        loading={
          loading
        }

        onView={(id) => {

          setSelectedLoanId(
            id
          );

          setDetailOpen(
            true
          );

        }}

        onApprove={
          approveLoan
        }

        onReject={
          rejectLoan
        }

        onExecute={
          executeLoan
        }

        onReturn={
          returnLoan
        }

        currentUserCompanyId={
          currentUserCompanyId
        }

        isItAdmin={
          isItAdmin
        }

      />


      {/* =====================================
          PAGINATION
      ====================================== */}

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

            "Tidak ada loan"

          ) : (

            <>
              Menampilkan{" "}

              <span
                className="
                  font-medium
                  text-gray-700
                "
              >
                {
                  (
                    page - 1
                  ) *
                  pageSize +
                  1
                }
              </span>

              {" - "}

              <span
                className="
                  font-medium
                  text-gray-700
                "
              >
                {
                  Math.min(
                    page *
                      pageSize,
                    total
                  )
                }
              </span>

              {" dari "}

              <span
                className="
                  font-medium
                  text-gray-700
                "
              >
                {
                  total
                }
              </span>

              {" loan"}

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

              value={
                pageSize
              }

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

            onClick={
              previousPage
            }

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


          {/* Page */}

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

            onClick={
              nextPage
            }

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


      {/* =====================================
          CREATE
      ====================================== */}

      <AssetLoanCreateModal

        open={
          createOpen
        }

        onClose={() => {

          setCreateOpen(
            false
          );

        }}

        onSuccess={() => {

          setCreateOpen(
            false
          );

          reload();

        }}

      />


      {/* =====================================
          DETAIL
      ====================================== */}

      <AssetLoanDetailModal

        open={
          detailOpen
        }

        loanId={
          selectedLoanId
        }

        onClose={() => {

          setDetailOpen(
            false
          );

          setSelectedLoanId(
            null
          );

        }}

        onSuccess={() => {

          setDetailOpen(
            false
          );

          setSelectedLoanId(
            null
          );

          reload();

        }}

      />

    </div>

  );

}