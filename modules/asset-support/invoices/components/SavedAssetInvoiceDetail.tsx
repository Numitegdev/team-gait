
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import {
  getSavedAssetInvoiceDetail,
  SavedAssetInvoice,
  SavedAssetInvoiceItem,
} from "../services/invoice-service";

interface Props {
  invoiceId: number;
  onClose: () => void;
}

interface InvoiceDetailData {
  invoice: SavedAssetInvoice;
  items: SavedAssetInvoiceItem[];
}

interface InvoiceCompanyBranding {
  logo_url: string | null;
  header_image_url: string | null;
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  signer_name: string | null;
  signer_position: string | null;
  signature_image_url: string | null;
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTanggal(value: string) {
  if (!value) return "-";

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function SavedAssetInvoiceDetail({
  invoiceId,
  onClose,
}: Props) {
  const [data, setData] = useState<InvoiceDetailData | null>(null);
  const [branding, setBranding] =
    useState<InvoiceCompanyBranding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDetail() {
      try {
        setLoading(true);
        setError(null);
        setData(null);
        setBranding(null);

        const result = await getSavedAssetInvoiceDetail(invoiceId);

        if (!active) return;

        setData(result);

        // Ambil logo, header, rekening, dan tanda tangan
        // milik PT penerbit invoice.
        const supabase = createClient();

        const { data: companySettings, error: settingsError } =
          await supabase
            .from("invoice_company_settings")
            .select(`
              logo_url,
              header_image_url,
              bank_name,
              bank_account_name,
              bank_account_number,
              signer_name,
              signer_position,
              signature_image_url
            `)
            .eq("company_id", result.invoice.issuer_company_id)
            .maybeSingle();

        if (settingsError) {
          console.error(
            "Gagal mengambil pengaturan invoice:",
            settingsError
          );
        }

        if (active) {
          setBranding(companySettings ?? null);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil detail invoice."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      active = false;
    };
  }, [invoiceId]);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 p-3 sm:p-6">
      <div className="mx-auto my-4 max-w-5xl rounded-2xl bg-white p-4 shadow-xl sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h2 className="text-lg font-bold">
            Detail Invoice Asset
          </h2>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={!data || loading}
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Cetak / Simpan PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2 text-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>

        {loading && (
          <p className="py-10 text-center text-sm text-gray-500">
            Memuat detail invoice...
          </p>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && data && (
          <div
            id="saved-asset-invoice-print"
            className="text-gray-900"
          >
            {/* HEADER IMAGE */}
            {branding?.header_image_url && (
              <div className="mb-5 text-center">
                <img
                  src={branding.header_image_url}
                  alt="Header invoice"
                  className="mx-auto max-h-28 w-full object-contain"
                />
              </div>
            )}

            {/* LOGO DAN IDENTITAS PENERBIT */}
            <div className="grid gap-5 border-b py-5 sm:grid-cols-2">

               <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Penerima / PT Peminjam
                </p>

                <p className="mt-2 font-bold">
                  {data.invoice.buyer_name}
                </p>

                <p className="mt-1 whitespace-pre-line text-sm text-gray-600">
                  {data.invoice.buyer_address}
                </p>
              </div>

              <div className="shrink-0 text-right text-sm">
                <p>
                  <span className="font-semibold">Tanggal:</span>{" "}
                  {formatTanggal(data.invoice.invoice_date)}
                </p>

                <p className="mt-1">
                  <span className="font-semibold">Jatuh tempo:</span>{" "}
                  {formatTanggal(data.invoice.due_date)}
                </p>

                <p className="mt-1">
                  <span className="font-semibold">Invoice-No:</span>{" "}                
                  {data.invoice.invoice_no}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <table className="w-full table-fixed border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="w-10 px-2 py-3">No.</th>
                    <th className="px-2 py-3">Deskripsi</th>
                    <th className="w-16 px-2 py-3 text-right">Qty</th>
                    <th className="w-32 px-2 py-3 text-right">
                      Harga Satuan
                    </th>
                    <th className="w-32 px-2 py-3 text-right">
                      Jumlah
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-2 py-3">
                        {index + 1}
                      </td>

                      <td className="break-words px-2 py-3">
                        <p className="font-medium">
                          {item.description}
                        </p>

                        {item.period && (
                          <p className="mt-1 text-xs text-gray-500">
                            Periode: {item.period}
                          </p>
                        )}
                      </td>

                      <td className="px-2 py-3 text-right">
                        {item.quantity.toLocaleString("id-ID")}
                      </td>

                      <td className="px-2 py-3 text-right">
                        {formatRupiah(item.unit_price)}
                      </td>

                      <td className="px-2 py-3 text-right">
                        {formatRupiah(item.total)}
                      </td>
                    </tr>
                  ))}

                  {data.items.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-8 text-center text-gray-500"
                      >
                        Tidak ada rincian item pada invoice ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TOTAL */}
            <div className="ml-auto mt-6 w-full max-w-sm space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span>Subtotal</span>
                <span>{formatRupiah(data.invoice.subtotal)}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>PPN</span>
                <span>{formatRupiah(data.invoice.ppn)}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>PPh 23</span>
                <span>- {formatRupiah(data.invoice.pph23)}</span>
              </div>

              <div className="flex justify-between gap-4 border-t-2 border-gray-800 pt-3 text-base font-bold">
                <span>Total Tagihan</span>
                <span>{formatRupiah(data.invoice.total)}</span>
              </div>
            </div>

            {/* REKENING DAN TANDA TANGAN */}
            <div className="mt-10 grid gap-10 border-t pt-6 sm:grid-cols-2">
              <div className="text-sm">
                <p className="font-bold">Informasi Pembayaran</p>

                {branding?.bank_name && (
                  <p className="mt-3">
                    <span className="font-semibold">Bank:</span>{" "}
                    {branding.bank_name}
                  </p>
                )}

                {branding?.bank_account_name && (
                  <p className="mt-1">
                    <span className="font-semibold">Atas Nama:</span>{" "}
                    {branding.bank_account_name}
                  </p>
                )}

                {branding?.bank_account_number && (
                  <p className="mt-1">
                    <span className="font-semibold">No. Rekening:</span>{" "}
                    {branding.bank_account_number}
                  </p>
                )}

                {!branding?.bank_name &&
                  !branding?.bank_account_name &&
                  !branding?.bank_account_number && (
                    <p className="mt-3 text-gray-500">
                      Informasi rekening belum diatur.
                    </p>
                  )}
              </div>

              <div className="text-sm sm:text-center">
                <p>
                  {branding?.signer_position || "Hormat kami"}
                </p>

                {branding?.signature_image_url && (
                  <img
                    src={branding.signature_image_url}
                    alt="Tanda tangan"
                    className="mx-auto my-2 h-20 max-w-40 object-contain"
                  />
                )}

                {!branding?.signature_image_url && (
                  <div className="h-20" />
                )}

                <p className="font-bold underline">
                  {branding?.signer_name || data.invoice.issuer_name}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t pt-4 text-xs text-gray-500">
              Dokumen ini dibuat dari data invoice asset yang tersimpan
              di sistem.
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          body * {
            visibility: hidden !important;
          }

          #saved-asset-invoice-print,
          #saved-asset-invoice-print * {
            visibility: visible !important;
          }

          #saved-asset-invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            color: #111 !important;
            background: #fff !important;
            font-size: 10pt;
          }

          #saved-asset-invoice-print table {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
          }

          #saved-asset-invoice-print th,
          #saved-asset-invoice-print td {
            padding: 6px 4px;
            overflow-wrap: anywhere;
          }

          #saved-asset-invoice-print tr {
            break-inside: avoid;
          }

          #saved-asset-invoice-print img {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
