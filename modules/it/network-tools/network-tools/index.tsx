"use client";

import { ToolHeader }
from "@/modules/it/shared/components/tool-header";

import { ToolItem }
from "./components/tool-item";

import { networkTools }
from "./utils/tools-data";

export default function NetworkToolsPage() {
  return (
    <div className="space-y-6">
      <ToolHeader
        title="Network Tools"
        description="Internet, DNS, Routing, Security & Diagnostic Utilities"
      />

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {networkTools.map((tool) => (
          <ToolItem
            key={tool.name}
            tool={tool}
          />
        ))}
      </div>
    </div>
  );
}