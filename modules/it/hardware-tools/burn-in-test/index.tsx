"use client";

import {
  useEffect,
  useState,
} from "react";
import { useFullscreen }
from "@/modules/it/shared/hooks/use-fullscreen";
import { ToolCard } from "@/modules/it/shared/components/tool-card";
import { ToolHeader } from "@/modules/it/shared/components/tool-header";

const videos = [
  "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "https://www.youtube.com/embed/aqz-KE-bpKQ",
  "https://www.youtube.com/embed/ScMzIvxBSi4",
  "https://www.youtube.com/embed/jNQXAC9IVRw",
];

export default function BurnInTestPage() {
 const {
  enterFullscreen,
    } = useFullscreen();
 
    const [running, setRunning] =
    useState(false);

  const [seconds, setSeconds] =
    useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () =>
      clearInterval(interval);
  }, [running]);

  function formatTime(sec: number) {
    const hours =
      Math.floor(sec / 3600);

    const minutes =
      Math.floor(
        (sec % 3600) / 60
      );

    const seconds =
      sec % 60;

    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }

 

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Burn In Test"
        description="Test stabilitas perangkat"
      />

      <ToolCard>
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <p className="text-sm text-slate-500">
              Running Time
            </p>

            <h2 className="text-3xl font-bold">
              {formatTime(seconds)}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                setRunning(true)
              }
              className="
                rounded-xl
                bg-green-600
                px-5
                py-3
                text-white
              "
            >
              Start
            </button>

            <button
              onClick={() =>
                setRunning(false)
              }
              className="
                rounded-xl
                bg-red-600
                px-5
                py-3
                text-white
              "
            >
              Stop
            </button>

            <button
              onClick={() =>
                setSeconds(0)
              }
              className="
                rounded-xl
                bg-slate-600
                px-5
                py-3
                text-white
              "
            >
              Reset
            </button>

            <button
              onClick={() => enterFullscreen()}
              className="
                rounded-xl
                bg-purple-600
                px-5
                py-3
                text-white
              "
            >
              Fullscreen
            </button>
          </div>
        </div>
      </ToolCard>

      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
        "
      >
        {videos.map(
          (video, index) => (
            <ToolCard key={index}>
              <div
                className="
                  aspect-video
                  overflow-hidden
                  rounded-xl
                "
              >
                <iframe
                  src={`${video}?autoplay=${
                    running ? 1 : 0
                  }&mute=1`}
                  allow="autoplay"
                  className="
                    h-full
                    w-full
                  "
                />
              </div>
            </ToolCard>
          )
        )}
      </div>
    </div>
  );
}