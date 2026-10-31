"use client";
import {
  Eye,
  Pencil,
  Trash2,
  Printer,
} from "lucide-react";
import { printAssetLabel } from "../utils/asset-label";
import { AssetListItem } from "../types/AssetListItem";
import {
  canEditAsset,
} from "@/lib/auth/company-permission";
interface AssetTableProps {

  assets: AssetListItem[];

  loading: boolean;

  role: string;

  onView: (
    id: number
  ) => void;

  onEdit: (
    id: number
  ) => void;

  onDelete: (
    id: number
  ) => void;

}

function getWarrantyInfo(
  warrantyUntil: string | null
) {
  if (!warrantyUntil) {
    return {
      label: "Belum diketahui",
      color: "bg-gray-100 text-gray-600",
    };
  }

  // Gunakan tanggal kalender agar tidak terpengaruh jam.
  const today = new Date();
  const todayUTC = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const parts = warrantyUntil.split("-").map(Number);

  if (
    parts.length !== 3 ||
    parts.some((part) => !Number.isInteger(part))
  ) {
    return {
      label: "Tanggal tidak valid",
      color: "bg-gray-100 text-gray-600",
    };
  }

  const [year, month, day] = parts;
  const endUTC = Date.UTC(year, month - 1, day);
  const endDate = new Date(endUTC);

  if (
    endDate.getUTCFullYear() !== year ||
    endDate.getUTCMonth() !== month - 1 ||
    endDate.getUTCDate() !== day
  ) {
    return {
      label: "Tanggal tidak valid",
      color: "bg-gray-100 text-gray-600",
    };
  }

  if (endUTC < todayUTC) {
    return {
      label: "Garansi habis",
      color: "bg-red-100 text-red-700",
    };
  }

  const remainingDays = Math.floor(
    (endUTC - todayUTC) / 86400000
  );

  // Prioritaskan merah jika tersisa maksimal 1 bulan.
  const oneMonthLater = new Date(todayUTC);
  oneMonthLater.setUTCMonth(
    oneMonthLater.getUTCMonth() + 1
  );

  // Prioritaskan oranye jika tersisa maksimal 2 bulan.
  const twoMonthsLater = new Date(todayUTC);
  twoMonthsLater.setUTCMonth(
    twoMonthsLater.getUTCMonth() + 2
  );

  const oneMonthDays = Math.floor(
    (oneMonthLater.getTime() - todayUTC) / 86400000
  );

  const twoMonthDays = Math.floor(
    (twoMonthsLater.getTime() - todayUTC) / 86400000
  );

  let color = "bg-green-100 text-green-700";

  if (remainingDays <= oneMonthDays) {
    color = "bg-red-100 text-red-700";
  } else if (remainingDays <= twoMonthDays) {
    color = "bg-orange-100 text-orange-700";
  }

  // Tampilkan tahun, bulan, dan hari tersisa.
  let remainingMonths =
    (endDate.getUTCFullYear() - today.getFullYear()) * 12 +
    endDate.getUTCMonth() -
    today.getMonth();

  const anniversary = new Date(todayUTC);
  anniversary.setUTCMonth(
    anniversary.getUTCMonth() + remainingMonths
  );

  if (anniversary.getTime() > endUTC) {
    remainingMonths--;
  }

  const monthDate = new Date(todayUTC);
  monthDate.setUTCMonth(
    monthDate.getUTCMonth() + remainingMonths
  );

  const remainingDaysAfterMonths = Math.floor(
    (endUTC - monthDate.getTime()) / 86400000
  );

  const years = Math.floor(remainingMonths / 12);
  const months = remainingMonths % 12;

  const partsLabel = [];

  if (years > 0) partsLabel.push(`${years} tahun`);
  if (months > 0) partsLabel.push(`${months} bulan`);
  if (remainingDaysAfterMonths > 0 || partsLabel.length === 0) {
    partsLabel.push(`${remainingDaysAfterMonths} hari`);
  }

  return {
    label: partsLabel.join(" "),
    color,
  };
}

