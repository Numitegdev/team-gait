"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Building2,
  Map,
  Layers3,
} from "lucide-react";

const maps = [
  {
    label: "MAP",
    href:
      "/dashboard/it/network-tools/network-map",
    icon: Map,
  },

  {
    label: "L1",
    href:
      "/dashboard/it/network-tools/network-map/bekami-l1",
    icon: Building2,
  },

  {
    label: "L2",
    href:
      "/dashboard/it/network-tools/network-map/bekami-l2",
    icon: Layers3,
  },

  {
    label: "BRIZA",
    href:
      "/dashboard/it/network-tools/network-map/briza",
    icon: Building2,
  },
];

export function MapFooterNavigation() {

  const pathname =
    usePathname();

  return (

    <div
      className="
        fixed
        bottom-4
        left-1/2
        -translate-x-1/2
        z-50
      "
    >

      <div
        className="
          flex
          items-center
          gap-2

          rounded-2xl

          border
          border-blue-500/20

          bg-slate-900/90
          backdrop-blur-xl

          px-3
          py-3

          md:px-5
          md:py-4

          shadow-2xl
        "
      >

        {maps.map((item) => {

          const Icon =
            item.icon;

          const active =
            pathname === item.href;

          return (

            <Link
              key={item.href}
              href={item.href}
            >

              <button
                className={`
                  flex
                  flex-col
                  items-center
                  justify-center

                  gap-1

                  rounded-xl

                  px-3
                  py-2

                  md:px-6
                  md:py-4

                  transition-all

                  ${
                    active
                      ? `
                        bg-blue-600
                        text-white
                        shadow-lg
                      `
                      : `
                        text-blue-400
                        hover:bg-blue-500/10
                        hover:text-blue-300
                      `
                  }
                `}
              >

                <div
                  className="
                    md:scale-125
                  "
                >
                  <Icon size={20} />
                </div>

                <span
                  className="
                    text-[10px]
                    md:text-sm
                    font-medium
                  "
                >
                  {item.label}
                </span>

              </button>

            </Link>

          );
        })}

      </div>

    </div>

  );
}