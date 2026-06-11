"use client";

import { Menu } from "lucide-react";

import { UserMenu } from "./user-menu";

interface Props {
  fullName?: string;
  role?: string;
  onMenuClick?: () => void;
}

export function TopNavbar({
  fullName,
  role,
  onMenuClick,
}: Props) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-semibold">
          Operational Umum dan Teknis
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">
            {fullName || "User"}
          </p>

          <p className="text-xs text-slate-500">
            {role}
          </p>
        </div>

        <UserMenu fullName={fullName} />
      </div>
    </header>
  );
}