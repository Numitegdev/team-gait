import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function generateAssetCode(
  companyId: number,
  modelId: number
): Promise<string> {

  // =========================
  // 1. Ambil family code model
  // =========================

  const {
    data: model,
    error: modelError,
  } = await supabase
    .from("asset_models")
    .select("family_code")
    .eq("id", modelId)
    .single();

  if (modelError)
    throw modelError;

  if (!model?.family_code) {

    throw new Error(
      "Family code untuk model asset belum tersedia."
    );

  }

  const familyCode =
    model.family_code;


  // =========================
  // 2. Ambil prefix company
  // =========================

  const {
    data: company,
    error: companyError,
  } = await supabase
    .from("companies")
    .select("asset_code_prefix")
    .eq("id", companyId)
    .single();

  if (companyError)
    throw companyError;

  if (!company?.asset_code_prefix) {

    throw new Error(
      "Asset code prefix untuk company belum tersedia."
    );

  }

  const companyPrefix =
    company.asset_code_prefix;


  // =========================
  // 3. Ambil SEMUA asset
  // milik company tersebut
  //
  // Jangan filter is_active.
  // Asset inactive tetap dihitung.
  // =========================

  const {
    data: assets,
    error: assetError,
  } = await supabase
    .from("assets")
    .select(`
      asset_code,
      model_id
    `)
    .eq(
      "company_id",
      companyId
    );

  if (assetError)
    throw assetError;


  // =========================
  // 4. Ambil family code
  // dari model-model asset
  // yang sudah dimiliki company
  // =========================

  const modelIds = [
    ...new Set(
      (assets ?? [])
        .map(
          (asset) =>
            asset.model_id
        )
        .filter(Boolean)
    ),
  ];


  let existingModels: {
    id: number;
    family_code: string;
  }[] = [];


  if (modelIds.length > 0) {

    const {
      data,
      error,
    } = await supabase
      .from("asset_models")
      .select(`
        id,
        family_code
      `)
      .in(
        "id",
        modelIds
      );

    if (error)
      throw error;

    existingModels =
      data ?? [];

  }


  // =========================
  // 5. Cari nomor terbesar
  // untuk family yang sama
  // =========================

  let lastNumber = 0;


  for (const asset of assets ?? []) {

    const assetModel =
      existingModels.find(
        (model) =>
          model.id ===
          asset.model_id
      );

    if (!assetModel)
      continue;


    // Model berbeda tidak masalah.
    // Yang penting family code sama.

    if (
      assetModel.family_code !==
      familyCode
    ) {

      continue;

    }


    const assetCode =
      asset.asset_code;

    if (!assetCode)
      continue;


    const parts =
      assetCode.split("-");


    // Format minimal:
    //
    // 91-001-10-26
    //  ^   ^   ^
    // family
    // nomor
    // company
    //


    if (
      parts.length < 4
    ) {

      continue;

    }


    // Pastikan family sama
    if (
      parts[0] !==
      familyCode
    ) {

      continue;

    }


    // Pastikan company prefix sama
    if (
      parts[2] !==
      companyPrefix
    ) {

      continue;

    }


    const currentNumber =
      Number(parts[1]);


    if (
      Number.isInteger(
        currentNumber
      ) &&
      currentNumber > lastNumber
    ) {

      lastNumber =
        currentNumber;

    }

  }


  // =========================
  // 6. Nomor berikutnya
  // =========================

  const nextNumber =
    String(
      lastNumber + 1
    ).padStart(3, "0");


  // =========================
  // 7. Tahun sekarang
  // =========================

  const year =
    new Date()
      .getFullYear()
      .toString()
      .slice(-2);


  // =========================
  // 8. Generate final code
  // =========================

  return `${familyCode}-${nextNumber}-${companyPrefix}-${year}`;
}