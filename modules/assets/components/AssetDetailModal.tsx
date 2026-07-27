"use client";

import { useEffect, useState } from "react";

import { getAssetById }
from "../services/asset-service";

import { AssetDetail }
from "../types/AssetDetail";

import {

  getAssetHistory,

} from "../services/asset-history-query";

import AssetHistoryTimeline
from "./AssetHistoryTimeline";

import {

  AssetHistoryDetail,

} from "../types/AssetHistoryDetail";

interface AssetDetailModalProps {

  open: boolean;

  assetId: number | null;

  onClose: () => void;

}

export default function AssetDetailModal({

  open,

  assetId,

  onClose,

}: AssetDetailModalProps) {

    function DetailItem({

  label,

  value,

}: {

  label: string;

  value: React.ReactNode;

}) {

  return (

    <div>

      <p
        className="
          text-sm
          text-gray-500
        "
      >

        {label}

      </p>

      <div
        className="
          mt-1
          rounded-xl
          border
          bg-gray-50
          p-3
          font-medium
        "
      >

        {value}

      </div>

    </div>

  );

}

const [

  asset,

  setAsset,

] =
useState<
AssetDetail | null
>(null);


const [

  history,

  setHistory,

] = useState<

  AssetHistoryDetail[]

>([]);

const [
  loading,
  setLoading,
] = useState(false);

async function loadAsset() {

  try {

    setLoading(true);

    const [

      asset,

      histories,

    ] = await Promise.all([

      getAssetById(

        assetId!

      ),

      getAssetHistory(

        assetId!

      ),

    ]);

    setAsset(asset);

    setHistory(histories);

  } finally {

    setLoading(false);

  }

}


useEffect(() => {

  if (!open || !assetId)
    return;

  loadAsset();

}, [

  open,

  assetId,

]);
// console.log(history);

  if (!open)
    return null;

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
        p-1
      "
    >

      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-5xl
          flex-col
          rounded-2xl
          bg-white
          shadow-xl
          p-2
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

            <h2
              className="
                text-2xl
                font-bold
              "
            >

              Asset Detail

            </h2>

            <p
              className="
                text-sm
                text-gray-500
              "
            >

              Informasi lengkap asset.

            </p>

          </div>

          <button

            onClick={onClose}

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

        {/* Content */}

     
<div
  className="
    flex-1
    overflow-y-auto
    p-6
  "
>
            {loading ? (

            <div
                className="
                py-16
                text-center
                "
            >

                Loading...

            </div>

            ) : !asset ? (

            <div
                className="
                py-16
                text-center
                text-red-500
                "
            >

                Asset tidak ditemukan.

            </div>

            ) : (

            <div
                className="
                grid
                gap-5
                md:grid-cols-2
                "
            >

                <DetailItem

                label="Asset Code"

                value={asset.asset_code}

                />

                <DetailItem

                label="Asset Name"

                value={asset.asset_name}

                />

                <DetailItem

                label="Company"

                value={asset.company?.name ?? "-"}

                />

                <DetailItem

                label="Location"

                value={asset.location?.name ?? "-"}

                />

                <DetailItem

                label="Category"

                value={asset.category?.name ?? "-"}

                />

                <DetailItem

                label="Model"

                value={asset.model?.name ?? "-"}

                />

                <DetailItem

                label="Brand"

                value={asset.brand ?? "-"}

                />

                <DetailItem

                label="Serial Number"

                value={asset.serial_number ?? "-"}

                />

                <DetailItem

                label="Purchase Date"

                value={asset.purchase_date ?? "-"}

                />

                <DetailItem

                label="Warranty"

                value={asset.warranty_until ?? "-"}

                />

                <DetailItem

                label="Purchase Price"

                value={
                    asset.purchase_price != null
                    ? `Rp ${Number(asset.purchase_price).toLocaleString("id-ID")}`
                    : "-"
                }

                />

                <DetailItem

                label="Condition"

                value={asset.condition?.name ?? "-"}

                />

                <DetailItem

                label="Status"

                value={asset.status?.name ?? "-"}

                />

                <div
                className="
                    md:col-span-2
                "
                >

                <DetailItem

                    label="Notes"

                    value={asset.notes ?? "-"}

                />

                </div>

            </div>

            )}

            {asset?.ip_management && (

              <>

                <hr
                  className="
                    my-6
                  "
                />

                <div>

                  <h3
                    className="
                      mb-4
                      text-lg
                      font-semibold
                    "
                  >

                    🌐 Network Information

                  </h3>

                  <div
                    className="
                      grid
                      gap-5
                      md:grid-cols-2
                    "
                  >

                    <DetailItem

                      label="IP Address"

                      value={
                        asset.ip_management.ip_terkini ??
                        "-"
                      }

                    />

                    <DetailItem

                      label="Device"

                      value={
                        asset.ip_management.device ??
                        "-"
                      }

                    />

                    <DetailItem

                      label="Ruangan"

                      value={
                        asset.ip_management.ruangan ??
                        "-"
                      }

                    />

                    <DetailItem

                      label="ISP Utama"

                      value={
                        asset.ip_management.isp_utama ??
                        "-"
                      }

                    />

                    <DetailItem

                      label="ISP Backup"

                      value={
                        asset.ip_management.isp_backup ??
                        "-"
                      }

                    />

                  </div>

                </div>

              </>

            )}

           

{/* history */}
            <div
              className="
                mt-8
              "
            >

              <h3
                className="
                  mb-4
                  text-xl
                  font-semibold
                "
              >

                History

              </h3>

              <AssetHistoryTimeline

                history={history}

              />

            </div>
            {/* history selesei */}
        </div>
        {/* Footer */}
        <div
          className="
            flex
            justify-end
            border-t
            p-6
          "
        >

          <button

            onClick={onClose}

            className="
              rounded-xl
              border
              px-5
              py-2
              hover:bg-gray-100
            "

          >

            Close

          </button>

        </div>

      </div>

    </div>

  );

}