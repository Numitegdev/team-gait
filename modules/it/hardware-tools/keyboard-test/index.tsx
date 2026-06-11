"use client";

import { useEffect, useState } from "react";
import { KeyboardKey } from "./components/keyboard-key";
import { ToolCard } from "@/modules/it/shared/components/tool-card";
import { ToolHeader } from "@/modules/it/shared/components/tool-header";

const keyboardRows = [
  ["ESC", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],

  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "BACKSPACE"],

  ["TAB", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],

  ["CAPSLOCK", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "ENTER"],

  ["SHIFT", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "SHIFT"],

  ["CTRL", "FN", "WINDOWS", "ALT", "SPACE", "ALT", "CTRL", "←", "↑", "↓", "→"],
];

function normalizeKey(key: string) {
  const upperKey = key.toUpperCase();

  switch (upperKey) {
    case " ":
      return "SPACE";

    case "CONTROL":
      return "CTRL";

    case "META":
      return "WINDOWS";

    case "ARROWUP":
      return "↑";

    case "ARROWDOWN":
      return "↓";

    case "ARROWLEFT":
      return "←";

    case "ARROWRIGHT":
      return "→";

    default:
      return upperKey;
  }
}

export default function KeyboardTestPage() {
  const [pressedKeys, setPressedKeys] =
    useState<string[]>([]);

  const [testedKeys, setTestedKeys] =
    useState<string[]>([]);

  const [lastKey, setLastKey] =
    useState("-");

  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      e.preventDefault();

      const key =
        normalizeKey(e.key);

      setLastKey(key);

      setPressedKeys((prev) => {
        if (prev.includes(key))
          return prev;

        return [...prev, key];
      });

      setTestedKeys((prev) => {
        if (prev.includes(key))
          return prev;

        return [...prev, key];
      });
    };

    const handleKeyUp = (
      e: KeyboardEvent
    ) => {
      const key =
        normalizeKey(e.key);

      setPressedKeys((prev) =>
        prev.filter(
          (item) => item !== key
        )
      );
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "keyup",
      handleKeyUp
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleKeyUp
      );
    };
  }, []);

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Keyboard Tester"
        description="Test seluruh tombol keyboard"
      />

      {/* STATUS */}
      <div
        className="
          grid
          gap-4
          md:grid-cols-3
        "
      >
        <ToolCard>
          <p className="text-sm text-slate-500">
            Last Key
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {lastKey}
          </h2>
        </ToolCard>

        <ToolCard>
          <p className="text-sm text-slate-500">
            Active Keys
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {pressedKeys.length}
          </h2>
        </ToolCard>

        <ToolCard>
          <p className="text-sm text-slate-500">
            Keys Tested
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {testedKeys.length}
          </h2>
        </ToolCard>
      </div>

      {/* KEYBOARD */}
      <ToolCard>
        <div className="overflow-x-auto">
          <div className="min-w-237.5 space-y-2">
            {keyboardRows.map(
              (row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex gap-2"
                >
                  {row.map((key, keyIndex) => (
                    <KeyboardKey
                        key={`${key}-${keyIndex}`}
                        label={key}
                        isPressed={pressedKeys.includes(
                        key
                        )}
                        isTested={testedKeys.includes(
                        key
                        )}
                    />
                    ))}
                </div>
              )
            )}
          </div>
        </div>
      </ToolCard>

      {/* LEGEND */}
      <ToolCard>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div
              className="
                h-6
                w-6
                rounded
                bg-green-500
              "
            />

            <span>
              Sedang ditekan
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="
                h-6
                w-6
                rounded
                border
                border-blue-200
                bg-blue-50
              "
            />

            <span>
              Sudah terdeteksi
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="
                h-6
                w-6
                rounded
                border
                border-slate-300
                bg-white
              "
            />

            <span>
              Belum dites
            </span>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}