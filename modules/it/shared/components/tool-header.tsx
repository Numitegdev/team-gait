interface Props {
  title: string;
  description?: string;
}

export function ToolHeader({
  title,
  description,
}: Props) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">
        {title}
      </h1>

      {description && (
        <p className="mt-1 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}