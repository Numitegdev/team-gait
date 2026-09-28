"use client";

import {
  Eye,
  Check,
  X,
  Play,
  Undo2,
} from "lucide-react";

import {
  AssetLoan,
} from "../types/AssetLoan";

interface AssetLoanTableProps {

  loans:
    AssetLoan[];

  loading:
    boolean;

  onView:
    (id: number) => void;

  onApprove:
    (id: number) => Promise<void>;

  onReject:
    (
      id: number,
      reason: string
    ) => Promise<void>;

      onExecute:
    (id: number) => Promise<void>;

    onReturn: (id: number) => Promise<void>;

    currentUserCompanyId:
  number | null;

isItAdmin:
  boolean;

}

export default function AssetLoanTable({
  loans,
  loading,
  onView,
  onApprove,
  onReject,
  onExecute,
  onReturn,
  currentUserCompanyId,
  isItAdmin,
}: AssetLoanTableProps) {

    const canManageLoan = (
    loan: AssetLoan
  ) =>
    isItAdmin ||
    loan.owner_company_id ===
      currentUserCompanyId;

  if (loading) {

    return (

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-10
          text-center
          text-gray-500
        "
      >

        Loading asset loan...

      </div>

    );

  }


  if (!loans.length) {


    return (

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-10
          text-center
          text-gray-500
        "
      >

        Belum ada data asset loan.

      </div>

    );

  }


  return (

    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        bg-white
      "
    >

      <div
        className="
          overflow-x-auto
        "
      >

        <table
          className="
            min-w-full
            text-sm
          "
        >

          <thead
            className="
              border-b
              bg-gray-50
            "
          >

            <tr>

              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Loan No
              </th>


              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Asset
              </th>


              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Owner
              </th>


              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Borrower
              </th>


              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Mulai
              </th>


              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Selesai
              </th>


              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Harga / Bulan
              </th>


              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-left
                  font-semibold
                  text-gray-700
                "
              >
                Status
              </th>


              <th
                className="
                  whitespace-nowrap
                  px-5
                  py-4
                  text-center
                  font-semibold
                  text-gray-700
                "
              >
                Action
              </th>

            </tr>

          </thead>


          <tbody
            className="
              divide-y
            "
          >

            {loans.map(
              (loan) => (

                <tr
                  key={loan.id}
                  className="
                    hover:bg-gray-50
                  "
                >

                  {/* Loan No */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                      font-medium
                      text-gray-900
                    "
                  >

                    {loan.loan_no}

                  </td>


                  {/* Asset */}

                  <td
                    className="
                      px-5
                      py-4
                    "
                  >

                    <div>

                      <div
                        className="
                          font-medium
                          text-gray-900
                        "
                      >

                        {loan.asset?.asset_code}

                      </div>

                      <div
                        className="
                          text-xs
                          text-gray-500
                        "
                      >

                        {loan.asset?.asset_name}

                      </div>

                    </div>

                  </td>


                  {/* Owner */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                    "
                  >

                    {loan.owner_company?.name ??
                      "-"}

                  </td>


                  {/* Borrower */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                    "
                  >

                    {loan.borrower_company?.name ??
                      "-"}

                  </td>


                  {/* Start */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                    "
                  >

                    {loan.start_date
                      ? new Date(
                          loan.start_date
                        ).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}

                  </td>


                  {/* End */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                    "
                  >

                    {loan.end_date
                      ? new Date(
                          loan.end_date
                        ).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}

                  </td>


                  {/* Price */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                    "
                  >

                    {loan.monthly_price != null

                      ? new Intl.NumberFormat(
                          "id-ID",
                          {
                            style:
                              "currency",
                            currency:
                              "IDR",
                            maximumFractionDigits:
                              0,
                          }
                        ).format(
                          loan.monthly_price
                        )

                      : "-"}

                  </td>


                  {/* Status */}

                  <td
                    className="
                      whitespace-nowrap
                      px-5
                      py-4
                    "
                  >

                    <span
                      className="
                        inline-flex
                        rounded-full
                        bg-gray-100
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-gray-700
                      "
                    >

                      {loan.status}

                    </span>

                  </td>


                  {/* Action */}

                {/* Action */}

<td
  className="
    px-5
    py-4
  "
>

  <div
    className="
      flex
      items-center
      justify-center
      gap-2
    "
  >

    {/* View */}

    <button
      type="button"
      onClick={() =>
        onView(
          loan.id
        )
      }
      className="
        inline-flex
        items-center
        justify-center
        rounded-lg
        p-2
        text-gray-500
        hover:bg-gray-100
        hover:text-blue-600
      "
      title="Lihat detail"
    >

      <Eye
        size={18}
      />

    </button>


    {/* Approve */}

    {loan.status === "PENDING" &&
  canManageLoan(loan) && (

      <button
        type="button"
        onClick={async () => {

          const confirmed =
            window.confirm(
              "Approve peminjaman asset ini?"
            );

          if (!confirmed) {
            return;
          }

          try {

            await onApprove(
              loan.id
            );

          } catch (error) {

            console.error(
              error
            );

            alert(
              "Gagal approve peminjaman."
            );

          }

        }}
        className="
          inline-flex
          items-center
          justify-center
          rounded-lg
          p-2
          text-green-600
          hover:bg-green-50
        "
        title="Approve"
      >

        <Check
          size={18}
        />

      </button>

    )}


    {/* Reject */}

   {loan.status === "PENDING" &&
  canManageLoan(loan) && (

      <button
        type="button"
        onClick={async () => {

          const reason =
            window.prompt(
              "Masukkan alasan penolakan:"
            );

          if (
            reason === null ||
            !reason.trim()
          ) {
            return;
          }

          try {

            await onReject(
              loan.id,
              reason.trim()
            );

          } catch (error) {

            console.error(
              error
            );

            alert(
              "Gagal reject peminjaman."
            );

          }

        }}
        className="
          inline-flex
          items-center
          justify-center
          rounded-lg
          p-2
          text-red-600
          hover:bg-red-50
        "
        title="Reject"
      >

        <X
          size={18}
        />

      </button>

    )}

    {/* Execute */}

{loan.status === "APPROVED" &&
  canManageLoan(loan) && (

  <button
    type="button"
    onClick={async () => {

      const confirmed =
        window.confirm(
          "Execute peminjaman asset ini?"
        );

      if (!confirmed) {
        return;
      }

      try {

        await onExecute(
          loan.id
        );

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Gagal execute peminjaman."
        );

      }

    }}
    className="
      inline-flex
      items-center
      justify-center
      rounded-lg
      p-2
      text-blue-600
      hover:bg-blue-50
    "
    title="Execute"
  >

    <Play
      size={18}
    />

  </button>

)}

{loan.status === "ACTIVE" &&
  canManageLoan(loan) && (
  <button
    type="button"
    title="Return"
    onClick={async () => {
      if (
        !window.confirm(
          "Kembalikan asset ini?"
        )
      ) {
        return;
      }

      try {
        await onReturn(loan.id);
      } catch (error) {
        console.error(error);

        alert(
          "Gagal mengembalikan asset."
        );
      }
    }}
    className="
      inline-flex
      h-9
      w-9
      items-center
      justify-center
      rounded-lg
      border
      border-gray-200
      text-gray-600
      hover:bg-gray-100
    "
  >
    <Undo2 className="h-4 w-4" />
  </button>
)}

  </div>

</td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}