"use client";
import { createClient } from "@/lib/supabase/client";
import {
  canExecuteMutation,
  canApproveMutation,
} from "@/lib/auth/company-permission";
import { useMutationDetail } from "../hooks/use-mutation-detail";
import {
  approveMutation,
  rejectMutation,
  executeMutation,
} from "../services/asset-mutation-service";
import {
  useEffect,
  useState,
} from "react";
interface Props {

  open: boolean;

  mutationId: number | null;

  onClose: () => void;

  onSuccess: () => void;

}

export default function MutationDetailModal({

  open,

  mutationId,

  onClose,

  onSuccess,

}: Props) {

  const {

    mutation,

    loading,

  } = useMutationDetail(

    mutationId,

    open

  );


const [role, setRole] =
  useState<string | null>(null);

const supabase =
  createClient();

  useEffect(() => {

  async function loadRole() {

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();

    if (!user)
      return;

    const {
      data: profile,
      error,
    } = await supabase

      .from("profiles")

      .select("role")

      .eq(
        "id",
        user.id
      )

      .single();

    if (error) {

      console.error(
        "Gagal mengambil role:",
        error
      );

      return;

    }

    setRole(
      profile.role
    );

  }

  loadRole();

}, []);

const canExecute =
  mutation
    ? canExecuteMutation(
        role ?? "",
        mutation.to_company_id
      )
    : false;

    const canApprove =
  mutation
    ? canApproveMutation(
        role ?? "",
        mutation.from_company_id
      )
    : false;

console.log(
  "FULL MUTATION:",
  mutation
);

console.log(
  "ROLE:",
  role
);

console.log(
  "TO COMPANY ID:",
  mutation?.to_company_id
);

console.log(
  "TO COMPANY:",
  mutation?.to_company
);

console.log(
  "CAN EXECUTE:",
  canExecute
);



  async function handleApprove() {

  if (!mutation)
    return;

  const confirmed =
    window.confirm(
      "Approve mutation ini?"
    );

  if (!confirmed)
    return;

  try {

    await approveMutation(
      mutation.id
    );

    alert(
      "Mutation berhasil di-approve."
    );

    onSuccess();

  } catch (error) {

    console.error(error);

    alert(
      "Gagal approve mutation."
    );

  }

}

async function handleReject() {

  if (!mutation)
    return;

  const reason =
    window.prompt(
      "Masukkan alasan penolakan:"
    );

  if (reason === null)
    return;

  if (!reason.trim()) {

    alert(
      "Alasan penolakan wajib diisi."
    );

    return;

  }

  try {

    await rejectMutation(

      mutation.id,

      reason

    );

    alert(
      "Mutation berhasil ditolak."
    );

    onSuccess();

  } catch (error) {

    console.error(error);

    alert(
      "Gagal reject mutation."
    );

  }

}

async function handleExecute() {

  if (!mutation)
    return;

  const confirmed =
    window.confirm(
      "Execute mutation ini? Asset akan dipindahkan ke company dan location tujuan."
    );

  if (!confirmed)
    return;

  try {

    await executeMutation(
      mutation.id
    );

    alert(
      "Mutation berhasil dieksekusi."
    );

    onSuccess();

  } catch (error) {

    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Gagal execute mutation."
    );

  }

}


function formatDate(
  value: string | null | undefined
) {

  if (!value)
    return "-";

  return new Date(value).toLocaleString(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );

}


if (!open) return null;

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
      p-4
    "
  >
    <div
      className="
        w-full
        max-w-4xl
        rounded-2xl
        bg-white
        shadow-xl
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
        <h2 className="text-xl font-bold">
          Mutation Detail
        </h2>

        <button
          onClick={onClose}
          className="
            text-2xl
            text-gray-400
            hover:text-gray-600
          "
        >
          ×
        </button>
      </div>

      {/* Body */}
     <div className="space-y-6 p-6">

  <div>
    <h2 className="text-2xl font-bold">
      Mutation Detail
    </h2>

    <p className="text-sm text-gray-500">
      Detail permintaan mutasi asset.
    </p>
  </div>

  <div className="grid grid-cols-2 gap-6">

    <div>
      <p className="text-xs text-gray-500">
        Mutation No
      </p>

      <p className="font-semibold">
        {mutation?.mutation_no}
      </p>
    </div>

    <div>
      <p className="text-xs text-gray-500">
        Status
      </p>

     <span
  className={`
    rounded-full
    px-3
    py-1
    text-sm
    font-medium

    ${
      mutation?.status === "PENDING"
        ? "bg-yellow-100 text-yellow-700"
        : mutation?.status === "APPROVED"
        ? "bg-blue-100 text-blue-700"
        : mutation?.status === "REJECTED"
        ? "bg-red-100 text-red-700"
        : mutation?.status === "EXECUTED"
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-600"
    }
  `}
>
  {mutation?.status}
</span>
    </div>

  </div>
  <div>
  <p className="text-xs text-gray-500">
    Asset
  </p>

  <p className="font-semibold">
    {mutation?.asset?.asset_code}
  </p>

  <p className="text-sm text-gray-500">
    {mutation?.asset?.asset_name}
  </p>
