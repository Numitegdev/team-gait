import { createClient } from "@/lib/supabase/client";

const supabase = createClient();


// =====================================================
// TYPES
// =====================================================

export interface InvoiceCompanyInfo {
  companyId: number;
  legalName: string;
  address: string;
  logoUrl: string | null;
  headerImageUrl: string | null;

  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;

  signerName: string | null;
  signerPosition: string | null;
  signatureImageUrl: string | null;
}

export interface InvoiceAssetItem {
  familyCode: string;
  familyName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoicePreview {
  invoiceType: "ASSET";

  issuerCompanyId: number;
  buyerCompanyId: number;
  
  issuerCompany: InvoiceCompanyInfo;
  buyerCompany: InvoiceCompanyInfo;

  invoiceDate: string;
  dueDate: string;

  periodMonth: number;
  periodYear: number;

  items: InvoiceAssetItem[];

  subtotal: number;
  ppn: number;
  pph23: number;
  total: number;
  

}


// =====================================================
// DATE HELPERS
// =====================================================

function pad2(
  value: number
) {
  return String(value).padStart(
    2,
    "0"
  );
}


function formatDate(
  date: Date
) {
  return (
    date.getFullYear() +
    "-" +
    pad2(
      date.getMonth() + 1
    ) +
    "-" +
    pad2(
      date.getDate()
    )
  );
}


/**
 * Invoice selalu tanggal 25.
 */
function getInvoiceDate(
  month: number,
  year: number
) {

  return (
    `${year}-${pad2(month)}-25`
  );

}


/**
 * Due date = invoice date + 4 hari.
 */
function getDueDate(
  month: number,
  year: number
) {

  const date =
    new Date(
      year,
      month - 1,
      25
    );

  date.setDate(
    date.getDate() + 4
  );

  return formatDate(
    date
  );

}


/**
 * Ambil jumlah hari antara
 * dua tanggal DATE.
 *
 * Contoh:
 *
 * 26 Okt -> 1 Nov
 * = 6 hari
 */
function getDurationDays(
  startDate: string,
  endDate: string
) {

  const start =
    new Date(
      `${startDate}T00:00:00`
    );

  const end =
    new Date(
      `${endDate}T00:00:00`
    );

  const difference =
    end.getTime() -
    start.getTime();

  return Math.floor(
    difference /
      (
        1000 *
        60 *
        60 *
        24
      )
  );

}


/**
 * Mendapatkan tanggal akhir
 * aktual loan.
 *
 * RETURNED
 * -> returned_at
 *
 * ACTIVE dengan end_date
 * -> end_date
 *
 * ACTIVE tanpa end_date
 * -> null
 */
function getLoanEndDate(
  loan: {
    status: string;
    end_date: string | null;
    returned_at: string | null;
  }
) {

  if (
    loan.status ===
      "RETURNED" &&
    loan.returned_at
  ) {

    return loan
      .returned_at
      .slice(0, 10);

  }

  if (
    loan.end_date
  ) {

    return loan.end_date;

  }

  return null;

}


// =====================================================
// CEK FRIENDSHIP LOAN
// =====================================================

/**
 * Loan kurang dari 7 hari
 * tidak pernah ditagihkan.
 */
export function isFriendshipLoan(
  loan: {
    start_date: string;
    end_date: string | null;
    returned_at: string | null;
  }
) {

  const endDate =
    loan.returned_at
      ? loan.returned_at.slice(
          0,
          10
        )
      : loan.end_date;

  /**
   * Belum dikembalikan
   * dan tidak punya end_date.
   *
   * Berarti masih berjalan.
   */
  if (!endDate) {

    return false;

  }

  const duration =
    getDurationDays(
      loan.start_date,
      endDate
    );

  return duration < 7;

}


// =====================================================
// TENTUKAN BULAN INVOICE PERTAMA
// =====================================================

/**
 * Menentukan invoice pertama
 * berdasarkan tanggal mulai.
 *
 * Tanggal 2 - 25
 * -> bulan yang sama
 *
 * Tanggal 26 - akhir bulan
 * -> bulan berikutnya
 *
 * Tanggal 1
 * -> bulan tersebut
 */
export function getFirstInvoicePeriod(
  startDate: string
) {

  const date =
    new Date(
      `${startDate}T00:00:00`
    );

  const day =
    date.getDate();

  let month =
    date.getMonth() + 1;

  let year =
    date.getFullYear();


  /**
   * Tanggal 26 sampai akhir bulan
   * masuk invoice bulan berikutnya.
   */
  if (
    day >= 26
  ) {

    month += 1;

    if (
      month > 12
    ) {

      month = 1;
      year += 1;

    }

  }


  return {
    month,
    year,
  };

}


// =====================================================
// CEK LOAN MASUK INVOICE
// =====================================================

export function isLoanBillableForInvoice(
  loan: {
    status: string;
    start_date: string;
    end_date: string | null;
    returned_at: string | null;
  },
  invoiceMonth: number,
  invoiceYear: number
) {

  /**
   * Friendship loan tidak pernah ditagihkan.
   */
  if (
    isFriendshipLoan(
      loan
    )
  ) {

    return false;

  }


  /**
   * Tentukan invoice pertama.
   */
  const firstInvoice =
    getFirstInvoicePeriod(
      loan.start_date
    );


  /**
   * Kalau ini invoice pertama,
   * langsung masuk selama loan
   * bukan friendship.
   */
  if (
    firstInvoice.month ===
      invoiceMonth &&
    firstInvoice.year ===
      invoiceYear
  ) {

    return true;

  }


  /**
   * Untuk invoice bulan berikutnya,
   * hanya loan yang masih aktif
   * pada tanggal 25 yang ditagihkan.
   */
  const invoiceDate =
    getInvoiceDate(
      invoiceMonth,
      invoiceYear
    );


  /**
   * Kalau loan baru dimulai
   * setelah tanggal invoice,
   * belum masuk invoice ini.
   */
  if (
    loan.start_date >
    invoiceDate
  ) {

    return false;

  }


  /**
   * Kalau RETURNED sebelum
   * invoice berikutnya,
   * jangan ditagihkan lagi.
   */
  if (
    loan.status ===
      "RETURNED"
  ) {

    if (
      loan.returned_at
    ) {

      const returnedDate =
        loan.returned_at.slice(
          0,
          10
        );

      if (
        returnedDate <
        invoiceDate
      ) {

        return false;

      }

    }

  }


  /**
   * Kalau ACTIVE dengan end_date
   * sebelum tanggal invoice,
   * berarti sudah selesai sebelum
   * invoice berikutnya.
   */
  if (
    loan.status ===
      "ACTIVE" &&
    loan.end_date &&
    loan.end_date <
      invoiceDate
  ) {

    return false;

  }


  /**
   * Masih menjadi loan
   * pada tanggal 25.
   */
  return true;

}


// =====================================================
// GET INVOICE PREVIEW
// =====================================================

export async function getInvoicePreview(

  ownerCompanyId: number,

  borrowerCompanyId: number,

  month: number,

  year: number

): Promise<InvoicePreview> {


  // ===================================================
  // VALIDATION
  // ===================================================

  if (
    ownerCompanyId ===
    borrowerCompanyId
  ) {

    throw new Error(
      "Owner dan borrower tidak boleh sama."
    );

  }


  if (
    month < 1 ||
    month > 12
  ) {

    throw new Error(
      "Bulan invoice tidak valid."
    );

  }


  if (
    year < 2000
  ) {

    throw new Error(
      "Tahun invoice tidak valid."
    );

  }


  // ===================================================
  // GET COMPANY SETTINGS
  // ===================================================

  const {
    data: companySettings,
    error: companySettingsError,
  } = await supabase
    .from("invoice_company_settings")
  .select(`
  company_id,
  legal_name,
  address,
  logo_url,
  header_image_url,
  bank_name,
  bank_account_name,
  bank_account_number,
  signer_name,
  signer_position,
  signature_image_url
`)
    .in("company_id", [
      ownerCompanyId,
      borrowerCompanyId,
    ])
    .eq("is_active", true);

  if (companySettingsError) {
    throw companySettingsError;
  }

  const issuerSettings = (companySettings ?? []).find(
    (company) =>
      Number(company.company_id) === ownerCompanyId
  );

  const buyerSettings = (companySettings ?? []).find(
    (company) =>
      Number(company.company_id) === borrowerCompanyId
  );

  if (!issuerSettings) {
    throw new Error(
      "Settings invoice perusahaan pemilik belum tersedia."
    );
  }

  if (!buyerSettings) {
    throw new Error(
      "Settings invoice perusahaan penerima belum tersedia."
    );
  }

const issuerCompany: InvoiceCompanyInfo = {
  companyId: Number(issuerSettings.company_id),
  legalName: issuerSettings.legal_name,
  address: issuerSettings.address,
  logoUrl: issuerSettings.logo_url,
  headerImageUrl: issuerSettings.header_image_url,

  bankName: issuerSettings.bank_name,
  bankAccountName: issuerSettings.bank_account_name,
  bankAccountNumber: issuerSettings.bank_account_number,

  signerName: issuerSettings.signer_name,
  signerPosition: issuerSettings.signer_position,
  signatureImageUrl: issuerSettings.signature_image_url,
};

const buyerCompany: InvoiceCompanyInfo = {
  companyId: Number(buyerSettings.company_id),
  legalName: buyerSettings.legal_name,
  address: buyerSettings.address,
  logoUrl: buyerSettings.logo_url,
  headerImageUrl: buyerSettings.header_image_url,

  bankName: buyerSettings.bank_name,
  bankAccountName: buyerSettings.bank_account_name,
  bankAccountNumber: buyerSettings.bank_account_number,

  signerName: buyerSettings.signer_name,
  signerPosition: buyerSettings.signer_position,
  signatureImageUrl: buyerSettings.signature_image_url,
};
  // ===================================================
  // INVOICE DATE
  // ===================================================

  const invoiceDate =
    getInvoiceDate(
      month,
      year
    );

  const dueDate =
    getDueDate(
      month,
      year
    );


  // ===================================================
  // GET LOANS
  // ===================================================

  const {
    data: loans,
    error: loanError,
  } =
    await supabase
      .from("asset_loans")
      .select(`
        id,
        asset_id,
        owner_company_id,
        borrower_company_id,
        start_date,
        end_date,
        status,
        returned_at
      `)
      .eq(
        "owner_company_id",
        ownerCompanyId
      )
      .eq(
        "borrower_company_id",
        borrowerCompanyId
      )
      .in(
        "status",
        [
          "ACTIVE",
          "RETURNED",
        ]
      );


  if (
    loanError
  ) {

    throw loanError;

  }


  // ===================================================
  // FILTER LOAN
  // ===================================================

  const billableLoans =
    (
      loans ?? []
    ).filter(
      (loan) =>
        isLoanBillableForInvoice(
          loan,
          month,
          year
        )
    );


  // ===================================================
  // TIDAK ADA LOAN
  // ===================================================

  if (
    billableLoans.length === 0
  ) {

    return {

      invoiceType:
        "ASSET",

      issuerCompanyId:
        ownerCompanyId,

      buyerCompanyId:
        borrowerCompanyId,

              issuerCompany,

      buyerCompany,

      invoiceDate,

      dueDate,

      periodMonth:
        month,

      periodYear:
        year,

      items: [],

      subtotal: 0,

      ppn: 0,

      pph23: 0,

      total: 0,

    };

  }


  // ===================================================
  // GET ASSETS
  // ===================================================

  const assetIds =
    [
      ...new Set(
        billableLoans.map(
          (loan) =>
            loan.asset_id
        )
      ),
    ];


  const {
    data: assets,
    error: assetError,
  } =
    await supabase
      .from("assets")
      .select(`
        id,
        model_id
      `)
      .in(
        "id",
        assetIds
      );


  if (
    assetError
  ) {

    throw assetError;

  }


  const assetMap =
    new Map(
      (
        assets ?? []
      ).map(
        (asset) => [
          asset.id,
          asset,
        ]
      )
    );


  // ===================================================
  // GET MODELS
  // ===================================================

  const modelIds =
    [
      ...new Set(
        (
          assets ?? []
        )
          .map(
            (asset) =>
              asset.model_id
          )
          .filter(Boolean)
      ),
    ];


  const {
    data: models,
    error: modelError,
  } =
    await supabase
      .from("asset_models")
      .select(`
        id,
        family_code
      `)
      .in(
        "id",
        modelIds
      );


  if (
    modelError
  ) {

    throw modelError;

  }


  const modelMap =
    new Map(
      (
        models ?? []
      ).map(
        (model) => [
          model.id,
          model,
        ]
      )
    );


  // ===================================================
  // GET INVOICE FAMILY
  // ===================================================

  const familyCodes =
    [
      ...new Set(
        (
          models ?? []
        )
          .map(
            (model) =>
              model.family_code
          )
          .filter(Boolean)
      ),
    ];


  const {
    data: families,
    error: familyError,
  } =
    await supabase
      .from(
        "invoice_asset_families"
      )
      .select(`
        family_code,
        display_name
      `)
      .in(
        "family_code",
        familyCodes
      )
      .eq(
        "is_active",
        true
      );


  if (
    familyError
  ) {

    throw familyError;

  }


  const familyMap =
    new Map(
      (
        families ?? []
      ).map(
        (family) => [
          family.family_code,
          family.display_name,
        ]
      )
    );


  // ===================================================
  // GET PRICING
  // ===================================================

  const {
    data: pricings,
    error: pricingError,
  } =
    await supabase
      .from(
        "asset_loan_pricings"
      )
      .select(`
        family_code,
        monthly_price
      `)
      .eq(
        "owner_company_id",
        ownerCompanyId
      )
      .eq(
        "borrower_company_id",
        borrowerCompanyId
      )
      .eq(
        "is_active",
        true
      );


  if (
    pricingError
  ) {

    throw pricingError;

  }


  const pricingMap =
    new Map(
      (
        pricings ?? []
      ).map(
        (pricing) => [
          pricing.family_code,
          Number(
            pricing.monthly_price
          ),
        ]
      )
    );


  // ===================================================
  // GROUP FAMILY
  // ===================================================

  const grouped =
    new Map<
      string,
      {
        familyName: string;
        quantity: number;
        unitPrice: number;
      }
    >();


  for (
    const loan
    of billableLoans
  ) {

    const asset =
      assetMap.get(
        loan.asset_id
      );


    if (
      !asset
    ) {

      continue;

    }


    const model =
      modelMap.get(
        asset.model_id
      );


    if (
      !model?.family_code
    ) {

      continue;

    }


    const familyCode =
      model.family_code;


    const familyName =
      familyMap.get(
        familyCode
      );


    if (
      !familyName
    ) {

      throw new Error(
        `Family ${familyCode} belum memiliki nama invoice.`
      );

    }


    const unitPrice =
      pricingMap.get(
        familyCode
      );


    if (
      unitPrice ===
      undefined
    ) {

      throw new Error(
        `Harga invoice untuk Family ${familyCode} belum diatur.`
      );

    }


    const existing =
      grouped.get(
        familyCode
      );


    if (
      existing
    ) {

      existing.quantity +=
        1;

    } else {

      grouped.set(
        familyCode,
        {
          familyName,
          quantity: 1,
          unitPrice,
        }
      );

    }

  }


  // ===================================================
  // BUILD ITEMS
  // ===================================================

  const items =
    Array.from(
      grouped.entries()
    ).map(
      ([
        familyCode,
        data,
      ]) => {

        const total =
          data.quantity *
          data.unitPrice;


        return {

          familyCode,

          familyName:
            data.familyName,

          quantity:
            data.quantity,

          unitPrice:
            data.unitPrice,

          total,

        };

      }
    );


  // ===================================================
  // TOTAL
  // ===================================================

  const subtotal =
    items.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.total,
      0
    );


