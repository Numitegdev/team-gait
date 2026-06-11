interface Props {
  children: React.ReactNode;
}

export function ToolCard({
  children,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}