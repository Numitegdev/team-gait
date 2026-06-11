"use client";

import { useState } from "react";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

import {
  AppSidebar,
} from "@/components/sidebar/app-sidebar";

import {
  TopNavbar,
} from "@/components/navbar/top-navbar";

export default function DashboardLayout({
  children,
  role,
  fullName,
}: {
  children: React.ReactNode;
  role: any;
  fullName?: string;
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <div
      className="
        flex
        h-screen
        overflow-hidden
        bg-slate-100
      "
    >
      {/* desktop sidebar */}

      <div
        className="
          hidden
          md:block
        "
      >
        <AppSidebar role={role} />
      </div>

      {/* mobile sidebar */}

      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetContent
          side="left"
          className="p-0"
        >
          <AppSidebar role={role} />
        </SheetContent>
      </Sheet>

      <div
        className="
          flex
          flex-1
          flex-col
          overflow-hidden
        "
      >
        <TopNavbar
          role={role}
          fullName={fullName}
          onMenuClick={() =>
            setOpen(true)
          }
        />

        <main
          className="
            flex-1
            overflow-y-auto
            p-6
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}