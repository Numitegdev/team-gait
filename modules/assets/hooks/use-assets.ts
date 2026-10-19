
"use client";

import { useEffect, useState } from "react";
import { AssetListItem } from "../types/AssetListItem";
import {
  getAssetList,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
} from "../services/asset-service";
import { getAssetLoanAvailability } from "@/modules/asset-support/asset-loans/services/asset-loan-service";
import { Asset } from "../types/asset";

export interface AssetFilterOption {
  id: number;
  name: string;
  display_order?: number;
}

export type AssetAvailability =
  | "AVAILABLE"
  | "PROCESSING"
  | "BORROWED";

export function useAssets() {
  const [assets, setAssets] = useState<AssetListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [companyFilter, setCompanyFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filter dan data ketersediaan aset
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AssetAvailability | "">("");

  const [loanAvailability, setLoanAvailability] =
    useState<Map<number, string> | null>(null);

  const [availabilityError, setAvailabilityError] =
    useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    setPage(1);
  }, [
    search,
    companyFilter,
    categoryFilter,
    locationFilter,
    conditionFilter,
    statusFilter,
    availabilityFilter,
  ]);

  async function loadAssets() {
    setLoading(true);

    try {
      const data = await getAssetList();
      setAssets((data ?? []) as AssetListItem[]);
    } catch (error) {
      console.error("Gagal memuat aset:", error);
    }

    try {
      const availability = await getAssetLoanAvailability();

      setLoanAvailability(availability);
      setAvailabilityError(false);
    } catch (error) {
      console.error(
        "Gagal memuat ketersediaan aset:",
        error
      );

      setLoanAvailability(null);
      setAvailabilityError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAssets();
  }, []);

  async function loadAssetDetail(id: number) {
    return await getAssetById(id);
  }

  async function getAssetDetail(id: number) {
    return await getAssetById(id);
  }

  async function addAsset(payload: Omit<Asset, "id">) {
    await createAsset(payload);
    await loadAssets();
  }

  async function editAsset(
    id: number,
    payload: Partial<Asset>
  ) {
    await updateAsset(id, payload);
    await loadAssets();
  }

  async function removeAsset(id: number) {
    const confirmDelete = window.confirm(
      "Hapus asset ini?"
    );

    if (!confirmDelete) return;

    await deleteAsset(id);
    await loadAssets();
  }

  const companyOptions: AssetFilterOption[] = getOptions(
    assets.map((item) => item.company)
  );

  const categoryOptions: AssetFilterOption[] = getOptions(
    assets.map((item) => item.category)
  );

  const locationOptions: AssetFilterOption[] = getOptions(
    assets.map((item) => item.location)
  );

  const conditionOptions: AssetFilterOption[] = getOptions(
    assets.map((item) => item.condition)
  );

  const statusOptions: AssetFilterOption[] = getOptions(
    assets.map((item) => item.status)
  );

  const keyword = search.trim().toLowerCase();

  const filteredAssets = assets.filter((item) => {
    const matchesSearch =
      !keyword ||
      item.asset_code?.toLowerCase().includes(keyword) ||
      item.asset_name?.toLowerCase().includes(keyword) ||
      item.brand?.toLowerCase().includes(keyword) ||
      item.serial_number?.toLowerCase().includes(keyword);

    const matchesCompany =
      !companyFilter ||
      String(item.company_id ?? item.company?.id ?? "") ===
        companyFilter;

    const matchesCategory =
      !categoryFilter ||
      String(item.category?.id ?? "") === categoryFilter;

    const matchesLocation =
      !locationFilter ||
      String(item.location?.id ?? "") === locationFilter;

    const matchesCondition =
      !conditionFilter ||
      String(item.condition?.id ?? "") === conditionFilter;

    const matchesStatus =
      !statusFilter ||
      String(item.status?.id ?? "") === statusFilter;

    const loanState = loanAvailability?.get(item.id);

    let matchesAvailability = true;

    if (availabilityFilter) {
      // Jangan menganggap aset tersedia jika data pinjaman
      // gagal dimuat.
      if (loanAvailability === null) {
        matchesAvailability = false;
      } else if (availabilityFilter === "AVAILABLE") {
        matchesAvailability = !loanState;
      } else {
        matchesAvailability =
          loanState === availabilityFilter;
      }
    }

    return (
      matchesSearch &&
      matchesCompany &&
      matchesCategory &&
      matchesLocation &&
      matchesCondition &&
      matchesStatus &&
      matchesAvailability
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAssets.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function resetFilters() {
    setSearch("");
    setCompanyFilter("");
    setCategoryFilter("");
    setLocationFilter("");
    setConditionFilter("");
    setStatusFilter("");
    setAvailabilityFilter("");
    setPage(1);
  }

  return {
    assets: paginatedAssets,
    fullAssets: filteredAssets,
    loading,

    page: currentPage,
    setPage,
    totalPages,

    search,
    setSearch,

    companyFilter,
    setCompanyFilter,
    categoryFilter,
    setCategoryFilter,
    locationFilter,
    setLocationFilter,
    conditionFilter,
    setConditionFilter,
    statusFilter,
    setStatusFilter,

    availabilityFilter,
    setAvailabilityFilter,
    availabilityError,

    companyOptions,
    categoryOptions,
    locationOptions,
    conditionOptions,
    statusOptions,

    resetFilters,
    loadAssets,
    loadAssetDetail,
    addAsset,
    editAsset,
    removeAsset,
    getAssetDetail,
  };
}

function getOptions(
  values: Array<
    | {
        id: number;
        name: string;
        display_order?: number;
      }
    | null
    | undefined
  >
): AssetFilterOption[] {
  const unique = new Map<number, AssetFilterOption>();

  for (const value of values) {
    if (!value) continue;

    unique.set(value.id, {
      id: value.id,
      name: value.name,
      display_order: value.display_order,
    });
  }

  return Array.from(unique.values()).sort((a, b) => {
    const orderA = a.display_order ?? 9999;
    const orderB = b.display_order ?? 9999;

    return (
      orderA - orderB ||
      a.name.localeCompare(b.name)
    );
  });
}
