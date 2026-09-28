"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  X,
} from "lucide-react";

import {
  getActiveAssets,
} from "@/modules/assets/services/asset-service";

import {
  getCompanies,
} from "@/modules/assets/services/master-service";

import {
  createLoan,
} from "../services/asset-loan-service";

import {
  AssetLoan,
} from "../types/AssetLoan";

import {
  CreateAssetLoanPayload,
} from "../types/CreateAssetLoanPayload";

import {
  Company,
} from "@/modules/assets/types/masters/Company";


interface AssetLoanCreateModalProps {

  open: boolean;

  onClose: () => void;

  onSuccess: (
    loan: AssetLoan
  ) => void;

}


interface AssetOption {

  id: number;

  asset_code: string;

  asset_name: string;

  company_id: number;

}


export default function AssetLoanCreateModal({

  open,

  onClose,

  onSuccess,

}: AssetLoanCreateModalProps) {

  const [
    assets,
    setAssets,
  ] = useState<AssetOption[]>([]);

  const [
    companies,
    setCompanies,
  ] = useState<Company[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    loadingData,
    setLoadingData,
  ] = useState(false);

  const [
    assetId,
    setAssetId,
  ] = useState("");

  const [
    borrowerCompanyId,
    setBorrowerCompanyId,
  ] = useState("");

  const [
    startDate,
    setStartDate,
  ] = useState("");

  const [
    endDate,
    setEndDate,
  ] = useState("");

 

  const [
    notes,
    setNotes,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  // ==========================================
  // LOAD ASSETS & COMPANIES
  // ==========================================

  useEffect(() => {

    if (!open) {
      return;
    }

    async function loadData() {

      try {

        setLoadingData(true);

        const [
          assetData,
          companyData,
        ] = await Promise.all([

          getActiveAssets(),

          getCompanies(),

        ]);


        setAssets(
          assetData as AssetOption[]
        );

        setCompanies(
          companyData
        );

      } catch (error) {

        console.error(error);

        setErrorMessage(
          "Gagal mengambil data asset dan company."
        );

      } finally {

        setLoadingData(false);

      }

    }

    loadData();

  }, [open]);


  // ==========================================
  // RESET FORM
  // ==========================================

  useEffect(() => {

    if (!open) {

      setAssetId("");

      setBorrowerCompanyId("");

      setStartDate("");

      setEndDate("");

      setNotes("");

      setErrorMessage("");

    }

  }, [open]);


  // ==========================================
  // SELECTED ASSET
  // ==========================================

  const selectedAsset =
    assets.find(
      (asset) =>
        asset.id ===
        Number(assetId)
    );


  // ==========================================
  // OWNER COMPANY
  // ==========================================

  const ownerCompany =
    companies.find(
      (company) =>
        company.id ===
        selectedAsset?.company_id
    );


  // ==========================================
  // SUBMIT
  // ==========================================

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setErrorMessage("");


    // ----------------------------------------
    // Validasi asset
    // ----------------------------------------

    if (!selectedAsset) {

      setErrorMessage(
        "Silakan pilih asset."
      );

      return;

    }


    // ----------------------------------------
    // Validasi borrower
    // ----------------------------------------

    if (!borrowerCompanyId) {

      setErrorMessage(
        "Silakan pilih borrower company."
      );

      return;

    }


    // ----------------------------------------
    // Validasi tanggal
    // ----------------------------------------

    if (!startDate) {

      setErrorMessage(
        "Tanggal mulai wajib diisi."
      );

      return;

    }


    // ----------------------------------------
    // Owner company
    // ----------------------------------------

    if (!selectedAsset.company_id) {

      setErrorMessage(
        "Asset tidak memiliki owner company."
      );

      return;

    }


    // ----------------------------------------
    // Owner = borrower
    // ----------------------------------------

    if (
      selectedAsset.company_id ===
      Number(borrowerCompanyId)
    ) {

      setErrorMessage(
        "Owner company dan borrower company tidak boleh sama."
      );

      return;

    }


    try {

      setLoading(true);


      const payload:
        CreateAssetLoanPayload = {

        asset_id:
          selectedAsset.id,

        owner_company_id:
          selectedAsset.company_id,

        borrower_company_id:
          Number(borrowerCompanyId),

        start_date:
          startDate,

        end_date:
          endDate || null,

        notes:
          notes || null,

      };


      const loan =
        await createLoan(
          payload
        );


      onSuccess(
        loan
      );

    } catch (error) {

      console.error(error);

      setErrorMessage(

        error instanceof Error

          ? error.message

          : "Gagal membuat asset loan."

      );

    } finally {

      setLoading(false);

    }

  }


  // ==========================================
  // MODAL
  // ==========================================

  if (!open) {
    return null;
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
          max-w-2xl
          rounded-2xl
          bg-white
          shadow-xl
          dark:bg-gray-900
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            px-6
            py-4
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Tambah Asset Loan
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
              "
            >
              Buat peminjaman asset ke company lain.
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-gray-500
              hover:bg-gray-100
            "
          >

            <X
              size={20}
            />

          </button>

        </div>


        {/* FORM */}

        <form
          onSubmit={
            handleSubmit
          }
          className="
            space-y-5
            p-6
          "
        >

          {/* ASSET */}

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
              value={assetId}
              onChange={(e) =>
                setAssetId(
                  e.target.value
                )
              }
              disabled={loadingData}
              className="
                h-11
                w-full
                rounded-xl
                border
                px-4
                outline-none
                focus:border-black
              "
            >

              <option value="">
                {loadingData
                  ? "Memuat asset..."
                  : "Pilih asset"}
              </option>

              {assets.map(
                (asset) => (

                  <option
                    key={asset.id}
                    value={asset.id}
                  >
                    {asset.asset_code}
                    {" - "}
                    {asset.asset_name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* OWNER COMPANY */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
              "
            >
              Owner Company
            </label>

            <input
              value={
                ownerCompany?.name ??
                ""
              }
              readOnly
              placeholder="Otomatis dari asset"
              className="
                h-11
                w-full
                rounded-xl
                border
                bg-gray-50
                px-4
                text-gray-600
                outline-none
              "
            />

          </div>


          {/* BORROWER */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
              "
            >
              Borrower Company
            </label>

            <select
              value={
                borrowerCompanyId
              }
              onChange={(e) =>
                setBorrowerCompanyId(
                  e.target.value
                )
              }
              className="
                h-11
                w-full
                rounded-xl
                border
                px-4
                outline-none
                focus:border-black
              "
            >

              <option value="">
                Pilih borrower company
              </option>

              {companies.map(
                (company) => (

                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* DATE */}

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
                Tanggal Mulai
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  px-4
                  outline-none
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
                Tanggal Selesai
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  px-4
                  outline-none
                "
              />

            </div>

          </div>


          {/* PRICE */}

        


          {/* NOTES */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
              "
            >
              Catatan
            </label>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              rows={3}
              placeholder="Catatan peminjaman..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                px-4
                py-3
                outline-none
              "
            />

          </div>


          {/* ERROR */}

          {errorMessage && (

            <div
              className="
                rounded-xl
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-600
              "
            >
              {errorMessage}
            </div>

          )}


          {/* ACTION */}

          <div
            className="
              flex
              justify-end
              gap-3
              border-t
              pt-5
            "
          >

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                rounded-xl
                border
                px-5
                py-2.5
                text-sm
                font-medium
                hover:bg-gray-50
              "
            >
              Batal
            </button>


            <button
              type="submit"
              disabled={
                loading ||
                loadingData
              }
              className="
                rounded-xl
                bg-black
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                disabled:opacity-50
              "
            >
              {loading
                ? "Menyimpan..."
                : "Simpan"}
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}