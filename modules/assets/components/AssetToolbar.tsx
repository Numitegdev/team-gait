
"use client";

import { Plus, RotateCcw } from "lucide-react";
import type {
  AssetFilterOption,
  AssetAvailability,
} from "../hooks/use-assets";

interface AssetToolbarProps {
  search: string;
  setSearch: (value: string) => void;

  companyFilter: string;
  setCompanyFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  locationFilter: string;
  setLocationFilter: (value: string) => void;
  conditionFilter: string;
  setConditionFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;

  availabilityFilter: AssetAvailability | "";
  setAvailabilityFilter: (
    value: AssetAvailability | ""
  ) => void;
  availabilityError: boolean;

  companyOptions: AssetFilterOption[];
  categoryOptions: AssetFilterOption[];
  locationOptions: AssetFilterOption[];
  conditionOptions: AssetFilterOption[];
  statusOptions: AssetFilterOption[];

  onResetFilters: () => void;
  onAdd: () => void;
}

export default function AssetToolbar({
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

  onResetFilters,
  onAdd,
}: AssetToolbarProps) {
  const selectClass =
    "h-11 min-w-0 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-500";

  return (
    <div className="mb-5 space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kode, nama, merek, atau serial number..."
          className="h-11 min-w-0 flex-1 rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
        />

        <button
          type="button"
          onClick={onAdd}
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Asset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className={selectClass}
          aria-label="Filter PT pemilik"
        >
          <option value="">Semua PT pemilik</option>
          {companyOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={selectClass}
          aria-label="Filter kategori aset"
        >
          <option value="">Semua kategori</option>
          {categoryOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className={selectClass}
          aria-label="Filter lokasi"
        >
          <option value="">Semua lokasi</option>
          {locationOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        <select
          value={conditionFilter}
          onChange={(e) => setConditionFilter(e.target.value)}
          className={selectClass}
          aria-label="Filter kondisi"
        >
          <option value="">Semua kondisi</option>
          {conditionOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectClass}
          aria-label="Filter status aset"
        >
          <option value="">Semua status aset</option>
          {statusOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        {/* <select
          value={availabilityFilter}
          onChange={(e) =>
            setAvailabilityFilter(
              e.target.value as AssetAvailability | ""
            )
          }
          className={selectClass}
          aria-label="Filter ketersediaan aset"
        >
          <option value="">Semua ketersediaan</option>
          <option value="AVAILABLE">Tersedia</option>
          <option value="PROCESSING">
            Dalam proses peminjaman
          </option>
          <option value="BORROWED">Dipinjam</option>
        </select> */}

        <button
          type="button"
          onClick={onResetFilters}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Reset filter
        </button>
      </div>

      {availabilityError && (
        <p className="text-sm text-red-600">
          Status ketersediaan gagal dimuat. Muat ulang data
          sebelum menggunakan filter ketersediaan.
        </p>
      )}
    </div>
  );
}
