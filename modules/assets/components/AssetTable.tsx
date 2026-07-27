"use client";

import { AssetListItem } from "../types/AssetListItem";

interface AssetTableProps {

  assets: AssetListItem[];

  loading: boolean;

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

export default function AssetTable({

  assets,

  loading,

  onView,

  onEdit,

  onDelete,

}: AssetTableProps) {

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

                <td
                  className="
                    p-3
                    text-center
                    gap-2
                    m-2
                  "
                >

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

                    View

                  </button>

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

                      Edit

                    </button>
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

                      Delete

                    </button>

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

                View

            </button>

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

                  Edit

                </button>
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

                  Delete

                </button>
          </div>

        ))}

      </div>

    </>

  );

}