</div>

<div
  className="
    grid
    gap-4
    md:grid-cols-2
  "
>
  {/* From */}

  <div
    className="
      rounded-xl
      border
      bg-gray-50
      p-4
    "
  >
    <p
      className="
        text-xs
        font-medium
        text-gray-500
      "
    >
      From
    </p>

    <p
      className="
        mt-1
        font-semibold
      "
    >
      {mutation?.from_company?.name}
    </p>

    <p
      className="
        text-sm
        text-gray-500
      "
    >
      {mutation?.from_location?.name}
    </p>
  </div>

  {/* To */}

  <div
    className="
      rounded-xl
      border
      bg-gray-50
      p-4
    "
  >
    <p
      className="
        text-xs
        font-medium
        text-gray-500
      "
    >
      To
    </p>

    <p
      className="
        mt-1
        font-semibold
      "
    >
      {mutation?.to_company?.name}
    </p>

    <p
      className="
        text-sm
        text-gray-500
      "
    >
      {mutation?.to_location?.name}
    </p>
  </div>
</div>

<div
  className="
    grid
    gap-4
    md:grid-cols-2
  "
>
  {/* Requester */}

  <div
    className="
      rounded-xl
      border
      bg-gray-50
      p-4
    "
  >
    <p
      className="
        text-xs
        font-medium
        text-gray-500
      "
    >
      Requester
    </p>

    <p
      className="
        mt-1
        font-semibold
      "
    >
      {mutation?.requester?.full_name}
    </p>

    <p
      className="
        text-sm
        text-gray-500
      "
    >
      {mutation?.requester?.email}
    </p>
  </div>

  {/* Remarks */}

  <div
    className="
      rounded-xl
      border
      bg-gray-50
      p-4
    "
  >
    <p
      className="
        text-xs
        font-medium
        text-gray-500
      "
    >
      Remarks
    </p>

    <p
      className="
        mt-1
        text-sm
        text-gray-700
      "
    >
      {mutation?.remarks || "-"}
    </p>
  </div>
</div>

<div
  className="
    grid
    gap-4
    md:grid-cols-2
  "
>

  {/* Requested */}

  <div
    className="
      rounded-xl
      border
      bg-gray-50
      p-4
    "
  >

    <p
      className="
        text-xs
        font-medium
        text-gray-500
      "
    >
      Requested
    </p>

    <p className="mt-1 font-semibold">
      {formatDate(
        mutation?.requested_at
      )}
    </p>

  </div>


  {/* Approved */}

  <div
    className="
      rounded-xl
      border
      bg-gray-50
      p-4
    "
  >

    <p
      className="
        text-xs
        font-medium
        text-gray-500
      "
    >
      Approved
    </p>

    <p className="mt-1 font-semibold">
      {formatDate(
        mutation?.approved_at
      )}
    </p>

  </div>


  {/* Rejected */}

  <div
    className="
      rounded-xl
      border
      bg-gray-50
      p-4
    "
  >

    <p
      className="
        text-xs
        font-medium
        text-gray-500
      "
    >
      Rejected
    </p>

    <p className="mt-1 font-semibold">
      {formatDate(
        mutation?.rejected_at
      )}
    </p>

    {mutation?.rejection_reason && (

      <p
        className="
          mt-2
          text-sm
          text-red-600
        "
      >
        {mutation.rejection_reason}
      </p>

    )}

  </div>


  {/* Executed */}

  <div
    className="
      rounded-xl
      border
      bg-gray-50
      p-4
    "
  >

    <p
      className="
        text-xs
        font-medium
        text-gray-500
      "
    >
      Executed
    </p>

    <p className="mt-1 font-semibold">
      {formatDate(
        mutation?.executed_at
      )}
    </p>

  </div>

</div>

</div>


      {/* Footer */}

<div
  className="
    flex
    items-center
    justify-end
    gap-3
    border-t
    p-6
  "
>

  {/* Approve / Reject */}

  {mutation?.status === "PENDING" &&
    canApprove && (

    <>

      <button
        onClick={handleReject}
        className="
          rounded-xl
          border
          border-red-200
          px-5
          py-2
          font-medium
          text-red-600
          hover:bg-red-50
        "
      >
        Reject
      </button>

      <button
        onClick={handleApprove}
        className="
          rounded-xl
          bg-green-600
          px-5
          py-2
          font-medium
          text-white
          hover:bg-green-700
        "
      >
        Approve
      </button>

    </>

  )}

  {/* Execute */}



{mutation?.status === "APPROVED" &&
  canExecute && (

  <button
    onClick={handleExecute}
    className="
      rounded-xl
      bg-blue-600
      px-5
      py-2
      font-medium
      text-white
      hover:bg-blue-700
    "
  >
    Execute
  </button>

)}

  {/* Close */}

  <button
    onClick={onClose}
    className="
      rounded-xl
      border
      px-5
      py-2
    "
  >
    Close
  </button>

</div>
      
    </div>
    
  </div>
);
}