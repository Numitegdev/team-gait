"use client";

interface Props {

  ips: string[];

  usedIPs: string[];

  onSelect: (
    ip: string
  ) => void;
}

export function IPSuggestion({

  ips,
  usedIPs,
  onSelect,

}: Props) {

  return (

    <div
      className="
        mt-4
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
        Suggested Available IP
      </h3>

      <div
        className="
          grid
          grid-cols-2
          gap-2
          max-h-56
          overflow-auto
        "
      >

        {ips.map((ip) => {

          const used =
            usedIPs.includes(ip);

          return (

            <button
              key={ip}
              disabled={used}
              onClick={() =>
                onSelect(ip)
              }
              className={`
                rounded-lg
                border
                px-3
                py-2
                text-left
                transition

                ${
                  used
                    ? "bg-red-50 text-red-500"
                    : "hover:bg-blue-50"
                }
              `}
            >

              {used
                ? "🔴"
                : "🟢"}{" "}

              {ip}

            </button>

          );

        })}

      </div>

    </div>

  );
}