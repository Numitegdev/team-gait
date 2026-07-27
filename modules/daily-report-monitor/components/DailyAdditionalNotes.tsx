interface Props {
  notes: string | null;
}

export function DailyAdditionalNotes({
  notes,
}: Props) {
  if (!notes?.trim()) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700">
        Catatan Tambahan
      </h3>

      <div className="rounded-lg border bg-gray-50 p-4">
        <p className="whitespace-pre-wrap text-sm text-gray-700">
          {notes}
        </p>
      </div>
    </div>
  );
}