
"use client";
import { useCallback, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  ClipboardCheck,
  MapPin,
  Building2,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Monitor,
  ChevronRight,
  Camera,
} from "lucide-react";

import AssetAuditForm from "./components/asset-audit-form";
import AssetAuditScanner from "./components/asset-audit-scanner";
import { useAssetAudit } from "./hooks/use-asset-audit";

export default function AssetAuditPage() {
  const {
    assets,
    filters,
    setFilters,
    loading,
    error,
    searchAsset,
    selectedAsset,
    setSelectedAsset,
    submitAudit,
    companies,
    locations,
  } = useAssetAudit();

const handleScan = useCallback(
  async (assetCode: string) => {
    setScannerOpen(false);
    setScanning(true);

    try {
      await searchAsset(assetCode.trim());
    } catch (error) {
      console.error("Gagal mencari aset hasil scan:", error);
    } finally {
      setScanning(false);
    }
  },
  [searchAsset],
);


const [search, setSearch] = useState("");
const [scannerOpen, setScannerOpen] = useState(false);
const [scanning, setScanning] = useState(false);

  const filteredAssets = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return assets;

    return assets.filter((asset: any) =>
      [
        asset.asset_code,
        asset.barcode,
        asset.asset_name,
        asset.brand,
        asset.serial_number,
        asset.company?.name,
        asset.location?.name,
        asset.category?.name,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(keyword),
        ),
    );
  }, [assets, search]);

  const summary = useMemo(
    () => ({
      total: assets.length,
      found: assets.filter(
        (a: any) => a.auditProgress === "found",
      ).length,
      discrepancy: assets.filter(
        (a: any) => a.auditProgress === "discrepancy",
      ).length,
      notFound: assets.filter(
        (a: any) => a.auditProgress === "not_found",
      ).length,
      unchecked: assets.filter(
        (a: any) => a.auditProgress === "unchecked",
      ).length,
    }),
    [assets],
  );

  const updateFilter = (
    key: "auditMonth" | "companyId" | "locationId",
    value: string,
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]:
        key === "auditMonth"
          ? value
          : value === ""
            ? null
            : Number(value),
    }));
  };



  function statusLabel(result: string) {
    switch (result) {
      case "found":
        return {
          label: "Ditemukan",
          className: "bg-green-100 text-green-700",
          icon: CheckCircle2,
        };

      case "discrepancy":
        return {
          label: "Tidak Sesuai",
          className: "bg-amber-100 text-amber-700",
          icon: AlertTriangle,
        };

      case "not_found":
        return {
          label: "Tidak Ditemukan",
          className: "bg-red-100 text-red-700",
          icon: XCircle,
        };

      default:
        return {
          label: "Belum Dicek",
          className: "bg-gray-100 text-gray-600",
          icon: Clock,
        };
    }
  }

  function formatCheckedAt(value?: string | null) {
    if (!value) return "-";

    return new Date(value).toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  return (
    <div className="min-w-0 space-y-4 p-3 sm:space-y-6 sm:p-5 lg:p-6">
      {/* Header */}
      <header className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Audit Aset
          </h1>

          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            Pemeriksaan aset berdasarkan periode dan lokasi terdaftar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          aria-label="Muat ulang halaman"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:px-4"
        >
          <RefreshCw size={16} />
          <span className="hidden sm:inline">Muat Ulang</span>
        </button>
      </header>

      {/* Filters */}
      <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Search size={18} className="shrink-0 text-blue-600" />
          <h2 className="font-semibold text-gray-900">
            Filter Audit
          </h2>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
          <label className="block min-w-0 space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <CalendarDays size={16} />
              Periode Audit
            </span>

            <input
              type="month"
              value={filters.auditMonth}
              onChange={(e) =>
                updateFilter("auditMonth", e.target.value)
              }
              className="h-12 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="block min-w-0 space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Building2 size={16} />
              PT Pemilik
            </span>

            <select
              value={filters.companyId ?? ""}
              onChange={(e) =>
                updateFilter("companyId", e.target.value)
              }
              disabled={companies.length === 1}
              className="h-12 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            >
              {companies.length > 1 && (
                <option value="">Semua PT</option>
              )}

              {companies.map((company: any) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block min-w-0 space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin size={16} />
              Lokasi Terdaftar
            </span>

            <select
              value={filters.locationId ?? ""}
              onChange={(e) =>
                updateFilter("locationId", e.target.value)
              }
              className="h-12 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Semua lokasi</option>

              {locations.map((location: any) => (
                <option key={location.id} value={location.id}>
                  {location.code
                    ? `${location.code} - ${location.name}`
                    : location.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          {
            label: "Total Aset",
            value: summary.total,
            color: "text-blue-700",
            bg: "bg-blue-50",
            icon: Monitor,
          },
          {
            label: "Belum Dicek",
            value: summary.unchecked,
            color: "text-gray-700",
            bg: "bg-gray-50",
            icon: Clock,
          },
          {
            label: "Ditemukan",
            value: summary.found,
            color: "text-green-700",
            bg: "bg-green-50",
            icon: CheckCircle2,
          },
          {
            label: "Tidak Sesuai",
            value: summary.discrepancy,
            color: "text-amber-700",
            bg: "bg-amber-50",
            icon: AlertTriangle,
          },
          {
            label: "Tidak Ditemukan",
            value: summary.notFound,
            color: "text-red-700",
            bg: "bg-red-50",
            icon: XCircle,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`min-w-0 rounded-2xl border border-gray-200 p-3 sm:p-4 ${item.bg}`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className={item.color} />
                <p className="text-xs font-medium leading-snug text-gray-600">
                  {item.label}
                </p>
              </div>

              <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          );
        })}
      </section>
{/* Scanner Aset */}
<section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Camera size={22} />
      </div>

      <div>
        <h2 className="font-semibold text-gray-900">
          Scan Kode Aset
        </h2>

        <p className="mt-1 text-sm leading-relaxed text-gray-500">
          Pindai QR atau barcode untuk mencari data aset terbaru.
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={() => setScannerOpen((previous) => !previous)}
      disabled={scanning}
      className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      <Camera size={18} />
      {scannerOpen ? "Tutup Scanner" : "Buka Scanner"}
    </button>
  </div>

  {scanning && (
    <div className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
      Mencari aset berdasarkan kode yang terbaca...
    </div>
  )}

  {scannerOpen && (
    <div className="mt-4">
      <AssetAuditScanner
        onScan={handleScan}
        onClose={() => setScannerOpen(false)}
      />
    </div>
  )}
</section>
      {/* Asset list */}
      <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="space-y-3 border-b border-gray-200 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <ClipboardCheck
              size={20}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-gray-900">
                Daftar Aset Audit
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredAssets.length} aset ditampilkan
              </p>
            </div>
          </div>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

         
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Memuat daftar aset...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Tidak ada aset yang sesuai dengan filter.
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredAssets.map((asset: any) => {
                const status = statusLabel(asset.auditProgress);
                const StatusIcon = status.icon;

                return (
                  <article
                    key={asset.id}
                    className="min-w-0 p-4"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Monitor size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="wrap-break-word text-sm font-bold text-blue-700">
                          {asset.asset_code ?? "-"}
                        </p>

                        <h3 className="mt-1 wrap-break-word font-semibold leading-snug text-gray-900">
                          {asset.asset_name ?? "-"}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {asset.category?.name ?? "Kategori tidak tersedia"}
                        </p>
                      </div>

                      <ChevronRight
                        size={18}
                        className="mt-1 shrink-0 text-gray-400"
                      />
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <Building2
                          size={16}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">PT Pemilik</p>
                          <p className="wrap-break-word font-medium text-gray-800">
                            {asset.company?.name ?? "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />

                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">
                            Lokasi Terdaftar
                          </p>
                          <p className="wrap-break-word font-medium text-gray-800">
                            {asset.location?.name ?? "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2 border-t border-gray-100 pt-3">
                        <span
                          className={`inline-flex w-fit max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          <StatusIcon size={14} className="shrink-0" />
                          {status.label}
                        </span>

                        <p className="text-xs text-gray-500">
                          Waktu cek: {formatCheckedAt(asset.audit?.checked_at)}
                        </p>

                        <button
                          type="button"
                          onClick={() => setSelectedAsset(asset)}
                          className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
                        >
                          <ClipboardCheck size={17} />
                          {asset.auditProgress === "unchecked"
                            ? "Mulai Audit"
                            : "Lihat / Ubah Hasil"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Kode Aset</th>
                    <th className="px-4 py-3">Nama Aset</th>
                    <th className="px-4 py-3">PT Pemilik</th>
                    <th className="px-4 py-3">Lokasi Terdaftar</th>
                    <th className="px-4 py-3">Hasil Audit</th>
                    <th className="px-4 py-3">Waktu Cek</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredAssets.map((asset: any) => {
                    const status = statusLabel(asset.auditProgress);
                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={asset.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                          {asset.asset_code ?? "-"}
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">
                            {asset.asset_name ?? "-"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {asset.category?.name ?? "-"}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          {asset.company?.name ?? "-"}
                        </td>

                        <td className="px-4 py-3">
                          {asset.location?.name ?? "-"}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                          >
                            <StatusIcon size={14} />
                            {status.label}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                          {formatCheckedAt(asset.audit?.checked_at)}
                        </td>

                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedAsset(asset)}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Periksa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* Audit form */}
      {selectedAsset && (
        <AssetAuditForm
          asset={selectedAsset}
          auditMonth={filters.auditMonth}
          onClose={() => setSelectedAsset(null)}
          onSubmit={submitAudit}
        />
      )}
    </div>
  );
}
