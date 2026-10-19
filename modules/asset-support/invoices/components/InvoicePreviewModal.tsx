
"use client";

import { useEffect, useState } from "react";
import {
  getInvoicePreview,
  createAssetInvoice,
} from "../services/invoice-service";
import type { InvoicePreview } from "../services/invoice-service";

interface InvoicePreviewModalProps {
  ownerCompanyId: number;
  ownerCompanyName: string;
  borrowerCompanyId: number;
  borrowerCompanyName: string;
  onClose: () => void;
}

function getCurrentPeriod() {
  const now = new Date();

  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

export default function InvoicePreviewModal({
  ownerCompanyId,
  ownerCompanyName,
  borrowerCompanyId,
  borrowerCompanyName,
  onClose,
}: InvoicePreviewModalProps) {
  const currentPeriod = getCurrentPeriod();

  const [month, setMonth] = useState(currentPeriod.month);
  const [year, setYear] = useState(currentPeriod.year);
  const [preview, setPreview] = useState<InvoicePreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [saving, setSaving] = useState(false);
const [savedInvoiceNo, setSavedInvoiceNo] = useState("");
  useEffect(() => {
    let cancelled = false;

    async function loadPreview() {
      setLoading(true);
      setError("");
      setPreview(null);

      try {
        const result = await getInvoicePreview(
          ownerCompanyId,
          borrowerCompanyId,
          month,
          year
        );

        if (!cancelled) {
          setPreview(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat preview invoice."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [
    ownerCompanyId,
    borrowerCompanyId,
    month,
    year,
  ]);

  const monthOptions = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];


  async function handleSaveInvoice() {
    if (saving || savedInvoiceNo) return;

    setSaving(true);
    setError("");

    try {
      const result = await createAssetInvoice(
        ownerCompanyId,
        borrowerCompanyId,
        month,
        year
      );

      setSavedInvoiceNo(result.invoice.invoice_no);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan invoice."
      );
    } finally {
      setSaving(false);
    }
  }


  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-preview-title"
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
          <div>
            <h2
              id="invoice-preview-title"
              className="text-lg font-bold"
            >
              Preview Invoice
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {ownerCompanyName} → {borrowerCompanyName}
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

        <div className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Bulan invoice
              </label>

              <select
                value={month}
                onChange={(event) =>
                  setMonth(Number(event.target.value))
                }
                className="h-11 w-full rounded-xl border bg-white px-3"
              >
                {monthOptions.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Tahun invoice
              </label>

              <input
                type="number"
                min={2000}
                value={year}
                onChange={(event) => {
                  const value = Number(event.target.value);

                  if (value >= 2000) {
                    setYear(value);
                  }
                }}
                className="h-11 w-full rounded-xl border px-3"
              />
            </div>
          </div>

          {loading && (
            <div className="rounded-xl border p-6 text-center text-sm text-gray-500">
              Menghitung preview invoice...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && preview && (
            <>
            
<div className="overflow-hidden rounded-xl border">
  {/* HEADER PERUSAHAAN PENERBIT */}
  {preview.issuerCompany.headerImageUrl && (
    <img
      src={preview.issuerCompany.headerImageUrl}
      alt={`Header ${preview.issuerCompany.legalName}`}
      className="block max-h-40 w-full object-contain"
    />
  )}

  <div className="p-5">
    <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
      {/* INFORMASI PERUSAHAAN */}
      <div className="min-w-0 flex-1 space-y-5">
        {/* PENERBIT */}
        <div className="flex items-start gap-3">
          {preview.issuerCompany.logoUrl && (
            <img
              src={preview.issuerCompany.logoUrl}
              alt={`Logo ${preview.issuerCompany.legalName}`}
              className="h-14 w-14 shrink-0 object-contain"
            />
          )}

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Dari
            </p>

            <p className="mt-1 font-bold">
              {preview.issuerCompany.legalName}
            </p>

            <p className="mt-1 whitespace-pre-line text-sm text-gray-600">
              {preview.issuerCompany.address}
            </p>
          </div>
        </div>

        {/* PENERIMA */}
        <div className="flex items-start gap-3">
          {preview.buyerCompany.logoUrl && (
            <img
              src={preview.buyerCompany.logoUrl}
              alt={`Logo ${preview.buyerCompany.legalName}`}
              className="h-14 w-14 shrink-0 object-contain"
            />
          )}

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Kepada
            </p>

            <p className="mt-1 font-bold">
              {preview.buyerCompany.legalName}
            </p>

            <p className="mt-1 whitespace-pre-line text-sm text-gray-600">
              {preview.buyerCompany.address}
            </p>
          </div>
        </div>
      </div>

      {/* TANGGAL INVOICE */}
      <div className="text-sm sm:min-w-[210px] sm:text-right">
        <p>
          <span className="text-gray-500">
            Tanggal invoice:{" "}
          </span>
          <strong>
            {formatDate(preview.invoiceDate)}
          </strong>
        </p>

        <p className="mt-1">
          <span className="text-gray-500">
            Jatuh tempo:{" "}
          </span>
          <strong>
            {formatDate(preview.dueDate)}
          </strong>
        </p>

        <p className="mt-2 text-xs text-gray-500">
          Nomor invoice dibuat saat invoice disimpan.
        </p>
      </div>
    </div>
  </div>
</div>
```

              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[650px] text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left">No</th>
                      <th className="px-3 py-3 text-left">
                        Keterangan asset
                      </th>
                      <th className="px-3 py-3 text-left">Periode</th>
                      <th className="px-3 py-3 text-right">Pcs</th>
                      <th className="px-3 py-3 text-right">
                        Harga satuan
                      </th>
                      <th className="px-3 py-3 text-right">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {preview.items.map((item, index) => (
                      <tr
                        key={item.familyCode}
                        className="border-t"
                      >
                        <td className="px-3 py-3">
                          {index + 1}
                        </td>
                        <td className="px-3 py-3">
                          {item.familyName}
                        </td>
                        <td className="px-3 py-3">
                          {String(month).padStart(2, "0")}/{year}
                        </td>
                        <td className="px-3 py-3 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-3 py-3 text-right">
                          {formatRupiah(item.unitPrice)}
                        </td>
                        <td className="px-3 py-3 text-right font-medium">
                          {formatRupiah(item.total)}
                        </td>
                      </tr>
                    ))}

                    {preview.items.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          Tidak ada asset yang dapat ditagihkan pada periode ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="ml-auto max-w-sm space-y-3 rounded-xl border p-4">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatRupiah(preview.subtotal)}</span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-600">PPN 11%</span>
                  <span>{formatRupiah(preview.ppn)}</span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-gray-600">PPh23 2%</span>
                  <span>- {formatRupiah(preview.pph23)}</span>
                </div>

                <div className="flex justify-between gap-4 border-t pt-3 font-bold">
                  <span>Total</span>
                  <span>{formatRupiah(preview.total)}</span>
                </div>
              </div>

              {/* INFORMASI PEMBAYARAN DAN TANDA TANGAN */}
              <div className="grid gap-6 border-t pt-5 sm:grid-cols-2">
                {/* INFORMASI REKENING */}
                {(preview.issuerCompany.bankName ||
                  preview.issuerCompany.bankAccountName ||
                  preview.issuerCompany.bankAccountNumber) && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold">
                      Informasi Pembayaran
                    </h3>

                    {preview.issuerCompany.bankName && (
                      <p className="text-sm">
                        <span className="text-gray-500">Bank: </span>
                        <span className="font-medium">
                          {preview.issuerCompany.bankName}
                        </span>
                      </p>
                    )}

                    {preview.issuerCompany.bankAccountName && (
                      <p className="text-sm">
                        <span className="text-gray-500">
                          Nama pemilik rekening:{" "}
                        </span>
                        <span className="font-medium">
                          {preview.issuerCompany.bankAccountName}
                        </span>
                      </p>
                    )}

                    {preview.issuerCompany.bankAccountNumber && (
                      <p className="text-sm">
                        <span className="text-gray-500">
                          Nomor rekening:{" "}
                        </span>
                        <span className="font-bold">
                          {preview.issuerCompany.bankAccountNumber}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {/* TANDA TANGAN PENERBIT */}
                {(preview.issuerCompany.signatureImageUrl ||
                  preview.issuerCompany.signerName ||
                  preview.issuerCompany.signerPosition) && (
                  <div className="flex flex-col items-center text-center sm:items-end sm:text-right">
                    <p className="text-sm text-gray-600">
                      Hormat kami,
                    </p>

                    {preview.issuerCompany.signatureImageUrl && (
                      <img
                        src={preview.issuerCompany.signatureImageUrl}
                        alt={`Tanda tangan ${preview.issuerCompany.signerName || preview.issuerCompany.legalName}`}
                        className="my-2 h-24 max-w-48 object-contain"
                      />
                    )}

                    {preview.issuerCompany.signerName && (
                      <p className="font-bold underline underline-offset-4">
                        {preview.issuerCompany.signerName}
                      </p>
                    )}

                    {preview.issuerCompany.signerPosition && (
                      <p className="mt-1 text-sm text-gray-600">
                        {preview.issuerCompany.signerPosition}
                      </p>
                    )}
                  </div>
                )}
              </div>


              {savedInvoiceNo && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                  Invoice berhasil disimpan dengan nomor:
                  <p className="mt-1 font-bold">
                    {savedInvoiceNo}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveInvoice}
                disabled={
                  saving ||
                  Boolean(savedInvoiceNo) ||
                  loading ||
                  !preview
                }
                className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
              >
                {saving
                  ? "Menyimpan Invoice..."
                  : savedInvoiceNo
                    ? "Invoice Sudah Disimpan"
                    : "Simpan Invoice"}
              </button>


              <p className="text-xs text-gray-500">
                Ini hanya preview. Belum ada invoice yang disimpan
                dan nomor invoice belum digunakan.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}