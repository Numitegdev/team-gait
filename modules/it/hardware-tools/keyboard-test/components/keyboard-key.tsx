interface KeyboardKeyProps {
  label: string;
  isPressed: boolean;
  isTested: boolean;
}

export function KeyboardKey({
  label,
  isPressed,
  isTested,
}: KeyboardKeyProps) {
  function getWidthClass() {
    switch (label) {
      case "SPACE":
        return "w-80";

      case "BACKSPACE":
        return "w-28";

      case "SHIFT":
        return "w-32";

      case "ENTER":
        return "w-28";

      case "TAB":
        return "w-24";

      case "CAPSLOCK":
        return "w-28";

      default:
        return "w-14";
    }
  }

  return (
    <div
      className={`
        h-14
        ${getWidthClass()}
        flex
        items-center
        justify-center
        rounded-xl
        border
        text-sm
        font-medium
        transition-all

        ${
          isPressed
            ? `
              bg-green-500
              border-green-400
              text-white
              scale-95
            `
            : isTested
            ? `
              bg-blue-50
              border-blue-200
              text-slate-700
            `
            : `
              bg-white
              border-slate-300
              text-slate-700
            `
        }
      `}
    >
      {label}
    </div>
  );
}