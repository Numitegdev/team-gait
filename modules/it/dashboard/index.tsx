"use client";

import Link from "next/link";

import { ToolHeader } from "@/modules/it/shared/components/tool-header";
import { ToolCard } from "@/modules/it/shared/components/tool-card";

const hardwareTools = [
  {
    title: "Info Perangkat",
    description:
      "Informasi perangkat & browser",
    href:
      "/dashboard/it/hardware-tools/info-perangkat",
    icon: "💻",
  },

  {
    title: "Keyboard Test",
    description:
      "Test seluruh tombol keyboard",
    href:
      "/dashboard/it/hardware-tools/keyboard-test",
    icon: "⌨️",
  },

  {
    title: "Webcam Test",
    description:
      "Test kamera perangkat",
    href:
      "/dashboard/it/hardware-tools/webcam-test",
    icon: "📷",
  },

  {
    title: "Audio Test",
    description:
      "Test speaker dan microphone",
    href:
      "/dashboard/it/hardware-tools/audio-test",
    icon: "🔊",
  },

  {
    title: "Monitor Test",
    description:
      "Dead pixel & color test",
    href:
      "/dashboard/it/hardware-tools/monitor-test",
    icon: "🖥️",
  },

  {
    title: "Burn In Test",
    description:
      "Stress test perangkat",
    href:
      "/dashboard/it/hardware-tools/burn-in-test",
    icon: "🔥",
  },
];

const networkTools = [
  {
    title: "Network Tools",
    description:
      "Ping, traceroute, dns lookup",
    href:
      "/dashboard/it/network-tools/network-tools",
    icon: "🌐",
  },

  {
    title: "Network Map",
    description:
      "Visualisasi jaringan",
    href:
      "/dashboard/it/network-tools/network-map",
    icon: "🗺️",
  },

  {
    title: "IP Management",
    description:
      "Manajemen IP Address",
    href:
      "/dashboard/it/network-tools/ip-management",
    icon: "📡",
  },
];

const maintenanceTools = [
  {
    title: "Maintenance Schedule",
    description:
      "Jadwal maintenance",
    href:
      "/dashboard/it/maintenance-tools/maintenance-schedule",
    icon: "📅",
  },

  {
    title: "Maintenance Form",
    description:
      "Form maintenance",
    href:
      "/dashboard/it/maintenance-tools/maintenance-form",
    icon: "📝",
  },

  {
    title: "Maintenance History",
    description:
      "Riwayat maintenance",
    href:
      "/dashboard/it/maintenance-tools/maintenance-history",
    icon: "📖",
  },

  {
    title: "Maintenance Tool",
    description:
      "Peralatan maintenance",
    href:
      "/dashboard/it/maintenance-tools/maintenance-tool",
    icon: "🧰",
  },
];

export default function ITDashboardPage() {
  return (
    <div className="space-y-8">
      <ToolHeader
        title="IT Support Center"
        description="Hardware, Network & Maintenance Tools"
      />

      {/* Hardware */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          Hardware Tools
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hardwareTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
            >
              <ToolCard>
                <div className="space-y-2">
                  <div className="text-4xl">
                    {tool.icon}
                  </div>

                  <h3 className="font-semibold">
                    {tool.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {tool.description}
                  </p>
                </div>
              </ToolCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Network */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          Network Tools
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {networkTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
            >
              <ToolCard>
                <div className="space-y-2">
                  <div className="text-4xl">
                    {tool.icon}
                  </div>

                  <h3 className="font-semibold">
                    {tool.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {tool.description}
                  </p>
                </div>
              </ToolCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Maintenance */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">
          Maintenance Tools
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {maintenanceTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
            >
              <ToolCard>
                <div className="space-y-2">
                  <div className="text-4xl">
                    {tool.icon}
                  </div>

                  <h3 className="font-semibold">
                    {tool.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {tool.description}
                  </p>
                </div>
              </ToolCard>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}