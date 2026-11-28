
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

import type {
  AssetModelLoanPricing,
} from "../services/asset-pricing-service";

// =====================================================
// TYPE
// =====================================================

export interface PricingItem {
  model_id: number;

  model_name: string;

  family_code: string;

  asset_count: number;

  pricing: AssetModelLoanPricing | null;
}

// =====================================================
// HOOK
// =====================================================

export function useAssetPricing() {
  const [items, setItems] = useState<PricingItem[]>([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ===================================================
  // LOAD
  // ===================================================

  const loadPricing = useCallback(
    async (
      borrowerCompanyId: number,
      ownerCompanyId?: number
    ) => {
      try {
        setLoading(true);
        setError(null);

        const data = await getPricingItems(
          borrowerCompanyId,
          ownerCompanyId
        );

        setItems(data);

      } catch (error: any) {
        console.error(error);

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

  const addPricing = useCallback(
    async (
      borrowerCompanyId: number,
      modelId: number,
      monthlyPrice: number,
      ownerCompanyId?: number
    ) => {
      try {
        setSaving(true);
        setError(null);

        const data = await createPricing(
          {
            borrower_company_id: borrowerCompanyId,
            model_id: modelId,
            monthly_price: monthlyPrice,
          },
          ownerCompanyId
        );

        // Update hanya Model yang bersangkutan.
        setItems((current) =>
          current.map((item) => {
            if (item.model_id !== modelId) {
              return item;
            }

            return {
              ...item,
              pricing: data,
            };
          })
        );

        return data;

      } catch (error: any) {
        console.error(error);

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

  const editPricing = useCallback(
    async (
      id: number,
      modelId: number,
      monthlyPrice: number
    ) => {
      try {
        setSaving(true);
        setError(null);

        const data = await updatePricing(
          id,
          monthlyPrice
        );

        // Update hanya Model yang bersangkutan.
        setItems((current) =>
          current.map((item) => {
            if (item.model_id !== modelId) {
              return item;
            }

            return {
              ...item,
              pricing: data,
            };
          })
        );

        return data;

      } catch (error: any) {
        console.error(error);

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
