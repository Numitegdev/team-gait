"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { sidebarMenu } from "@/lib/sidebar/menu";

interface Props {
  role: keyof typeof sidebarMenu;
}

export function AppSidebar({ role }: Props) {
  const pathname = usePathname();

  const menus = sidebarMenu[role] || [];

  const [openMenu, setOpenMenu] =
    useState<string | null>("IT");

  return (
    <aside
      className="
        h-screen
        w-64
        overflow-y-auto
        shrink-0

        bg-slate-950
        text-slate-100

        border-r
        border-slate-800

        p-4
      "
    >
    <div
        className="
          mb-8
          border-b
          border-slate-800
          pb-4
        "
      >

        <div
          className="
            text-lg
            font-bold
            tracking-wide
          "
        >
          Team Dashboard
        </div>

        <div
          className="
            text-xs
            text-slate-400
          "
        >
          GA & IT Management
        </div>

      </div>

      <div className="space-y-2">
        {menus.map((menu: any) => {
          const Icon = menu.icon;

          const active =
            pathname === menu.url;

          const children =
            menu.children ?? [];

          const hasChildren =
            children.length > 0;

          return (
            <div key={menu.title}>
              <div
                onClick={() => {
                  if (hasChildren) {
                    setOpenMenu(
                      openMenu === menu.title
                        ? null
                        : menu.title
                    );
                  }
                }}
                className={`
                  flex
                  cursor-pointer
                  items-center
                  justify-between
                  rounded-lg
                  p-3
                  transition

                  ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "hover:bg-blue-400"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {Icon && (
                    <Icon size={18} />
                  )}

                  <Link href={menu.url}>
                    {menu.title}
                  </Link>
                </div>

                {hasChildren && (
                  <ChevronDown
                    size={16}
                    className={`
                      transition-transform

                      ${
                        openMenu === menu.title
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                )}
              </div>

              {hasChildren &&
                openMenu ===
                  menu.title && (
                  <div className="ml-8 mt-2 space-y-1">
                    {children.map(
                      (child: any) => {
                        const childActive =
                          pathname ===
                          child.url;

                        return (
                          <Link
                            key={child.url}
                            href={child.url}
                          >
                            <div
                              className={`
                                rounded-lg
                                px-3
                                py-2
                                text-sm

                                ${
                                  childActive
                                    ? "bg-slate-700"
                                    : "hover:bg-blue-400"
                                }
                              `}
                            >
                              {child.title}
                            </div>
                          </Link>
                        );
                      }
                    )}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}