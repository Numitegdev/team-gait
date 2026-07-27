import {
  AssetHistoryDetail,
} from "../types/AssetHistoryDetail";

import {
  PlusCircle,
  Pencil,
  ArrowRightLeft,
  PackageOpen,
  PackageCheck,
  Trash2,
  HelpCircle,
} from "lucide-react";

interface Props {

  history:
    AssetHistoryDetail[];

}

export default function AssetHistoryTimeline({

  history,

}: Props) {

function getActionIcon(
  action: string
) {

  switch (action) {

    case "CREATE":

      return PlusCircle;

    case "UPDATE":

      return Pencil;

    case "MUTATION":

      return ArrowRightLeft;

    case "BORROW":

      return PackageOpen;

    case "RETURN":

      return PackageCheck;

    case "DISPOSAL":

      return Trash2;

    default:

      return HelpCircle;

  }

}    

function getActionStyle(
  action: string
) {

  switch (action) {

    case "CREATE":

      return {

        bg: "bg-green-100",

        text: "text-green-700",

      };

    case "UPDATE":

      return {

        bg: "bg-yellow-100",

        text: "text-yellow-700",

      };

    case "MUTATION":

      return {

        bg: "bg-blue-100",

        text: "text-blue-700",

      };

    case "DISPOSAL":

      return {

        bg: "bg-red-100",

        text: "text-red-700",

      };

    default:

      return {

        bg: "bg-gray-100",

        text: "text-gray-700",

      };

  }

}
    function ChangeRow({

  label,

  oldValue,

  newValue,

}: {

  label: string;

  oldValue?: string | null;

  newValue?: string | null;

}) {

  if (oldValue === newValue)

    return null;

  return (

    <div
      className="
        mt-3
        rounded-lg
        bg-gray-50
        p-3
      "
    >

      <p
        className="
          text-xs
          font-semibold
          text-gray-500
        "
      >

        {label}

      </p>

      <div
        className="
          mt-1
          flex
          items-center
          gap-3
        "
      >

        <span
          className="
            text-red-600
          "
        >

          {oldValue ?? "-"}

        </span>

        <span>

          →

        </span>

        <span
          className="
            font-semibold
            text-green-600
          "
        >

          {newValue ?? "-"}

        </span>

      </div>

    </div>

  );

}

  if (history.length === 0) {

    return (

      <div
        className="
          rounded-xl
          border
          p-4
          text-center
          text-gray-500
        "
      >

        Belum ada riwayat asset.

      </div>

    );

  }
console.log(history);
  return (

    <div
      className="
        space-y-4
      "
    >

   {history.map((item) => {

  const actionStyle =
    getActionStyle(
      item.action_type
    );

    const ActionIcon =
  getActionIcon(
    item.action_type
  );

  return (

    <div
      key={item.id}
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
          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
            ${actionStyle.bg}
            ${actionStyle.text}
          `}
        >
        <ActionIcon
            size={14}
        />
          {item.action_type}

        </span>

        <span
          className="
            text-xs
            text-gray-500
            ml-3
          "
        >

          {new Date(
            item.created_at
          ).toLocaleString(
            "id-ID"
          )}

        </span>
{/* user yang edit */}
        <p
        className="
            mt-1
            text-xs
            text-gray-500
        "
        >

        Oleh{" "}

        <span
            className="
            font-medium
            "
        >

            {item.created_user?.full_name ??

            "-"}

        </span>

        </p>
{/* user yang ngedit selesei */}

      </div>

      <p
        className="
          mt-3
          text-sm
          text-gray-700
        "
      >

        {item.remarks}

      </p>

      <ChangeRow
        label="Company"
        oldValue={
          item.old_company?.name
        }
        newValue={
          item.new_company?.name
        }
      />

      <ChangeRow
        label="Location"
        oldValue={
          item.old_location?.name
        }
        newValue={
          item.new_location?.name
        }
      />

      <ChangeRow
        label="Condition"
        oldValue={
          item.old_condition?.name
        }
        newValue={
          item.new_condition?.name
        }
      />

      <ChangeRow
        label="Status"
        oldValue={
          item.old_status?.name
        }
        newValue={
          item.new_status?.name
        }
      />
        <ChangeRow

        label="IP Address"

        oldValue={
            item.old_ip?.ip_terkini
        }

        newValue={
            item.new_ip?.ip_terkini
        }

        />


    </div>

  );

})}

    </div>

  );

}