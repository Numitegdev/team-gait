"use client";

import { useEffect, useState } from "react";

import AssetForm from "./AssetForm";

import { AssetFormData } from "../types/AssetFormData";

import { defaultAssetForm } from "../utils/default-asset-form";

import { useAssetMaster } from "../hooks/use-asset-master";

import { createAsset , updateAsset } from "../services/asset-service";

import {
  useIPManagement,
} from "../hooks/use-ip-management";

import {
  generateAssetCode,
}
from "../services/asset-code-service";

import {

  useAssets,

} from "../hooks/use-assets";

interface AssetModalProps {

  open: boolean;

  assetId?: number | null;

  onClose: () => void;

  onSuccess: () => void;

}

export default function AssetModal({

  open,

  assetId,

  onClose,

  onSuccess,

}: AssetModalProps) {

  const {

    companies,

    locations,

    categories,

    models,

    conditions,

    statuses,

    loading,

  } = useAssetMaster();

const {

  ips,

  reloadIPs,

} = useIPManagement(

  assetId ?? undefined

);

  const {

  loadAssetDetail,

} = useAssets();

  const [form, setForm] =
    useState<AssetFormData>(
      defaultAssetForm
    );

useEffect(() => {

    

  async function loadDetail() {

    await reloadIPs();
    
    if (!open) {

      setForm(defaultAssetForm);

      return;

    }

    if (!assetId) {

      setForm(defaultAssetForm);

      return;

    }

    try {

      const asset =
        await loadAssetDetail(
          assetId
        );
        

      setForm({

        asset_code:
          asset.asset_code,

        asset_name:
          asset.asset_name,

        company_id:
          asset.company_id,

        location_id:
          asset.location_id,

        category_id:
          asset.category_id,

        model_id:
          asset.model_id,

        brand:
          asset.brand ?? "",

        serial_number:
          asset.serial_number ?? "",

        specification:
          asset.spec_json?.description ?? "",

        condition_id:
          asset.condition_id,

        status_id:
          asset.status_id,

        purchase_date:
          asset.purchase_date ?? "",

        warranty_until:
          asset.warranty_until ?? "",

        purchase_price:
          asset.purchase_price,

        notes:
          asset.notes ?? "",

        ip_management_id:
          asset.ip_management_id,

      });

    } catch (error) {

      console.error(error);

    }

  }

  loadDetail();

}, [

  open,

  assetId,

]);


useEffect(() => {

  async function loadAssetCode() {

     if (assetId) {

    return;

  }
    if (
      !form.company_id ||
      !form.model_id
    ) {
      return;
    }

    const code =
      await generateAssetCode(
        form.company_id,
        form.model_id,
      );

    setForm((prev) => ({

      ...prev,

      asset_code: code,

    }));

  }

  loadAssetCode();

}, [

  assetId,
  
  form.company_id,

  form.model_id,

]);
  

  function handleClose() {

    setForm(
      defaultAssetForm
    );

    onClose();

  }

async function handleSave() {

  try {

    if (!form.asset_name.trim()) {

      alert(
        "Nama Asset wajib diisi."
      );

      return;

    }

    if (!form.company_id) {

      alert(
        "Company wajib dipilih."
      );

      return;

    }

    if (!form.location_id) {

      alert(
        "Location wajib dipilih."
      );

      return;

    }

    if (!form.category_id) {

      alert(
        "Category wajib dipilih."
      );

      return;

    }

    if (!form.model_id) {

      alert(
        "Model wajib dipilih."
      );

      return;

    }

 if (assetId) {

  await updateAsset(

    assetId,

    {

      asset_code:
        form.asset_code,

      asset_name:
        form.asset_name,

      company_id:
        form.company_id,

      location_id:
        form.location_id,

      category_id:
        form.category_id,

      model_id:
        form.model_id,

        ip_management_id: form.ip_management_id,

      brand:
        form.brand || null,

      serial_number:
        form.serial_number || null,

      purchase_date:
        form.purchase_date || null,

      purchase_price:
        form.purchase_price,

      warranty_until:
        form.warranty_until || null,

      condition_id:
        form.condition_id,

      status_id:
        form.status_id,

      notes:
        form.notes || null,

      spec_json: {

        description:
          form.specification,

      },

    }

  );

} else {

  await createAsset({

    asset_code:
      form.asset_code,

    asset_name:
      form.asset_name,

    company_id:
      form.company_id,

    location_id:
      form.location_id,

    category_id:
      form.category_id,

    model_id:
      form.model_id,

      ip_management_id:
  form.ip_management_id,

    brand:
      form.brand || null,

    serial_number:
      form.serial_number || null,

    purchase_date:
      form.purchase_date || null,

    purchase_price:
      form.purchase_price,

    warranty_until:
      form.warranty_until || null,

    condition_id:
      form.condition_id,

    status_id:
      form.status_id,

    notes:
      form.notes || null,

    spec_json: {

      description:
        form.specification,

      },

      

    });

}

  alert(

  assetId

    ? "Asset berhasil diperbarui."

    : "Asset berhasil ditambahkan."

);

    onSuccess();

    handleClose();

} catch (error: any) {

  console.error(error);

  if (error instanceof Error) {

    alert(error.message);

    return;

  }

  alert(
    "Gagal menyimpan asset."
  );

}
}

  if (!open) {

    return null;

  }

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
      "
    >

      <div
        className="
          w-full
          max-w-5xl
          max-h-[90vh]
          overflow-auto
          rounded-2xl
          bg-white
          p-6
          shadow-xl
        "
      >

        {/* Header */}

     <div
          className="
            mb-6
            flex
            items-center
            justify-between
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >

              {assetId
                ? "Edit Asset"
                : "Add Asset"}

            </h2>

            <p
              className="
                text-sm
                text-gray-500
              "
            >

              {assetId
                ? "Ubah informasi asset."
                : "Tambahkan asset baru."}

            </p>

          </div>

          <button

            onClick={handleClose}

            className="
              rounded-lg
              px-3
              py-2
              text-gray-500
              hover:bg-gray-100
            "

          >

            ✕

          </button>

        </div>

        {/* Loading */}

        {loading ? (

          <div
            className="
              py-16
              text-center
            "
          >

            Loading master data...

          </div>

        ) : (

          <AssetForm

            form={form}

            setForm={setForm}

            companies={companies}

            locations={locations}

            categories={categories}

            models={models}

            conditions={conditions}

            statuses={statuses}

            ips={ips}

          />

        )}

        {/* <div>TEST MODAL</div> */}

        {/* Footer */}

        <div
          className="
            mt-8
            flex
            justify-end
            gap-3
          "
        >

          <button

            onClick={handleClose}

            className="
              rounded-xl
              border
              px-5
              py-2
              hover:bg-gray-100
            "

          >

            Cancel

          </button>

          <button

          onClick={handleSave}

          className="
            rounded-xl
            bg-blue-600
            px-5
            py-2
            text-white
            hover:bg-blue-700
          "

        >

         {assetId

            ? "Update Asset"

            : "Save Asset"

          }

        </button>

        </div>

      </div>

    </div>

  );

}