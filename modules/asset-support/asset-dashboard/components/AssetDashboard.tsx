"use client";

import {
  useEffect,
  useState,
} from "react";
import {
    getSavedAssetInvoicesPaginated,
  getSavedAssetInvoiceFilterOptions,
  SavedAssetInvoice,
  SavedAssetInvoiceFilterOption,
} from "@/modules/asset-support/invoices/services/invoice-service";
import { createClient } from "@/lib/supabase/client";

import InvoicePreviewModal from
  "@/modules/asset-support/invoices/components/InvoicePreviewModal";
import SavedAssetInvoiceDetail from
  "@/modules/asset-support/invoices/components/SavedAssetInvoiceDetail";
import {
  getAdminCompanyId,
} from "@/lib/auth/company-permission";

import {
  getAssetDashboardSummary,
  getAssetDashboardByCompany,
  getAssetDashboardByFamily,
  getAssetDashboardLoanedAssets,
  AssetDashboardSummary,
  AssetDashboardCompany,
  AssetDashboardType,
  AssetDashboardLoanedAsset,
  AssetDashboardLoanPricing,
    getAssetDashboardLoanPricings,
} from "../services/asset-dashboard-service";

export default function AssetDashboard() {

    const supabase =
    createClient();

  const [
    summary,
    setSummary,
  ] = useState<AssetDashboardSummary | null>(
    null
  );

  const [
    companies,
    setCompanies,
  ] = useState<AssetDashboardCompany[]>(
    []
  );

  const [
    families,
    setFamilies,
  ] = useState<AssetDashboardType[]>(
    []
  );

  const [
    loanedAssets,
    setLoanedAssets,
  ] = useState<AssetDashboardLoanedAsset[]>(
    []
  );

const [loanPricings, setLoanPricings] =
  useState<AssetDashboardLoanPricing[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [savedInvoices, setSavedInvoices] =
  useState<SavedAssetInvoice[]>([]);

const [invoiceTotal, setInvoiceTotal] = useState(0);

const [invoicePage, setInvoicePage] = useState(1);

const [invoicePageSize, setInvoicePageSize] = useState(10);

const [invoiceFilterOptions, setInvoiceFilterOptions] =
  useState<SavedAssetInvoiceFilterOption[]>([]);

const invoiceTotalPages = Math.max(
  1,
  Math.ceil(invoiceTotal / invoicePageSize)
);

  // Filter riwayat invoice
const [invoiceSearch, setInvoiceSearch] =
  useState("");

const [invoiceStatusFilter, setInvoiceStatusFilter] =
  useState("ALL");

const [invoiceMonthFilter, setInvoiceMonthFilter] =
  useState("ALL");

const [invoiceYearFilter, setInvoiceYearFilter] =
  useState("ALL");

const [invoiceCompanyFilter, setInvoiceCompanyFilter] =
  useState("ALL");

const [invoiceListLoading, setInvoiceListLoading] =
  useState(false);

const [invoiceListError, setInvoiceListError] =
  useState<string | null>(null);

  const [
  role,
  setRole,
] = useState<string | null>(null);

  const [
  userCompanyId,
  setUserCompanyId,
] = useState<number | null>(null);

const [
  selectedCompanyId,
  setSelectedCompanyId,
] = useState<number | null>(null);

const [
  invoiceTarget,
  setInvoiceTarget,
] = useState<{
  ownerCompanyId: number;
  ownerCompanyName: string;
  borrowerCompanyId: number;
  borrowerCompanyName: string;
} | null>(null);

const [selectedSavedInvoiceId, setSelectedSavedInvoiceId] =
  useState<number | null>(null);

async function loadLoanPricings(
  loanData: AssetDashboardLoanedAsset[]
) {

  const uniquePairs =
    new Map<
      string,
      {
        ownerCompanyId: number;
        borrowerCompanyId: number;
      }
    >();

  for (const loan of loanData) {

    const key =
      `${loan.owner_company_id}-${loan.borrower_company_id}`;

    if (!uniquePairs.has(key)) {

      uniquePairs.set(
        key,
        {
          ownerCompanyId:
            loan.owner_company_id,

          borrowerCompanyId:
            loan.borrower_company_id,
        }
      );

    }

  }

  const pricingResults =
    await Promise.all(

      Array.from(
        uniquePairs.values()
      ).map(
        (pair) =>
          getAssetDashboardLoanPricings(
            pair.ownerCompanyId,
            pair.borrowerCompanyId
          )
      )

    );

  setLoanPricings(
    pricingResults.flat()
  );

}

useEffect(() => {

  async function loadDashboard() {

    try {

      setLoading(true);

      // =========================
      // AMBIL USER
      // =========================

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {

        return;

      }

      // =========================
      // AMBIL PROFILE
      // =========================

      const {
        data: profile,
        error: profileError,
      } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

      if (profileError) {

        throw profileError;

      }

      const currentRole =
        profile.role;

      setRole(
        currentRole
      );

      // =========================
      // TENTUKAN COMPANY USER
      // =========================

      const currentCompanyId =
        getAdminCompanyId(
          currentRole
        );

      setUserCompanyId(
        currentCompanyId
      );

      // =========================
      // COMPANY AWAL DASHBOARD
      // =========================

      setSelectedCompanyId(
        currentCompanyId
      );

      // =========================
      // AMBIL DASHBOARD
      // =========================

      const [
        summaryData,
        companyData,
        familyData,
        loanData,
      ] =
        await Promise.all([

          getAssetDashboardSummary(
            currentCompanyId
          ),

          getAssetDashboardByCompany(
            currentCompanyId
          ),

          getAssetDashboardByFamily(
            currentCompanyId
          ),

          getAssetDashboardLoanedAssets(
            currentCompanyId
          ),

        ]);

      setSummary(
        summaryData
      );

      setCompanies(
        companyData
      );

      setFamilies(
        familyData
      );
      console.log(
        "FAMILY DASHBOARD:",
        familyData
      );

      setLoanedAssets(
        loanData
      );

      await loadLoanPricings(
        loanData
      );

    } catch (error) {

      console.error(
        "Gagal mengambil data dashboard asset:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  loadDashboard();

}, []);

useEffect(() => {

  async function reloadDashboard() {

    try {

      setLoading(true);

      const [
        summaryData,
        companyData,
        familyData,
        loanData,
      ] =
        await Promise.all([

          getAssetDashboardSummary(
            selectedCompanyId
          ),

          getAssetDashboardByCompany(
            selectedCompanyId
          ),

          getAssetDashboardByFamily(
            selectedCompanyId
          ),

         getAssetDashboardLoanedAssets(
            selectedCompanyId
          ),

        ]);

      setSummary(
        summaryData
      );

      setCompanies(
        companyData
      );

      setFamilies(
        familyData
      );

      setLoanedAssets(
        loanData
      );

      await loadLoanPricings(
        loanData
      );

    } catch (error) {

      console.error(
        "Gagal memperbarui dashboard asset:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  console.log(
  "LOAN PRICINGS:",
  loanPricings
);
  // Jangan reload sebelum
  // company awal selesai ditentukan

  if (role === null) {

    return;

  }

  reloadDashboard();

}, [
  selectedCompanyId,
  role,
]);

useEffect(() => {
  if (role === null) return;

  loadSavedInvoices();
}, [
  selectedCompanyId,
  role,
  invoicePage,
  invoicePageSize,
  invoiceSearch,
  invoiceStatusFilter,
  invoiceMonthFilter,
  invoiceYearFilter,
  invoiceCompanyFilter,
]);

useEffect(() => {
  if (role === null) return;

  async function loadInvoiceFilterOptions() {
    try {
      const options = await getSavedAssetInvoiceFilterOptions(
        selectedCompanyId
      );

      setInvoiceFilterOptions(options);
    } catch (error) {
      console.error(
        "Gagal mengambil pilihan filter invoice:",
        error
      );
    }
  }

  loadInvoiceFilterOptions();
}, [selectedCompanyId, role]);


  if (loading) {

    return (
      <div
        className="
          rounded-2xl
          border
          bg-white
          p-6
          text-sm
          text-gray-500
        "
      >
        Memuat dashboard asset...
      </div>
    );

  }

async function loadSavedInvoices() {
  try {
    setInvoiceListLoading(true);
    setInvoiceListError(null);

    const result = await getSavedAssetInvoicesPaginated({
      page: invoicePage,
      pageSize: invoicePageSize,
      companyId: selectedCompanyId,
      search: invoiceSearch,
      status: invoiceStatusFilter,
      month: invoiceMonthFilter,
      year: invoiceYearFilter,
      invoiceCompany: invoiceCompanyFilter,
    });

    setSavedInvoices(result.data);
    setInvoiceTotal(result.count);
  } catch (error) {
    console.error(
      "Gagal mengambil invoice tersimpan:",
      error
    );

    setInvoiceListError(
      error instanceof Error
        ? error.message
        : "Gagal mengambil daftar invoice."
    );

    setSavedInvoices([]);
    setInvoiceTotal(0);
  } finally {
    setInvoiceListLoading(false);
  }
}
// =====================================================
// FILTER DAN PENCARIAN INVOICE
// =====================================================

// =====================================================
// OPSI FILTER INVOICE
// =====================================================

const invoiceStatuses = Array.from(
  new Set(
    invoiceFilterOptions.map((invoice) => invoice.status)
  )
).sort();

const invoiceYears = Array.from(
  new Set(
    invoiceFilterOptions.map((invoice) =>
      String(invoice.period_year)
    )
  )
).sort((a, b) => Number(b) - Number(a));

const invoiceCompanies = new Map<number, string>();

invoiceFilterOptions.forEach((invoice) => {
  invoiceCompanies.set(
    invoice.issuer_company_id,
    invoice.issuer_name
  );

  invoiceCompanies.set(
    invoice.buyer_company_id,
    invoice.buyer_name
  );
});
savedInvoices.forEach((invoice) => {
  invoiceCompanies.set(
    invoice.issuer_company_id,
    invoice.issuer_name
  );

  invoiceCompanies.set(
    invoice.buyer_company_id,
    invoice.buyer_name
  );
});


  return (

    <div className="space-y-5">


        {/* =========================
            FILTER PT
        ========================= */}

        {role === "it_admin" && (
          <div className="flex items-center gap-3">

            <label className="text-sm font-medium">
              Pilih PT
            </label>

            <select
              value={selectedCompanyId ?? ""}
              onChange={(e) => {

                const value =
                  e.target.value;

              setSelectedCompanyId(
              value === ""
                ? null
                : Number(value)
            );

            setInvoicePage(1);

              }}
              className="
                h-10
                rounded-xl
                border
                bg-white
                px-4
                text-sm
                outline-none
                focus:border-black
              "
            >

              <option value="">
                Semua PT
              </option>

              <option value="7">
                Numiteg
              </option>

              <option value="8">
                Bekami
              </option>

              <option value="9">
                Briza
              </option>

              <option value="10">
                Aswa
              </option>

              <option value="11">
                Blueheron
              </option>

            </select>

          </div>
        )}


      {/* SUMMARY */}

      <div
        className="
          grid
          grid-cols-2
          gap-4
          lg:grid-cols-4
        "
      >

        <div
          className="
            rounded-2xl
            border
            bg-white
            p-5
            shadow-sm
          "
        >

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Total Asset
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
            "
          >
            {summary?.total ?? 0}
          </p>

        </div>

        <div
          className="
            rounded-2xl
            border
            bg-white
            p-5
            shadow-sm
          "
        >

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Available
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
            "
          >
            {summary?.available ?? 0}
          </p>

        </div>

        <div
          className="
            rounded-2xl
            border
            bg-white
            p-5
            shadow-sm
          "
        >

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Dipinjam
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
            "
          >
            {summary?.loaned ?? 0}
          </p>

        </div>

        <div
          className="
            rounded-2xl
            border
            bg-white
            p-5
            shadow-sm
          "
        >

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Hilang
          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
            "
          >
            {summary?.lost ?? 0}
          </p>

        </div>

      </div>


      {/* FAMILY */}

      <div
        className="
          rounded-2xl
          border
          bg-white
          p-5
          shadow-sm
        "
      >

        <h2
          className="
            text-lg
            font-semibold
          "
        >
          Asset per Family
        </h2>

        <div
          className="
            mt-4
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          {families.length === 0 ? (

            <p
              className="
                text-sm
                text-gray-500
              "
            >
              Belum ada data.
            </p>

          ) : (

            families.map(
              (family) => (

                <div
                  key={
                    family.family_code
                  }
                  className="
                    rounded-xl
                    border
                    p-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        font-semibold
                      "
                    >
                     {family.family_name}
                    </span>

                    <span
                      className="
                        text-xl
                        font-bold
                      "
                    >
                      {family.total}
                    </span>

                  </div>

                

                </div>

              )
            )

          )}

        </div>
        {invoiceTarget && (
          <InvoicePreviewModal
            ownerCompanyId={invoiceTarget.ownerCompanyId}
            ownerCompanyName={invoiceTarget.ownerCompanyName}
            borrowerCompanyId={invoiceTarget.borrowerCompanyId}
            borrowerCompanyName={invoiceTarget.borrowerCompanyName}
            onClose={() => setInvoiceTarget(null)}
          />
        )}
        {selectedSavedInvoiceId !== null && (
          <SavedAssetInvoiceDetail
            invoiceId={selectedSavedInvoiceId}
            onClose={() => setSelectedSavedInvoiceId(null)}
          />
        )}
      </div>


{/* INVOICE TERSIMPAN */}
<div className="rounded-2xl border bg-white p-5 shadow-sm">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-lg font-semibold">
        Invoice Asset Tersimpan
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Daftar invoice yang sudah berhasil disimpan.
      </p>
    </div>

    <button
      type="button"
      onClick={loadSavedInvoices}
      disabled={invoiceListLoading}
      className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
    >
      {invoiceListLoading ? "Memuat..." : "Refresh"}
    </button>
  </div>

  {invoiceListError && (
    <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
      {invoiceListError}
    </p>
  )}

  {/* FILTER RIWAYAT INVOICE */}
<div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

  {/* PENCARIAN */}
  <input
    type="text"
    value={invoiceSearch}
   onChange={(e) => {
  setInvoiceSearch(e.target.value);
  setInvoicePage(1);
}}
    placeholder="Cari nomor invoice atau nama PT..."
    className="h-11 min-w-0 rounded-xl border px-4 text-sm outline-none focus:border-black"
  />

  {/* FILTER PT */}
  <select
    value={invoiceCompanyFilter}
    onChange={(e) => setInvoiceCompanyFilter(e.target.value)}
    className="h-11 min-w-0 rounded-xl border bg-white px-3 text-sm outline-none focus:border-black"
  >
    <option value="ALL">Semua PT</option>

    {Array.from(invoiceCompanies.entries()).map(
      ([companyId, companyName]) => (
        <option key={companyId} value={String(companyId)}>
          {companyName}
        </option>
      )
    )}
  </select>

  {/* FILTER STATUS */}
  {/* <select
    value={invoiceStatusFilter}
  onChange={(e) => {
  setInvoiceStatusFilter(e.target.value);
  setInvoicePage(1);
}}
    className="h-11 min-w-0 rounded-xl border bg-white px-3 text-sm outline-none focus:border-black"
  >
    <option value="ALL">Semua Status</option>

    {invoiceStatuses.map((status) => (
      <option key={status} value={status}>
        {status}
      </option>
    ))}
  </select> */}

  {/* FILTER BULAN */}
  <select
    value={invoiceMonthFilter}
    onChange={(e) => setInvoiceMonthFilter(e.target.value)}
    className="h-11 min-w-0 rounded-xl border bg-white px-3 text-sm outline-none focus:border-black"
  >
    <option value="ALL">Semua Bulan</option>
    <option value="1">Januari</option>
    <option value="2">Februari</option>
    <option value="3">Maret</option>
    <option value="4">April</option>
    <option value="5">Mei</option>
    <option value="6">Juni</option>
    <option value="7">Juli</option>
    <option value="8">Agustus</option>
    <option value="9">September</option>
    <option value="10">Oktober</option>
    <option value="11">November</option>
    <option value="12">Desember</option>
  </select>

  {/* FILTER TAHUN */}
  <select
    value={invoiceYearFilter}
    onChange={(e) => setInvoiceYearFilter(e.target.value)}
    className="h-11 min-w-0 rounded-xl border bg-white px-3 text-sm outline-none focus:border-black"
  >
    <option value="ALL">Semua Tahun</option>

    {invoiceYears.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </select>

  {/* RESET FILTER */}
  <button
    type="button"
onClick={() => {
  setInvoiceSearch("");
  setInvoiceStatusFilter("ALL");
  setInvoiceMonthFilter("ALL");
  setInvoiceYearFilter("ALL");
  setInvoiceCompanyFilter("ALL");
  setInvoicePage(1);
}}
    className="h-11 rounded-xl border px-4 text-sm font-medium hover:bg-gray-50"
  >
    Reset Filter
  </button>

</div>

<p className="mt-3 text-sm text-gray-500">
  Menampilkan{" "}
  {invoiceTotal === 0
    ? 0
    : (invoicePage - 1) * invoicePageSize + 1}
  {"–"}
  {Math.min(invoicePage * invoicePageSize, invoiceTotal)}
  {" dari "}
  {invoiceTotal} invoice.
</p>

  {invoiceListLoading ? (
    <p className="mt-4 text-sm text-gray-500">
      Memuat daftar invoice...
    </p>
) : invoiceTotal === 0 ? (
  <p className="mt-4 text-sm text-gray-500">
    Belum ada invoice tersimpan.
  </p>
) : savedInvoices.length === 0 ? (
  <p className="mt-4 rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
    Tidak ada invoice yang cocok dengan pencarian atau filter.
  </p>
) : (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-212.5 text-left text-sm">
        <thead>
          <tr className="border-b text-gray-500">
            <th className="px-3 py-3">Nomor Invoice</th>
            <th className="px-3 py-3">Penerbit</th>
            <th className="px-3 py-3">Penerima</th>
            <th className="px-3 py-3">Periode</th>
            <th className="px-3 py-3">Jatuh Tempo</th>
            <th className="px-3 py-3 text-right">Total</th>
            {/* <th className="px-3 py-3">Status</th> */}
            <th className="px-3 py-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
        {savedInvoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="border-b last:border-0"
            >
              <td className="px-3 py-3 font-medium">
                {invoice.invoice_no}
              </td>

              <td className="px-3 py-3">
                {invoice.issuer_name}
              </td>

              <td className="px-3 py-3">
                {invoice.buyer_name}
              </td>

              <td className="px-3 py-3">
                {String(invoice.period_month).padStart(2, "0")}
                /{invoice.period_year}
              </td>

              <td className="px-3 py-3">
                {invoice.due_date}
              </td>

              <td className="px-3 py-3 text-right whitespace-nowrap">
                Rp{" "}
                {invoice.total.toLocaleString("id-ID")}
              </td>

              {/* <td className="px-3 py-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                  {invoice.status}
                </span>
              </td> */}
              <td className="px-3 py-3">
              <button
                type="button"
                onClick={() => setSelectedSavedInvoiceId(invoice.id)}
                className="rounded-lg bg-black px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
              >
                Detail / PDF
              </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
  
  {/* PAGINATION INVOICE */}
  {invoiceTotal > 0 && (
    <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Data per halaman:</span>

        <select
          value={invoicePageSize}
          onChange={(e) => {
            setInvoicePageSize(Number(e.target.value));
            setInvoicePage(1);
          }}
          className="h-9 rounded-lg border bg-white px-2"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={invoicePage <= 1 || invoiceListLoading}
          onClick={() => {
            setInvoicePage((page) => Math.max(1, page - 1));
          }}
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sebelumnya
        </button>

        <span className="px-2 text-sm text-gray-600">
          Halaman {invoicePage} dari {invoiceTotalPages}
        </span>

        <button
          type="button"
          disabled={
            invoicePage >= invoiceTotalPages ||
            invoiceListLoading
          }
          onClick={() => {
            setInvoicePage((page) =>
              Math.min(invoiceTotalPages, page + 1)
            );
          }}
          className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Berikutnya
        </button>
      </div>
    </div>
  )}

</div>


    {/* LOANED BETWEEN COMPANIES */}

<div
  className="
    rounded-2xl
    border
    bg-white
    p-5
    shadow-sm
  "
>

  <h2
    className="
      text-lg
      font-semibold
    "
  >
    Asset Dipinjam Antar PT
  </h2>

  <div className="mt-4 space-y-3">

    {loanedAssets.length === 0 ? (

      <p
        className="
          text-sm
          text-gray-500
        "
      >
        Tidak ada asset yang
        sedang dipinjam antar PT.
      </p>

    ) : (

      Object.values(
        loanedAssets.reduce(
          (
            groups,
            item
          ) => {

            const key =
              `${item.owner_company_id}-${item.borrower_company_id}`;

            if (!groups[key]) {

              groups[key] = {
                owner_company_id:
                  item.owner_company_id,

                owner_company_name:
                  item.owner_company_name,

                borrower_company_id:
                  item.borrower_company_id,

                borrower_company_name:
                  item.borrower_company_name,

                families: [],

              };

            }

            groups[key].families.push(
              item
            );

            return groups;

          },
          {} as Record<
            string,
            {
              owner_company_id: number;
              owner_company_name: string;
              borrower_company_id: number;
              borrower_company_name: string;
              families: AssetDashboardLoanedAsset[];
            }
          >
        )
      ).map(
        (group) => (

          <div
            key={`
              ${group.owner_company_id}-
              ${group.borrower_company_id}
            `}
            className="
              rounded-xl
              border
              p-4
            "
          >

            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-3
              "
            >


              <p
                className="
                  font-semibold
                "
              >
                {
                  group.owner_company_name
                }

                {" → "}

                {
                  group.borrower_company_name
                }
              </p>

              
              {/* button invoice */}

            <button
              type="button"
              onClick={() =>
                setInvoiceTarget({
                  ownerCompanyId: group.owner_company_id,
                  ownerCompanyName: group.owner_company_name,
                  borrowerCompanyId: group.borrower_company_id,
                  borrowerCompanyName: group.borrower_company_name,
                })
              }
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Preview Invoice
            </button>

            </div>
            

            {/* FAMILY */}

            <div
              className="
                mt-3
                space-y-2
              "
            >

         {group.families.map((family) => {

  const pricing =
    loanPricings.find(
      (item) =>
        item.owner_company_id ===
          group.owner_company_id &&
        item.borrower_company_id ===
          group.borrower_company_id &&
        item.family_code ===
          family.family_code
    );

  const monthlyPrice =
    pricing?.monthly_price ?? 0;

  const subtotal =
    family.total * monthlyPrice;

  return (
    <div
      key={family.family_code}
      className="
        rounded-lg
        bg-gray-50
        px-3
        py-3
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <span className="text-sm font-medium">
          Family {family.family_code}
        </span>

        <span className="font-semibold">
          {family.total}
        </span>

      </div>

      <div
        className="
          mt-2
          flex
          items-center
          justify-between
          text-xs
          text-gray-500
        "
      >

        <span>
          Rp{" "}
          {monthlyPrice.toLocaleString("id-ID")}
          {" / asset / bulan"}
        </span>

        <span>
          Subtotal:{" "}
          <span className="font-semibold text-gray-700">
            Rp{" "}
            {subtotal.toLocaleString("id-ID")}
          </span>
        </span>

      </div>

    </div>
  );
})}

            </div>

            {/* TOTAL */}

           <div
            className="
              mt-3
              space-y-2
              border-t
              pt-3
            "
                >

        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <span className="text-sm font-medium text-gray-500">
            Total Asset
          </span>

          <span className="font-bold">
            {group.families.reduce(
              (total, family) =>
                total + family.total,
              0
            )}
          </span>
        </div>

        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <span className="text-sm font-medium text-gray-500">
            Total Tagihan / Bulan
          </span>

          <span className="text-base font-bold">
            Rp{" "}
            {group.families.reduce(
              (total, family) => {

                const pricing =
                  loanPricings.find(
                    (item) =>
                      item.owner_company_id ===
                        group.owner_company_id &&
                      item.borrower_company_id ===
                        group.borrower_company_id &&
                      item.family_code ===
                        family.family_code
                  );

                const monthlyPrice =
                  pricing?.monthly_price ?? 0;

                return (
                  total +
                  family.total *
                    monthlyPrice
                );
              },
              0
            ).toLocaleString("id-ID")}
          </span>
        </div>

      </div>

          </div>

        )
      )

    )}

  </div>

</div>

    </div>

  );
}