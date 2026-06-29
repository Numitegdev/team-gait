interface Props {
  name: string;
  onRemove?: () => void;
}

export default function AddonChip({
  name,
  onRemove,
}: Props) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">

      <span>{name}</span>

      {onRemove && (
        <button
          onClick={onRemove}
          className="font-bold hover:text-red-600"
        >
          ×
        </button>
      )}

    </div>
  );
}