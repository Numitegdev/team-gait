
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  Check,
} from "lucide-react";

import {
  useMutationForm,
} from "../hooks/use-mutation-form";

interface MutationRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MutationRequestModal({
  open,
  onClose,
  onSuccess,
}: MutationRequestModalProps) {
  const {
    form,
    loading,
    assets,
    companies,
    locations,
    loadMasterData,
    handleChange,
    handleSubmit,
  } = useMutationForm();

  const [assetSearch, setAssetSearch] = useState("");
  const [assetDropdownOpen, setAssetDropdownOpen] = useState(false);

  const selectedAsset = assets.find(
    (asset) => asset.id === form.asset_id
  );

  const filteredAssets = useMemo(() => {
    const keyword = assetSearch.trim().toLowerCase();

    return assets
      .filter((asset) => {
        if (!keyword) return true;

        return (
          String(asset.asset_code ?? "")
            .toLowerCase()
            .includes(keyword) ||
          String(asset.asset_name ?? "")
            .toLowerCase()
            .includes(keyword)
        );
      })
      .slice(0, 50);
  }, [assets, assetSearch]);

  useEffect(() => {
    if (!open) return;

    loadMasterData();
  }, [open]);

  useEffect(() => {
    if (!open) {
      setAssetSearch("");
      setAssetDropdownOpen(false);
    }
  }, [open]);

  function selectAsset(assetId: number) {
    const asset = assets.find(
      (item) => item.id === assetId
    );

    handleChange("asset_id", assetId);

    if (asset) {
      handleChange("from_company_id", asset.company_id);
      handleChange("from_location_id", asset.location_id);

      setAssetSearch(
        `${asset.asset_code} - ${asset.asset_name}`
      );
    } else {
      setAssetSearch("");
    }

    setAssetDropdownOpen(false);
  }

  async function submitMutation() {
    const success = await handleSubmit();

    if (success) {
      onSuccess();
    }
  }

  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-4
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-3xl
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
            p-6
          "
        >
          <div>
            <h2 className="text-2xl font-bold">
              Request Asset Mutation
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Buat permintaan perpindahan asset.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              text-2xl
              text-gray-400
              hover:text-gray-600
            "
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* ASSET SEARCH */}
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

            <div className="relative">
              <div className="relative">
                <Search
                  size={18}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={assetSearch}
                  onFocus={() => setAssetDropdownOpen(true)}
                  onChange={(e) => {
                    setAssetSearch(e.target.value);
                    setAssetDropdownOpen(true);

                    // Hapus pilihan lama saat pencarian diubah.
                    handleChange("asset_id", 0);
                    handleChange("from_company_id", 0);
                    handleChange("from_location_id", 0);
                  }}
                  placeholder="Cari kode atau nama asset..."
                  className="
                    w-full
                    rounded-xl
                    border
                    py-3
                    pl-10
                    pr-11
                    outline-none
                    focus:border-blue-500
                  "
                  autoComplete="off"
                />

                <button
                  type="button"
                  onClick={() => {
                    setAssetDropdownOpen((current) => !current);
                  }}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                  aria-label="Tampilkan daftar asset"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {assetDropdownOpen && (
                <>
                  {/* Klik area di luar daftar untuk menutupnya */}
                  <button
                    type="button"
                    aria-label="Tutup daftar asset"
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setAssetDropdownOpen(false)}
                  />

                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      top-full
                      z-20
                      mt-2
                      max-h-64
                      overflow-y-auto
                      rounded-xl
                      border
                      bg-white
                      shadow-lg
                    "
                  >
                    {filteredAssets.length === 0 ? (
                      <div className="px-4 py-5 text-center text-sm text-gray-500">
                        Asset tidak ditemukan.
                      </div>
                    ) : (
                      <>
                        {filteredAssets.map((asset) => {
                          const isSelected =
                            asset.id === form.asset_id;

                          return (
                            <button
                              key={asset.id}
                              type="button"
                              onClick={() => selectAsset(asset.id)}
                              className={`
                                flex
                                w-full
                                items-center
                                justify-between
                                gap-3
                                border-b
                                px-4
                                py-3
                                text-left
                                last:border-b-0
                                hover:bg-blue-50
                                ${
                                  isSelected
                                    ? "bg-blue-50"
                                    : ""
                                }
                              `}
                            >
                              <span className="min-w-0">
                                <span className="block truncate font-medium text-gray-800">
                                  {asset.asset_code}
                                </span>

                                <span className="block truncate text-sm text-gray-500">
                                  {asset.asset_name}
                                </span>
                              </span>

                              {isSelected && (
                                <Check
                                  size={18}
                                  className="shrink-0 text-blue-600"
                                />
                              )}
                            </button>
                          );
                        })}

                        {filteredAssets.length === 50 && (
                          <p className="px-4 py-3 text-center text-xs text-gray-500">
                            Menampilkan maksimal 50 hasil. Ketik lebih banyak untuk mempersempit pencarian.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {selectedAsset && (
              <p className="mt-2 text-sm text-green-700">
                Asset dipilih: {selectedAsset.asset_code}
              </p>
            )}
          </div>

          {/* FROM COMPANY */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              From Company
            </label>

            <input
              readOnly
              value={
                companies.find(
                  (company) =>
                    company.id === form.from_company_id
                )?.name ?? ""
              }
              className="
                w-full
                rounded-xl
                border
                bg-gray-100
                px-4
                py-3
              "
            />
          </div>

          {/* FROM LOCATION */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              From Location
            </label>

            <input
              readOnly
              value={
                locations.find(
                  (location) =>
                    location.id === form.from_location_id
                )?.name ?? ""
              }
              className="
                w-full
                rounded-xl
                border
                bg-gray-100
                px-4
                py-3
              "
            />
          </div>

          {/* DESTINATION */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                To Company
              </label>

              <select
                value={form.to_company_id}
                onChange={(e) =>
                  handleChange(
                    "to_company_id",
                    Number(e.target.value)
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  px-4
                  py-3
                  outline-none
                  focus:border-blue-500
                "
              >
                <option value={0}>
                  -- Wajib pilih company --
                </option>

                {companies.map((company) => (
                  <option
                    key={company.id}
                    value={company.id}
                    disabled={company.id === form.from_company_id}
                  >
                    {company.name}
                    {company.id === form.from_company_id
                      ? " (PT asal)"
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                To Location
              </label>

              <select
                value={form.to_location_id}
                onChange={(e) =>
                  handleChange(
                    "to_location_id",
                    Number(e.target.value)
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  px-4
                  py-3
                  outline-none
                  focus:border-blue-500
                "
              >
                <option value={0}>
                  -- Tetap di lokasi sekarang --
                </option>

                {locations
                  .filter(
                    (location) =>
                      location.id !== form.from_location_id
                  )
                  .map((location) => (
                    <option
                      key={location.id}
                      value={location.id}
                    >
                      {location.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* REMARKS */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Remarks
            </label>

            <textarea
              value={form.remarks}
              onChange={(e) =>
                handleChange("remarks", e.target.value)
              }
              rows={4}
              placeholder="Contoh: Dipindahkan ke ruang meeting karena digunakan oleh Finance."
              className="
                w-full
                resize-none
                rounded-xl
                border
                px-4
                py-3
                outline-none
                focus:border-blue-500
              "
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            flex
            justify-end
            gap-3
            border-t
            p-6
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
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submitMutation}
            disabled={loading}
            className="
              rounded-xl
              bg-blue-600
              px-5
              py-2
              font-medium
              text-white
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
