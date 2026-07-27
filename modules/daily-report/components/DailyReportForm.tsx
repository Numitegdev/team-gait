interface Props {

  additionalNotes: string;

  onChange: (value: string) => void;

  onSubmit: () => void;

  loading: boolean;

  isSubmitted: boolean;

  submittedAt?: string | null;

}

export function DailyReportForm({

  additionalNotes,

  onChange,

  onSubmit,

  loading,

  isSubmitted,

  submittedAt,

}: Props) {

  return (

    <div className="rounded-lg border p-4 space-y-4">

      <h2 className="text-lg font-semibold">

        Tambahan Pekerjaan Hari Ini

      </h2>

      <textarea

        value={additionalNotes}

        onChange={(e) =>
          onChange(e.target.value)
        }

        rows={5}

        className="w-full rounded border p-3"

        placeholder="Tambahkan pekerjaan lain yang belum tercatat..."

      />

      {isSubmitted && submittedAt && (

        <p className="text-sm text-gray-500">

          Terakhir disimpan:

          {" "}

          {new Date(submittedAt).toLocaleString("id-ID")}

        </p>

      )}

      <button

        onClick={onSubmit}

        disabled={loading}

        className="rounded bg-blue-600 px-4 py-2 text-white"

      >

       {loading

        ? "Menyimpan..."

        : isSubmitted

          ? "Update Laporan"

          : "Submit Laporan"}

      </button>

    </div>

  );

}