export default function AssetTable({
 assets,

  loading,

  role,

  onView,

  onEdit,

  onDelete,

}: AssetTableProps) {

async function handlePrintLabel(asset: AssetListItem) {
  try {
    await printAssetLabel(asset);
  } catch (error) {
    console.error("Gagal mencetak label asset:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Gagal mencetak label asset."
    );
  }
}


  if (loading) {

    return (

      <div
        className="
          rounded-xl
          border
          bg-white
          p-6
          text-center
        "
      >

        Loading...

      </div>

    );

  }

  if (assets.length === 0) {

    return (

      <div
        className="
          rounded-xl
          border
          bg-white
          p-6
          text-center
          text-gray-500
        "
      >

        Belum ada asset.

      </div>

    );

  }

  return (

    <>

      {/* Desktop */}

      <div
        className="
          hidden
          overflow-x-auto
          rounded-xl
          border
          bg-white
          lg:block
        "
      >

        <table
          className="
            w-full
            text-sm
          "
        >

          <thead
            className="
              bg-gray-100
            "
          >

            <tr>

              <th className="p-3 text-left">

                Asset Code

              </th>

              <th className="p-3 text-left">

                Asset Name

              </th>

              <th className="p-3 text-left">

                Company

              </th>

              <th className="p-3 text-left">

                Category

              </th>

              <th className="p-3 text-left">

                Location

              </th>

              <th className="p-3 text-left">

                Status

              </th>

              <th className="p-3 text-left">
                Garansi
              </th>

              <th className="p-3 text-center">

                Action

              </th>

            </tr>

          </thead>

          <tbody>

            {assets.map((asset) => (

              <tr
                key={asset.id}
                className="
                  border-t
                  hover:bg-gray-50
                "
              >

                <td className="p-3">

                  {asset.asset_code}

                </td>

                <td className="p-3">

                  {asset.asset_name}

                </td>

                <td className="p-3">

                  {asset.company?.name ?? "-"}

                </td>

                <td className="p-3">

                  {asset.category?.name ?? "-"}

                </td>

                <td className="p-3">

                  {asset.location?.name ?? "-"}

                </td>

                <td className="p-3">

                  {asset.status?.name ?? "-"}

                </td>

                <td className="p-3">
                  {(() => {
                    const warranty = getWarrantyInfo(
                      asset.warranty_until
                    );

                    return (
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${warranty.color}
                        `}
                      >
                        {warranty.label}
                      </span>
                    );
                  })()}
                </td>

              <td className="p-3">
  <div className="flex items-center justify-center gap-2">

    {/* VIEW */}
    <button
      type="button"
      onClick={() => onView(asset.id)}
      title="Lihat Detail"
      aria-label="Lihat Detail"
      className="
        flex h-9 w-9 items-center justify-center
        rounded-lg
        bg-blue-600
        text-white
        transition
        hover:bg-blue-700
      "
    >
      <Eye size={17} />
    </button>

    {/* EDIT */}
    {canEditAsset(role, asset.company_id) && (
      <button
        type="button"
        onClick={() => onEdit(asset.id)}
        title="Edit Aset"
        aria-label="Edit Aset"
        className="
          flex h-9 w-9 items-center justify-center
          rounded-lg
          bg-amber-500
          text-white
          transition
          hover:bg-amber-600
        "
      >
        <Pencil size={17} />
      </button>
    )}

    {/* DELETE */}
    {canEditAsset(role, asset.company_id) && (
      <button
        type="button"
        onClick={() => onDelete(asset.id)}
        title="Hapus Aset"
        aria-label="Hapus Aset"
        className="
          flex h-9 w-9 items-center justify-center
          rounded-lg
          bg-red-600
          text-white
          transition
          hover:bg-red-700
        "
      >
        <Trash2 size={17} />
      </button>
    )}

    {/* BARCODE */}
    <button
      type="button"
      onClick={() => handlePrintLabel(asset)}
      title="Cetak Barcode"
      aria-label="Cetak Barcode"
      className="
        flex h-9 w-9 items-center justify-center
        rounded-lg
        bg-gray-700
        text-white
        transition
        hover:bg-gray-800
      "
    >
      <Printer size={17} />
    </button>

  </div>
</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Mobile */}

      <div
        className="
          space-y-4
          lg:hidden
        "
      >

        {assets.map((asset) => (

          <div
            key={asset.id}
            className="
              rounded-xl
              border
              bg-white
              p-4
            "
          >

            <div
              className="
                font-bold
                text-blue-600
              "
            >

              {asset.asset_code}

            </div>

            <div
              className="
                mt-1
                text-lg
                font-semibold
              "
            >

              {asset.asset_name}

            </div>

            <div
              className="
                mt-4
                space-y-2
                text-sm
              "
            >

              <div>

                <b>Company :</b>{" "}

                {asset.company?.name ?? "-"}

              </div>

              <div>

                <b>Category :</b>{" "}

                {asset.category?.name ?? "-"}

              </div>

              <div>

                <b>Location :</b>{" "}

                {asset.location?.name ?? "-"}

              </div>

              <div>

                <b>Status :</b>{" "}

                {asset.status?.name ?? "-"}

              </div>

              <div>
                <b>Garansi :</b>{" "}
                {(() => {
                  const warranty = getWarrantyInfo(
                    asset.warranty_until
                  );

                  return (
                    <span
                      className={`
                        ml-1
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${warranty.color}
                      `}
                    >
                      {warranty.label}
                    </span>
                  );
                })()}
              </div>

            </div>

             <button

                onClick={() =>
                  onView(asset.id)
                }

                className="
                  rounded-lg
                  bg-blue-600
                  px-3
                  py-1
                  mr-2
                  text-white
                "

              >

                <Eye size={17} />

            </button>

            {canEditAsset(
                    role,
                    asset.company_id
                  ) && (

                    <button

                      onClick={() =>
                        onEdit(asset.id)
                      }

                      className="
                        rounded-lg
                        bg-amber-500
                        px-3
                        py-1
                        mr-2
                        text-white
                        hover:bg-amber-600
                      "

                    >

                     <Pencil size={17} />

                    </button>

                  )}


                {canEditAsset(
                    role,
                    asset.company_id
                  ) && (

                  <button

                  onClick={() =>
                    onDelete(asset.id)
                  }

                  className="
                    rounded-lg
                    bg-red-600
                    px-3
                    py-1
                    text-white
                    hover:bg-red-700
                  "

                >

                   <Trash2 size={17} />

                </button>
            )}
           <button
                  type="button"
                  onClick={() => handlePrintLabel(asset)}
                  className="
                    ml-2
                    rounded-lg
                    bg-gray-700
                    px-3
                    py-1
                    text-white
                    hover:bg-gray-800
                  "
                >
                  <span className="inline-flex items-center gap-1">
                    <Printer size={14} />
                
                  </span>
                </button>
          </div>

        ))}

      </div>

    </>

  );

}