  const ppn =
    subtotal *
    0.11;


  const pph23 =
    subtotal *
    0.02;


  const total =
    subtotal +
    ppn -
    pph23;



  return {
    invoiceType: "ASSET",

    issuerCompanyId: ownerCompanyId,
    buyerCompanyId: borrowerCompanyId,

    issuerCompany,
    buyerCompany,

    invoiceDate,
    dueDate,

    periodMonth: month,
    periodYear: year,

    items,

    subtotal,
    ppn,
    pph23,
    total,
  };


}


// =====================================================
// CREATE ASSET INVOICE
// =====================================================


export async function createAssetInvoice(
  ownerCompanyId: number,
  borrowerCompanyId: number,
  month: number,
  year: number
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User belum login.");
  }

  // Ambil preview terbaru sebelum menyimpan.
  const preview = await getInvoicePreview(
    ownerCompanyId,
    borrowerCompanyId,
    month,
    year
  );

  if (preview.items.length === 0) {
    throw new Error(
      "Tidak ada asset yang dapat ditagihkan pada invoice ini."
    );
  }

  const { issuerCompany, buyerCompany } = preview;

  // Penyimpanan header dan item dilakukan dalam satu RPC.
  const { data, error } = await supabase.rpc(
    "create_asset_invoice",
    {
      p_issuer_company_id: ownerCompanyId,
      p_buyer_company_id: borrowerCompanyId,
      p_invoice_date: preview.invoiceDate,
      p_due_date: preview.dueDate,
      p_period_month: month,
      p_period_year: year,
      p_issuer_name: issuerCompany.legalName,
      p_issuer_address: issuerCompany.address,
      p_buyer_name: buyerCompany.legalName,
      p_buyer_address: buyerCompany.address,
      p_subtotal: preview.subtotal,
      p_ppn: preview.ppn,
      p_pph23: preview.pph23,
      p_total: preview.total,
      p_items: preview.items.map((item) => ({
        familyCode: item.familyCode,
        familyName: item.familyName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  const result = data as {
    invoice: {
      id: number;
      invoice_no: string;
      status: string;
    };
  };

  if (!result?.invoice?.invoice_no) {
    throw new Error(
      "Invoice tidak berhasil dikonfirmasi oleh database."
    );
  }

  return {
    invoice: result.invoice,
    issuerSettings: issuerCompany,
    buyerSettings: buyerCompany,
    items: preview.items,
  };
}

export interface SavedAssetInvoice {
  id: number;
  invoice_no: string;
  invoice_type: string;
  issuer_company_id: number;
  buyer_company_id: number;
  invoice_date: string;
  due_date: string;
  period_month: number;
  period_year: number;
  issuer_name: string;
  issuer_address: string;
  buyer_name: string;
  buyer_address: string;
  subtotal: number;
  ppn: number;
  pph23: number;
  total: number;
  status: string;
  created_at: string;
}

export async function getSavedAssetInvoices(
  companyId?: number | null
): Promise<SavedAssetInvoice[]> {
  let query = supabase
    .from("invoices")
    .select(`
      id,
      invoice_no,
      invoice_type,
      issuer_company_id,
      buyer_company_id,
      invoice_date,
      due_date,
      period_month,
      period_year,
      issuer_name,
      issuer_address,
      buyer_name,
      buyer_address,
      subtotal,
      ppn,
      pph23,
      total,
      status,
      created_at
    `)
    .eq("invoice_type", "ASSET")
    .order("created_at", { ascending: false });

  if (companyId != null) {
    query = query.or(
      `issuer_company_id.eq.${companyId},buyer_company_id.eq.${companyId}`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Gagal mengambil daftar invoice: ${error.message}`
    );
  }

  return (data ?? []).map((invoice) => ({
    ...invoice,
    id: Number(invoice.id),
    issuer_company_id: Number(invoice.issuer_company_id),
    buyer_company_id: Number(invoice.buyer_company_id),
    period_month: Number(invoice.period_month),
    period_year: Number(invoice.period_year),
    subtotal: Number(invoice.subtotal),
    ppn: Number(invoice.ppn),
    pph23: Number(invoice.pph23),
    total: Number(invoice.total),
  }));
}


export interface SavedAssetInvoiceItem {
  id: number;
  invoice_id: number;
  item_type: string;
  description: string;
  period: string;
  quantity: number;
  unit_price: number;
  total: number;
  asset_family_code: string | null;
  asset_family_name: string | null;
}

export async function getSavedAssetInvoiceDetail(
  invoiceId: number
): Promise<{
  invoice: SavedAssetInvoice;
  items: SavedAssetInvoiceItem[];
}> {
  if (!Number.isInteger(invoiceId) || invoiceId <= 0) {
    throw new Error("ID invoice tidak valid.");
  }

  const {
    data: invoice,
    error: invoiceError,
  } = await supabase
    .from("invoices")
    .select(`
      id,
      invoice_no,
      invoice_type,
      issuer_company_id,
      buyer_company_id,
      invoice_date,
      due_date,
      period_month,
      period_year,
      issuer_name,
      issuer_address,
      buyer_name,
      buyer_address,
      subtotal,
      ppn,
      pph23,
      total,
      status,
      created_at
    `)
    .eq("id", invoiceId)
    .eq("invoice_type", "ASSET")
    .single();

  if (invoiceError || !invoice) {
    throw new Error(
      invoiceError?.message ?? "Invoice tidak ditemukan."
    );
  }

  const {
    data: items,
    error: itemsError,
  } = await supabase
    .from("invoice_items")
    .select(`
      id,
      invoice_id,
      item_type,
      description,
      period,
      quantity,
      unit_price,
      total,
      asset_family_code,
      asset_family_name
    `)
    .eq("invoice_id", invoiceId)
    .order("id", { ascending: true });

  if (itemsError) {
    throw new Error(
      `Gagal mengambil rincian invoice: ${itemsError.message}`
    );
  }

  return {
    invoice: {
      ...invoice,
      id: Number(invoice.id),
      issuer_company_id: Number(invoice.issuer_company_id),
      buyer_company_id: Number(invoice.buyer_company_id),
      period_month: Number(invoice.period_month),
      period_year: Number(invoice.period_year),
      subtotal: Number(invoice.subtotal),
      ppn: Number(invoice.ppn),
      pph23: Number(invoice.pph23),
      total: Number(invoice.total),
    },
    items: (items ?? []).map((item) => ({
      ...item,
      id: Number(item.id),
      invoice_id: Number(item.invoice_id),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      total: Number(item.total),
    })),
  };
}
