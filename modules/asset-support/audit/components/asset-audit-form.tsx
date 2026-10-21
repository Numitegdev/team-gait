
"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  History,
  LoaderCircle,
} from "lucide-react";

import type {
  AssetAuditResult,
  AssetAuditSubmission,
} from "../types/asset-audit";

import {
  getAssetAuditHistory,
} from "../services/asset-audit-service";

import type {
  AssetAuditHistory,
} from "../types/asset-audit";

type Props = {
  asset: any;
  auditMonth: string;
  onClose: () => void;
  onSubmit: (input: AssetAuditSubmission) => Promise<boolean>;
};

const discrepancyOptions = [
  "Lokasi berbeda",
  "Kode aset berbeda",
  "Kondisi berbeda",
  "Spesifikasi berbeda",
  "Aset tertukar",
  "Lainnya",
];

export default function AssetAuditForm({
  asset,
  auditMonth,
  onClose,
  onSubmit,
}: Props) {
  const [result, setResult] =
    useState<AssetAuditResult>("found");

  const [discrepancyType, setDiscrepancyType] =
    useState("");

  const [notes, setNotes] = useState("");
  const [actualLocationId, setActualLocationId] =
    useState("");

  const [history, setHistory] =
    useState<AssetAuditHistory[]>([]);

  const [saving, setSaving] = useState(false);
  const [loadingHistory, setLoadingHistory] =
    useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadHistory() {
      if (!asset.audit?.id) {
        setHistory([]);
        return;
      }

      setLoadingHistory(true);

      try {
        const data = await getAssetAuditHistory(
          asset.audit.id,
        );

        setHistory(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingHistory(false);
      }
    }

    void loadHistory();
  }, [asset.id, asset.audit?.id]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setMessage("");

    if (
      result === "discrepancy" &&
      !discrepancyType.trim()
    ) {
      setMessage(
        "Pilih jenis ketidaksesuaian terlebih dahulu.",
      );
      return;
    }

    setSaving(true);

    const success = await onSubmit({
      auditMonth,
      assetId: Number(asset.id),
      result,
      discrepancyType:
        result === "discrepancy"
          ? discrepancyType
          : null,
      notes: notes.trim() || null,
      actualLocationId:
        result === "discrepancy" && actualLocationId
          ? Number(actualLocationId)
          : null,
    });

    setSaving(false);

    if (success) {
      onClose();
    }
  }

  const resultOptions = [
    {
      value: "found" as const,
      label: "Ditemukan",
      description: "Aset ditemukan dan sesuai data.",
      icon: CheckCircle2,
      color: "border-green-500 bg-green-50 text-green-700",
    },
    {
      value: "discrepancy" as const,
      label: "Tidak Sesuai",
      description: "Aset ditemukan, tetapi ada perbedaan.",
      icon: AlertTriangle,
      color: "border-amber-500 bg-amber-50 text-amber-700",
    },
    {
      value: "not_found" as const,
      label: "Tidak Ditemukan",
      description: "Aset tidak ditemukan di lokasi pemeriksaan.",
      icon: XCircle,
      color: "border-red-500 bg-red-50 text-red-700",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 md:p-6">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4 md:p-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Pemeriksaan Aset
            </h2>
            <p className="text-sm text-gray-500">
              Periode {auditMonth}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-4 md:p-5">
          <section className="rounded-xl border bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase text-gray-500">
              Informasi aset
            </p>

            <h3 className="mt-2 text-lg font-bold text-gray-900">
              {asset.asset_code ?? "-"} — {asset.asset_name ?? "-"}
            </h3>

            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <span className="text-gray-500">PT pemilik</span>
                <p className="font-medium">
                  {asset.company?.name ?? "-"}
                </p>
              </div>

              <div>
                <span className="text-gray-500">
                  Lokasi terdaftar
                </span>
                <p className="font-medium">
                  {asset.location?.name ?? "-"}
                </p>
              </div>

              <div>
                <span className="text-gray-500">Kategori</span>
                <p className="font-medium">
                  {asset.category?.name ?? "-"}
                </p>
              </div>

              <div>
                <span className="text-gray-500">Nomor seri</span>
                <p className="font-medium">
                  {asset.serial_number ?? "-"}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold text-gray-900">
              Hasil pemeriksaan
            </h3>

            <div className="grid gap-3 md:grid-cols-3">
              {resultOptions.map((option) => {
                const Icon = option.icon;
                const selected = result === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setResult(option.value)}
                    className={`rounded-xl border-2 p-3 text-left transition ${
                      selected
                        ? option.color
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <Icon size={19} />
                      {option.label}
                    </div>

                    <p className="mt-2 text-xs leading-5">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {result === "discrepancy" && (
            <section className="space-y-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
              <h3 className="font-semibold text-gray-900">
                Detail ketidaksesuaian
              </h3>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  Jenis ketidaksesuaian *
                </span>

                <select
                  required
                  value={discrepancyType}
                  onChange={(e) =>
                    setDiscrepancyType(e.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3"
                >
                  <option value="">Pilih jenis</option>

                  {discrepancyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-gray-700">
                  ID lokasi aktual (opsional)
                </span>

                <input
                  type="number"
                  min="1"
                  value={actualLocationId}
                  onChange={(e) =>
                    setActualLocationId(e.target.value)
                  }
                  placeholder="Masukkan ID lokasi aktual"
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3"
                />

                <span className="text-xs text-gray-500">
                  Ini hanya mencatat lokasi saat audit, tidak
                  mengubah lokasi pada data master aset.
                </span>
              </label>
            </section>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-700">
              Catatan pemeriksaan
            </span>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Tambahkan catatan jika diperlukan..."
              className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500"
            />
          </label>

          {message && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {message}
            </div>
          )}

          <section className="rounded-xl border p-4">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900">
              <History size={17} />
              Riwayat pemeriksaan
            </h3>

            {loadingHistory ? (
              <p className="mt-3 text-sm text-gray-500">
                Memuat riwayat...
              </p>
            ) : history.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">
                Belum ada riwayat untuk pemeriksaan ini.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-2 border-blue-300 pl-3"
                  >
                    <p className="text-sm font-semibold text-gray-800">
                      {item.previous_result
                        ? `${item.previous_result} → ${item.new_result}`
                        : `Audit awal: ${item.new_result}`}
                    </p>

                    {item.discrepancy_type && (
                      <p className="text-sm text-gray-600">
                        Jenis: {item.discrepancy_type}
                      </p>
                    )}

                    {item.notes && (
                      <p className="text-sm text-gray-600">
                        {item.notes}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(item.changed_at).toLocaleString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-11 rounded-xl border px-5 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Hasil Audit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
