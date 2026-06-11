"use client";

import { useState } from "react";
import { useFullscreen }
from "@/modules/it/shared/hooks/use-fullscreen";
import { ToolCard } from "@/modules/it/shared/components/tool-card";
import { ToolHeader } from "@/modules/it/shared/components/tool-header";

const testModes = [
  {
    name: "White",
    value: "white",
  },
  {
    name: "Black",
    value: "black",
  },
  {
    name: "Red",
    value: "red",
  },
  {
    name: "Green",
    value: "green",
  },
  {
    name: "Blue",
    value: "blue",
  },
  {
    name: "Gradient",
    value: "gradient",
  },
];

export default function MonitorTestPage() {
const {
  isFullscreen,
  enterFullscreen,
  exitFullscreen,
} = useFullscreen();

  const [activeMode, setActiveMode] =
    useState("black");

  function getBackground() {
    switch (activeMode) {
      case "white":
        return "bg-white";

      case "black":
        return "bg-black";

      case "red":
        return "bg-red-600";

      case "green":
        return "bg-green-600";

      case "blue":
        return "bg-blue-600";

      case "gradient":
        return `
          bg-gradient-to-br
          from-red-500
          via-green-500
          to-blue-500
        `;

      default:
        return "bg-black";
    }
  }

 

  return (
    <>
      <div className="space-y-6">
        <ToolHeader
          title="Monitor Test"
          description="Test dead pixel dan kualitas monitor"
        />

        <ToolCard>
          <div
            className={`
              aspect-video
              rounded-2xl
              border
              border-slate-300
              transition-all
              ${getBackground()}
            `}
          />
        </ToolCard>

        <ToolCard>
          <div className="flex flex-wrap gap-3">
            {testModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() =>
                  setActiveMode(mode.value)
                }
                className={`
                  rounded-xl
                  px-5
                  py-3
                  transition-all

                  ${
                    activeMode === mode.value
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300"
                  }
                `}
              >
                {mode.name}
              </button>
            ))}

            <button
             onClick={() => enterFullscreen()}
              className="
                rounded-xl
                bg-purple-600
                px-5
                py-3
                text-white
                transition-all
                hover:bg-purple-700
              "
            >
              Fullscreen
            </button>
          </div>
        </ToolCard>
      </div>

      {isFullscreen && (
        <div
          onClick={exitFullscreen}
          className={`
            fixed
            inset-0
            z-9999
            cursor-pointer
            ${getBackground()}
          `}
        />
      )}
    </>
  );
}