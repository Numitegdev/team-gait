interface Props {
  module: "driver" | "checklist" | "security";
}

export function ActivityBadge({
  module,
}: Props) {

  switch (module) {

    case "driver":
      return (
        <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-1 text-xs font-medium">
          🚚 Driver
        </span>
      );

    case "checklist":
      return (
        <span className="rounded-full bg-green-100 text-green-700 px-2 py-1 text-xs font-medium">
          ✅ Checklist
        </span>
      );

    case "security":
      return (
        <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-1 text-xs font-medium">
          🛡️ Security
        </span>
      );

    default:
      return null;

  }

}