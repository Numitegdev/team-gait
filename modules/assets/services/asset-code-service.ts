import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

  
export async function generateAssetCode(

  companyId: number,

  modelId: number

): Promise<string> {

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


const year =

  new Date()

    .getFullYear()

    .toString()

    .slice(-2);

    const searchPrefix =

  `${model.family_code}-`;


  const {

  data: assets,

  error: assetError,

} = await supabase

  .from("assets")

  .select("asset_code")

  .like(

    "asset_code",

    `${model.family_code}-%-${company.asset_code_prefix}-${year}`

  );
  if (assetError)
  throw assetError;

  let lastNumber = 0;

assets?.forEach((asset) => {

  const parts =
    asset.asset_code.split("-");

  const current =

    Number(parts[1]);

  if (
    current > lastNumber
  ) {

    lastNumber =
      current;

  }

});


const nextNumber =

  String(lastNumber + 1)

    .padStart(3, "0");

  return `${

  model.family_code

}-${

  nextNumber

}-${

  company.asset_code_prefix

}-${

  year

}`;

}

