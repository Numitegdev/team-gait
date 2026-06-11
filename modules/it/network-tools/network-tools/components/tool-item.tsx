"use client";

import { NetworkTool } from "../types/network-tool";

interface Props {
  tool: NetworkTool;
}

export function ToolItem({
  tool,
}: Props) {
  return (
    <div
      className="
        rounded-2xl
        border
        bg-white
        p-6
        shadow-sm
        transition-all
        hover:shadow-md
      "
    >
      <div className="space-y-4">
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-xl
            bg-blue-50
            text-2xl
          "
        >
          {tool.icon}
        </div>

        <div>
          <p
            className="
              text-xs
              uppercase
              tracking-wider
              text-blue-500
            "
          >
            {tool.category}
          </p>

          <h3 className="mt-1 font-semibold">
            {tool.name}
          </h3>
        </div>

        <p
          className="
            text-sm
            text-slate-500
          "
        >
          {tool.description}
        </p>

        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            w-full
            justify-center
            rounded-xl
            bg-blue-600
            px-4
            py-3
            text-white
            transition
            hover:bg-blue-700
          "
        >
          Open Tool
        </a>
      </div>
    </div>
  );
}