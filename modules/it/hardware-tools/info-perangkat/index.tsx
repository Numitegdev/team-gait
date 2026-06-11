"use client";

import { useEffect, useState } from "react";

import { ToolHeader } from "@/modules/it/shared/components/tool-header";
import { ToolCard } from "@/modules/it/shared/components/tool-card";
import { DeviceInfo } from "./types/device-info.types";
import {
  detectBrowser,
  getGPU,
} from "./services/device.service";
export default function InfoPerangkatPage() {
  const [info, setInfo] =
    useState<DeviceInfo | null>(null);

 

  useEffect(() => {
    const connection =
      (navigator as any).connection;

    setInfo({
      platform: navigator.platform,

      cores:
        navigator.hardwareConcurrency,

      ram: (navigator as any).deviceMemory
        ? `${
            (navigator as any)
              .deviceMemory
          } GB`
        : "Unknown",

      language: navigator.language,

      online: navigator.onLine,

      browser: detectBrowser(),

      resolution: `${window.innerWidth} x ${window.innerHeight}`,

      timezone:
        Intl.DateTimeFormat()
          .resolvedOptions().timeZone,

      gpu: getGPU(),

      connection:
        connection?.effectiveType ||
        "Unknown",
    });
  }, []);

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Check This PC"
        description="Device & browser diagnostics"
      />

      {/* GRID */}
      <div
        className="
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        <InfoCard
          title="Operating System"
          value={info?.platform}
        />

        <InfoCard
          title="CPU Threads"
          value={
            info?.cores
              ? `${info.cores} Threads`
              : "Loading..."
          }
        />

        <InfoCard
          title="Memory"
          value={info?.ram}
        />

        <InfoCard
          title="Browser"
          value={info?.browser}
        />

        <InfoCard
          title="Resolution"
          value={info?.resolution}
        />

        <InfoCard
          title="Language"
          value={info?.language}
        />

        <InfoCard
          title="Timezone"
          value={info?.timezone}
        />

        <InfoCard
          title="Connection"
          value={info?.connection}
        />

        <InfoCard
          title="Status"
          value={
            info?.online
              ? "ONLINE"
              : "OFFLINE"
          }
          green={info?.online}
        />
      </div>

      {/* GPU */}
      <ToolCard>
        <p className="text-sm text-slate-500">
          GPU Renderer
        </p>

        <h2
          className="
            mt-3
            break-all
            text-xl
            font-bold
          "
        >
          {info?.gpu || "Loading..."}
        </h2>
      </ToolCard>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  value?: string;
  green?: boolean;
}

function InfoCard({
  title,
  value,
  green,
}: InfoCardProps) {
  return (
    <ToolCard>
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2
        className={`
          mt-2
          text-2xl
          font-bold

          ${
            green
              ? "text-green-500"
              : "text-slate-900"
          }
        `}
      >
        {value || "Loading..."}
      </h2>
    </ToolCard>
  );
}