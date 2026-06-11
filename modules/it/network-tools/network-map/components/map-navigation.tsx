"use client";

import { useRouter }
from "next/navigation";

export function MapNavigation() {

  const router =
    useRouter();

  const maps = [

    {
      name: "Master Map",
      path:
        "/dashboard/it/network-tools/network-map",
    },

    {
      name: "Bekami L1",
      path:
        "/dashboard/it/network-tools/network-map/bekami-l1",
    },

    {
      name: "Bekami L2",
      path:
        "/dashboard/it/network-tools/network-map/bekami-l2",
    },

    {
      name: "Briza",
      path:
        "/dashboard/it/network-tools/network-map/briza",
    },

  ];

  return (

    <div
      className="
        flex
        flex-wrap
        gap-2
      "
    >

      {maps.map((map) => (

        <button
          key={map.path}
          onClick={() =>
            router.push(
              map.path
            )
          }
          className="
            rounded-xl
            border
            px-4
            py-2
            text-sm
            hover:bg-slate-100
          "
        >
          {map.name}
        </button>

      ))}

    </div>
  );
}