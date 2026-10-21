
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getAssetAuditList,
  getAssetAuditHistory,
  findAssetForAudit,
  saveAssetAudit,
  getAssetAuditFilterOptions,
} from "../services/asset-audit-service";

import type {
  AssetAuditFilter,
  AssetAuditHistory,
  AssetAuditSubmission,
} from "../types/asset-audit";

export function useAssetAudit() {
    const [companies, setCompanies] = useState<
  { id: number; name: string }[]
>([]);

const [locations, setLocations] = useState<
  { id: number; code: string; name: string }[]
>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [history, setHistory] = useState<AssetAuditHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<AssetAuditFilter>({
    auditMonth: new Date().toISOString().slice(0, 7),
    companyId: null,
    locationId: null,
  });

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAssetAuditList(filters);
      setAssets(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat daftar aset audit.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

useEffect(() => {
  let cancelled = false;

  async function loadOptions() {
    try {
      const options = await getAssetAuditFilterOptions();

      if (!cancelled) {
        setCompanies(options.companies);
        setLocations(options.locations);
      }
    } catch (err) {
      console.error("Gagal memuat filter audit:", err);
    }
  }

  void loadOptions();

  return () => {
    cancelled = true;
  };
}, []);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  const searchAsset = useCallback(async (code: string) => {
    setError("");

    try {
      const asset = await findAssetForAudit(code);
      setSelectedAsset(asset);
      return asset;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Aset tidak ditemukan.";

      setError(message);
      setSelectedAsset(null);
      return null;
    }
  }, []);

  const submitAudit = useCallback(
    async (input: AssetAuditSubmission) => {
      setSaving(true);
      setError("");

      try {
        await saveAssetAudit(input);
        await loadAssets();
        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Gagal menyimpan hasil audit.";

        setError(message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [loadAssets],
  );

  const loadHistory = useCallback(async (recordId: number) => {
    setError("");

    try {
      const data = await getAssetAuditHistory(recordId);
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat riwayat audit.");
    }
  }, []);

useEffect(() => {
  async function loadFilterOptions() {
    try {
      const options = await getAssetAuditFilterOptions();

      setCompanies(options.companies);
      setLocations(options.locations);
    } catch (error) {
      console.error(
        "Gagal memuat pilihan filter audit:",
        error
      );
    }
  }

  loadFilterOptions();
}, []);

return {
  assets,
  selectedAsset,
  setSelectedAsset,
  history,
  filters,
  setFilters,
  loading,
  saving,
  error,
  loadAssets,
  searchAsset,
  submitAudit,
  loadHistory,

  // Tambahan untuk pilihan filter
  companies,
  locations,
};
}
