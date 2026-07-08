"use client";


import {
  useState,
  useRef,
} from "react";


interface Props {

open: boolean;

onClose: () => void;

data: any;

onComplete: (


id: number,

catatan: string,

file?: File


) => Promise<void>;

}
function getPaymentText(data: any) {

  switch (data.payment_type) {

    case "cash":
      return `Cash Rp ${Number(
        data.cash_amount || 0
      ).toLocaleString("id-ID")}`;

    case "transfer":
      return `Transfer Rp ${Number(
        data.cash_amount || 0
      ).toLocaleString("id-ID")}`;

    case "tempo":
      return "Tempo";

    default:
      return "-";

  }

}
function renderText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-blue-600
            underline
            hover:text-blue-800
          "
        >
          {part}
        </a>
      );
    }

    return part;
  });
}

function InfoItem({

  label,

  value,

  multiline = false,

}: {

  label: string;

  value: any;

  multiline?: boolean;

}) {

return (


<div
  className="
    rounded-xl
    border
    bg-slate-50
    p-4
  "
>

  <div
    className="
      text-xs
      text-slate-500
    "
  >

    {label}

  </div>

<div
  className={`
    mt-1
    font-medium
    ${multiline ? "whitespace-pre-wrap break-words" : ""}
  `}
>
  {typeof value === "string"
    ? renderText(value)
    : value || "-"}
</div>

</div>


);

}

export function DetailModal({

open,

onClose,

data,

onComplete,

}: Props) {

const fileInputRef =
  useRef<HTMLInputElement>(
    null
  );


const [


catatan,

setCatatan,


] = useState("");

const [


completing,

setCompleting,


] = useState(
false
);

const [


file,

setFile,


] = useState<File | null>(
null
);

async function handleComplete() {


try {

  setCompleting(
    true
  );

  await onComplete(

    data.id,

    catatan,

    file || undefined

  );

  onClose();

} finally {

  setCompleting(
    false
  );

}


}



if (
!open ||
!data
)
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
    p-4
  "
>

  <div
    className="
      w-full
      max-w-3xl
      max-h-[90vh]
      overflow-y-auto
      rounded-2xl
      bg-white
      shadow-xl
    "
  >

    <div
      className="
        sticky
        top-0
        z-10
        flex
        items-center
        justify-between
        border-b
        bg-white
        px-6
        py-4
      "
    >

      <div>

        <h2
          className="
            text-xl
            font-bold
          "
        >

          Detail Task

        </h2>

        <p
          className="
            text-sm
            text-slate-500
          "
        >

          {data.nomor_task}

        </p>

      </div>

      <button

        onClick={
          onClose
        }

        className="
          rounded-lg
          border
          px-4
          py-2
          hover:bg-slate-50
        "

      >

        Tutup

      </button>

    </div>

    <div
      className="
        space-y-6
        p-6
      "
    >

      {data.task_photo_url && (

        <div
          className="
            rounded-xl
            border
            p-4
          "
        >

          <h3
            className="
              mb-3
              font-semibold
            "
          >

            Foto Barang

          </h3>

          <img

            src={
              data.task_photo_url
            }

            alt="Foto Barang"

            className="
              w-full
              max-h-96
              rounded-lg
              bg-slate-50
              object-contain
            "

          />

        </div>

      )}

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
        "
      >

        <InfoItem
          label="Jenis"
          value={data.jenis}
        />

        <InfoItem
          label="Kirim Ke"
          value={data.pengirim}
        />

        <InfoItem
          label="Ambil Dari"
          value={data.penerima}
        />

        <InfoItem
          label="Nomor Resi"
          value={data.nomor_resi}
        />

      <InfoItem
        label="Payment"
        value={getPaymentText(data)}
      />

        <InfoItem
          label="Status"
          value={data.status}
        />

      <InfoItem
  label="Deskripsi"
  value={data.deskripsi}
  multiline
/>

      </div>

      {data.status ===
        "on_progress" && (

        <div
          className="
            rounded-xl
            border
            p-4
            space-y-4
          "
        >

          <h3
            className="
              font-semibold
            "
          >

            Selesaikan Task

          </h3>

          <textarea

            value={
              catatan
            }

            onChange={(e) =>
              setCatatan(
                e.target.value
              )
            }

            placeholder="
              Catatan penyelesaian
            "

            className="
              w-full
              rounded-lg
              border
              p-3
            "

          />

       
<input

  ref={fileInputRef}

  type="file"

  accept="image/*"

  className="hidden"

  onChange={(e) =>

    setFile(
      e.target.files?.[0] ||
      null
    )

  }

/>

        <button

          type="button"

          onClick={() =>
            fileInputRef.current?.click()
          }

          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            px-4
            py-2
            hover:bg-slate-50
          "

        >

          📷 Upload Foto

        </button>

        {file && (

          <div
            className="
              text-sm
              text-green-600
            "
          >

            File:
            {" "}
            {file.name}

          </div>

        )}
          <button

            disabled={
              completing
            }

            onClick={
              handleComplete
            }

            className="
              w-full
              rounded-lg
              bg-green-600
              py-3
              font-medium
              text-white
              hover:bg-green-700
              disabled:opacity-50
            "

          >

            {

              completing
                ? "Menyimpan..."
                : "Selesaikan Task"

            }

          </button>

        </div>

      )}

    </div>

  </div>

</div>


);

}
