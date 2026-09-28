"use client";

import {
  useCallback,
  useState,
} from "react";

import {
  getPricingItems,
  createPricing,
  updatePricing,
} from "../services/asset-pricing-service";


// =====================================================
// TYPE
// =====================================================

export interface PricingItem {

  family_code: string;

  model_names: string[];

  asset_count: number;

  pricing: {

    id: number;

    owner_company_id: number;

    borrower_company_id: number;

    family_code: string;

    monthly_price: number;

    is_active: boolean;

  } | null;

}


// =====================================================
// HOOK
// =====================================================

export function useAssetPricing() {

  const [
    items,
    setItems,
  ] = useState<PricingItem[]>([]);


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    saving,
    setSaving,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<string | null>(null);


  // ===================================================
  // LOAD
  // ===================================================

  const loadPricing =
  useCallback(
    async (
      borrowerCompanyId: number,
      ownerCompanyId?: number
    ) => {

      try {

        setLoading(true);

        setError(null);


        const data =
          await getPricingItems(
            borrowerCompanyId,
            ownerCompanyId
          );


        setItems(
          data
        );


      } catch (error: any) {

        console.error(
          error
        );


        setError(
          error?.message ??
          "Gagal mengambil data harga sewa."
        );


        setItems([]);


      } finally {

        setLoading(false);

      }

    },
    []
  );


  // ===================================================
  // CREATE
  // ===================================================

  const addPricing =
  useCallback(
    async (
      borrowerCompanyId: number,
      familyCode: string,
      monthlyPrice: number,
      ownerCompanyId?: number
    ) => {

      try {

        setSaving(true);

        setError(null);


        const data =
          await createPricing(

            {
              borrower_company_id:
                borrowerCompanyId,

              family_code:
                familyCode,

              monthly_price:
                monthlyPrice,

            },

            ownerCompanyId

          );


        // Update item langsung
        // tanpa reload seluruh page.

        setItems(
          (current) =>
            current.map(
              (item) => {

                if (
                  item.family_code !==
                  familyCode
                ) {

                  return item;

                }


                return {

                  ...item,

                  pricing: {

                    id: data.id,

                    owner_company_id:
                      data.owner_company_id,

                    borrower_company_id:
                      data.borrower_company_id,

                    family_code:
                      data.family_code,

                    monthly_price:
                      data.monthly_price,

                    is_active:
                      data.is_active,

                  },

                };

              }
            )
        );


        return data;


      } catch (error: any) {

        console.error(
          error
        );


        setError(
          error?.message ??
          "Gagal menyimpan harga sewa."
        );


        throw error;


      } finally {

        setSaving(false);

      }

    },
    []
  );

  // ===================================================
  // UPDATE
  // ===================================================

  const editPricing =
    useCallback(
      async (
        id: number,
        familyCode: string,
        monthlyPrice: number
      ) => {

        try {

          setSaving(true);

          setError(null);


          const data =
            await updatePricing(
              id,
              monthlyPrice
            );


          setItems(
            (current) =>
              current.map(
                (item) => {

                  if (
                    item.family_code !==
                    familyCode
                  ) {

                    return item;

                  }


                  return {

                    ...item,

                    pricing: {

                      id: data.id,

                      owner_company_id:
                        data.owner_company_id,

                      borrower_company_id:
                        data.borrower_company_id,

                      family_code:
                        data.family_code,

                      monthly_price:
                        data.monthly_price,

                      is_active:
                        data.is_active,

                    },

                  };

                }
              )
          );


          return data;


        } catch (error: any) {

          console.error(
            error
          );


          setError(
            error?.message ??
            "Gagal mengubah harga sewa."
          );


          throw error;


        } finally {

          setSaving(false);

        }

      },
      []
    );


  return {

    items,

    loading,

    saving,

    error,

    loadPricing,

    addPricing,

    editPricing,

  };

}