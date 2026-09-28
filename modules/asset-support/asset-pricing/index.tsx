"use client";

import { useEffect, useState } from "react";

import AssetPricingTable from "./components/AssetPricingTable";
import { useAssetPricing } from "./hooks/use-asset-pricing";

import { getCompanies } from "@/modules/assets/services/master-service";
import { createClient } from "@/lib/supabase/client";

interface Company {
  id: number;
  name: string;
}

export default function AssetPricingPage() {

  const {
    items,
    loading,
    saving,
    error,
    loadPricing,
    addPricing,
    editPricing,
  } = useAssetPricing();


  const [companies, setCompanies] =
    useState<Company[]>([]);


  const [role, setRole] =
    useState<string>("");


  const [ownerCompanyId, setOwnerCompanyId] =
    useState<number | "">("");


  const [borrowerCompanyId, setBorrowerCompanyId] =
    useState<number | "">("");


  const [loadingCompanies, setLoadingCompanies] =
    useState(true);


  const supabase =
    createClient();


  /*
   * Ambil role user
   */
  useEffect(() => {

    async function loadUserRole() {

      try {

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
            .eq("id", user.id)
            .single();


        if (error) {
          throw error;
        }


        setRole(
          profile?.role ?? ""
        );

      } catch (error) {

        console.error(
          "Gagal mengambil role:",
          error
        );

      }

    }


    loadUserRole();

  }, []);


  /*
   * Ambil semua company
   */
  useEffect(() => {

    async function loadCompanies() {

      try {

        setLoadingCompanies(true);


        const data =
          await getCompanies();


        setCompanies(data);

      } catch (error) {

        console.error(
          "Gagal mengambil company:",
          error
        );

      } finally {

        setLoadingCompanies(false);

      }

    }


    loadCompanies();

  }, []);


  /*
   * Untuk admin PT biasa:
   * owner otomatis mengikuti company
   *
   * Untuk IT admin:
   * owner dipilih manual.
   */
  useEffect(() => {

    if (
      role &&
      role !== "it_admin"
    ) {

      // Untuk sementara
      // owner akan ditentukan
      // dari service berdasarkan role.

      setOwnerCompanyId("");

    }

  }, [role]);


  /*
   * Saat owner berubah
   */
  function handleOwnerChange(
    value: string
  ) {

    const companyId =
      Number(value);


    if (
      !value ||
      Number.isNaN(companyId)
    ) {

      setOwnerCompanyId("");
      setBorrowerCompanyId("");

      return;
    }


    setOwnerCompanyId(
      companyId
    );


    // Reset borrower
    setBorrowerCompanyId("");

  }


  /*
   * Saat borrower berubah
   */
  async function handleBorrowerChange(
    value: string
  ) {

    const companyId =
      Number(value);


    if (
      !value ||
      Number.isNaN(companyId)
    ) {

      setBorrowerCompanyId("");

      return;
    }


    setBorrowerCompanyId(
      companyId
    );


    /*
     * IT Admin harus mengirim
     * owner yang dipilih.
     *
     * Admin PT biasa nanti
     * owner akan ditentukan service.
     */
    if (role === "it_admin") {

      if (
        ownerCompanyId === ""
      ) {

        return;

      }


      await loadPricing(
        companyId,
        ownerCompanyId
      );

      return;
    }


    /*
     * Admin PT biasa
     */
    await loadPricing(
      companyId
    );

  }


  /*
   * Tambah pricing
   */
  async function handleAddPricing(
    familyCode: string,
    monthlyPrice: number
  ) {

    if (
      borrowerCompanyId === ""
    ) {

      throw new Error(
        "PT borrower belum dipilih."
      );

    }

return addPricing(
  borrowerCompanyId,
  familyCode,
  monthlyPrice,
  role === "it_admin" &&
  ownerCompanyId !== ""
    ? ownerCompanyId
    : undefined
);

  }


  /*
   * Update pricing
   */
  async function handleEditPricing(
    id: number,
    familyCode: string,
    monthlyPrice: number
  ) {

    return editPricing(
      id,
      familyCode,
      monthlyPrice
    );

  }


  /*
   * Untuk admin PT biasa,
   * borrower tidak boleh sama
   * dengan owner.
   *
   * Untuk IT admin,
   * juga tidak boleh sama.
   */
  const availableBorrowerCompanies =
    companies.filter(
      (company) =>
        company.id !==
        ownerCompanyId
    );


  return (

    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}

      <div>

        <h1 className="text-2xl font-bold text-gray-900">
          Harga Sewa Asset
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Atur harga sewa asset berdasarkan
          PT pemilik, PT peminjam, dan family asset.
        </p>

      </div>


      {/* Filter */}

      <div className="rounded-2xl border bg-white p-5">

        <div
          className={
            role === "it_admin"
              ? "grid gap-4 md:grid-cols-2"
              : "max-w-md"
          }
        >

          {/* PT Owner */}

          {role === "it_admin" && (

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                PT Pemilik
              </label>

              <select
                value={
                  ownerCompanyId
                }
                onChange={(e) =>
                  handleOwnerChange(
                    e.target.value
                  )
                }
                disabled={
                  loadingCompanies ||
                  saving
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  bg-white
                  px-4
                  text-sm
                  outline-none
                  focus:border-black
                  disabled:bg-gray-100
                "
              >

                <option value="">
                  {loadingCompanies
                    ? "Memuat PT..."
                    : "Pilih PT pemilik"}
                </option>

                {companies.map(
                  (company) => (

                    <option
                      key={
                        company.id
                      }
                      value={
                        company.id
                      }
                    >
                      {company.name}
                    </option>

                  )
                )}

              </select>

            </div>

          )}


          {/* PT Borrower */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              PT Peminjam
            </label>

            <select
              value={
                borrowerCompanyId
              }
              onChange={(e) =>
                handleBorrowerChange(
                  e.target.value
                )
              }
              disabled={
                loadingCompanies ||
                saving ||
                (
                  role === "it_admin" &&
                  ownerCompanyId === ""
                )
              }
              className="
                h-11
                w-full
                rounded-xl
                border
                bg-white
                px-4
                text-sm
                outline-none
                focus:border-black
                disabled:bg-gray-100
              "
            >

              <option value="">
                {role === "it_admin" &&
                ownerCompanyId === ""
                  ? "Pilih PT pemilik terlebih dahulu"
                  : "Pilih PT peminjam"}
              </option>

              {availableBorrowerCompanies.map(
                (company) => (

                  <option
                    key={
                      company.id
                    }
                    value={
                      company.id
                    }
                  >
                    {company.name}
                  </option>

                )
              )}

            </select>

          </div>

        </div>

      </div>


      {/* Error */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>

      )}


      {/* Table */}

      {borrowerCompanyId !== "" && (

        <div className="space-y-3">

          <div>

            <h2 className="text-lg font-semibold text-gray-900">
              Daftar Harga Sewa
            </h2>

            <p className="text-sm text-gray-500">
              Jumlah asset dihitung otomatis
              dari asset yang sedang aktif dipinjam.
            </p>

          </div>


          <AssetPricingTable
            items={items}
            loading={loading}
            saving={saving}
            onAddPricing={
              handleAddPricing
            }
            onEditPricing={
              handleEditPricing
            }
          />

        </div>

      )}


      {/* Belum pilih */}

      {borrowerCompanyId === "" &&
        !loadingCompanies && (

          <div className="rounded-2xl border bg-white p-8 text-center">

            <p className="text-sm text-gray-500">

              {role === "it_admin"
                ? "Pilih PT pemilik dan PT peminjam untuk melihat daftar harga sewa."
                : "Silakan pilih PT peminjam untuk melihat daftar harga sewa."}

            </p>

          </div>

        )}

    </div>

  );
}