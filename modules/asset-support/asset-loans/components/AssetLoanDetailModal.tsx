"use client";

import { useEffect, useState } from "react";

import {
  createClient,
} from "@/lib/supabase/client";

import {
  getAdminCompanyId,
} from "@/lib/auth/company-permission";

import {
  getLoanById,
  updateLoanEndDate,
} from "../services/asset-loan-service";

import {
  AssetLoan,
} from "../types/AssetLoan";

interface AssetLoanDetailModalProps {

  open: boolean;

  loanId: number | null;

  onClose: () => void;

  onSuccess?: () => void;

}

export default function AssetLoanDetailModal({

  open,

  loanId,

  onClose,

}: AssetLoanDetailModalProps) {

  const [
    loan,
    setLoan,
  ] = useState<AssetLoan | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
  savingEndDate,
  setSavingEndDate,
] = useState(false);

const [
  currentUserCompanyId,
  setCurrentUserCompanyId,
] = useState<number | null>(null);

const [
  isItAdmin,
  setIsItAdmin,
] = useState(false);

async function loadUserPermission() {

  try {

    const supabase =
      createClient();

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const {
      data: profile,
      error,
    } =
      await supabase
        .from("profiles")
        .select("role")
        .eq(
          "id",
          user.id
        )
        .single();

    if (error) {
      throw error;
    }

    if (
      profile?.role ===
      "it_admin"
    ) {

      setIsItAdmin(true);
      setCurrentUserCompanyId(null);

      return;
    }

    setIsItAdmin(false);

    setCurrentUserCompanyId(
      getAdminCompanyId(
        profile?.role
      )
    );

  } catch (error) {

    console.error(
      "Gagal load user permission:",
      error
    );

  }

}

  useEffect(() => {
  if (!open || loanId === null) {
    setLoan(null);
    return;
  }

  const id = loanId;

loadUserPermission();

  async function load() {
    try {
      setLoading(true);

      const data = await getLoanById(id);

      setLoan(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  load();
}, [open, loanId]);


  if (!open) {

    return null;

  }


  function formatDate(
    value: string | null
  ) {

    if (!value)
      return "-";

    return new Date(
      value
    ).toLocaleDateString(
      "id-ID"
    );

  }

  function formatDateTime(
  value: string | null
) {

  if (!value)
    return "-";

  return new Date(
    value
  ).toLocaleString(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

}

  function formatCurrency(
    value: number | null
  ) {

    if (
      value === null ||
      value === undefined
    ) {

      return "-";

    }

    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(value);

  }

async function handleUpdateEndDate() {

  if (!loan) {
    return;
  }

  const value =
    window.prompt(
      "Masukkan tanggal selesai (YYYY-MM-DD):",
      loan.end_date ?? ""
    );

  if (value === null) {
    return;
  }

  const trimmed =
    value.trim();

  if (!trimmed) {

    if (
      !window.confirm(
        "Kosongkan tanggal selesai?"
      )
    ) {
      return;
    }

  }

  try {

    setSavingEndDate(true);

    await updateLoanEndDate(
      loan.id,
      trimmed || null
    );

    const updatedLoan =
      await getLoanById(
        loan.id
      );

    setLoan(
      updatedLoan
    );

    alert(
      "Tanggal selesai berhasil diperbarui."
    );

  } catch (error) {

    console.error(
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : "Gagal memperbarui tanggal selesai."
    );

  } finally {

    setSavingEndDate(false);

  }

}

  return (

    <div
      className="
        fixed
        inset-0
        z-60
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
          max-h-[90vh]
          overflow-y-auto
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
            px-6
            py-5
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-bold
                text-gray-900
              "
            >

              Detail Asset Loan

            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >

              Informasi lengkap peminjaman asset.

            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              px-3
              py-2
              text-gray-500
              hover:bg-gray-100
            "
          >

            ✕

          </button>

        </div>


        {/* Content */}

        {loading ? (

          <div
            className="
              px-6
              py-16
              text-center
              text-gray-500
            "
          >

            Loading detail loan...

          </div>

        ) : !loan ? (

          <div
            className="
              px-6
              py-16
              text-center
              text-gray-500
            "
          >

            Data loan tidak ditemukan.

          </div>

        ) : (

          <div
            className="
              space-y-6
              px-6
              py-6
            "
          >

            {/* Loan Information */}

            <div>

              <h3
                className="
                  mb-3
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >

                Informasi Loan

              </h3>


              <div
                className="
                  grid
                  gap-4
                  rounded-xl
                  border
                  bg-gray-50
                  p-4
                  md:grid-cols-2
                "
              >

                <div>

                  <p className="text-xs text-gray-500">
                    Loan No
                  </p>

                  <p className="mt-1 font-medium">
                    {loan.loan_no}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <p className="mt-1 font-medium">
                    {loan.status}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-gray-500">
                    Mulai
                  </p>

                  <p className="mt-1 font-medium">
                    {formatDate(
                      loan.start_date
                    )}
                  </p>

                </div>


               <div>

                    <p className="text-xs text-gray-500">
                      Rencana Selesai
                    </p>

                    <p className="mt-1 font-medium">
                      {loan.end_date
                        ? formatDate(loan.end_date)
                        : "Belum ditentukan"}
                    </p>

                </div>

                    {loan.status === "ACTIVE" &&
                        (
                          isItAdmin ||
                          loan.owner_company_id ===
                            currentUserCompanyId
                        ) && (

                          <div>

                            <p className="text-xs text-gray-500">
                              Pengaturan
                            </p>

                            <button
                              type="button"
                              onClick={
                                handleUpdateEndDate
                              }
                              disabled={
                                savingEndDate
                              }
                              className="
                                mt-2
                                rounded-lg
                                border
                                px-3
                                py-2
                                text-sm
                                font-medium
                                hover:bg-gray-100
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >

                              {savingEndDate
                                ? "Menyimpan..."
                                : loan.end_date
                                  ? "Ubah Tanggal Selesai"
                                  : "Atur Tanggal Selesai"}

                            </button>

                          </div>

                      )}

                <div>

                    <p className="text-xs text-gray-500">
                      Selesai Aktual
                    </p>

                    <p className="mt-1 font-medium">
                      {loan.returned_at
                        ? formatDateTime(
                            loan.returned_at
                          )
                        : "Belum dikembalikan"}
                    </p>

                </div>


                <div>

                  <p className="text-xs text-gray-500">
                    Harga / Bulan
                  </p>

                  <p className="mt-1 font-medium">
                    {formatCurrency(
                      loan.monthly_price
                    )}
                  </p>

                </div>

              </div>

            </div>


            {/* Asset */}

            <div>

              <h3
                className="
                  mb-3
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >

                Asset

              </h3>


              <div
                className="
                  rounded-xl
                  border
                  p-4
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                  "
                >

                  {loan.asset?.asset_code ??
                    "-"}

                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    text-gray-500
                  "
                >

                  {loan.asset?.asset_name ??
                    "-"}

                </p>

              </div>

            </div>


            {/* Company */}

            <div>

              <h3
                className="
                  mb-3
                  text-sm
                  font-semibold
                  text-gray-900
                "
              >

                Company

              </h3>


              <div
                className="
                  grid
                  gap-4
                  md:grid-cols-2
                "
              >

                <div
                  className="
                    rounded-xl
                    border
                    p-4
                  "
                >

                  <p
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    Owner
                  </p>

                  <p
                    className="
                      mt-1
                      font-medium
                    "
                  >

                    {loan.owner_company?.name ??
                      "-"}

                  </p>

                </div>


                <div
                  className="
                    rounded-xl
                    border
                    p-4
                  "
                >

                  <p
                    className="
                      text-xs
                      text-gray-500
                    "
                  >
                    Borrower
                  </p>

                  <p
                    className="
                      mt-1
                      font-medium
                    "
                  >

                    {loan.borrower_company?.name ??
                      "-"}

                  </p>

                </div>

              </div>

            </div>


            {/* Notes */}

            {loan.notes && (

              <div>

                <h3
                  className="
                    mb-3
                    text-sm
                    font-semibold
                    text-gray-900
                  "
                >

                  Catatan

                </h3>

                <div
                  className="
                    rounded-xl
                    border
                    p-4
                    text-sm
                    text-gray-600
                  "
                >

                  {loan.notes}

                </div>

              </div>

            )}

          </div>

        )}


        {/* Footer */}

        <div
          className="
            flex
            justify-end
            border-t
            px-6
            py-4
          "
        >

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border
              px-5
              py-2
              hover:bg-gray-100
            "
          >

            Tutup

          </button>

        </div>

      </div>

    </div>

  );

}