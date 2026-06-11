"use client";

import {
  useRef,
  useState,
} from "react";

import { ToolCard } from "@/modules/it/shared/components/tool-card";
import { ToolHeader } from "@/modules/it/shared/components/tool-header";

export default function AudioTestPage() {
  const [micLevel, setMicLevel] =
    useState(0);

  const [micEnabled, setMicEnabled] =
    useState(false);

  const audioContextRef =
    useRef<AudioContext | null>(null);

  const analyserRef =
    useRef<AnalyserNode | null>(null);

  async function startMicTest() {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const audioContext =
        new AudioContext();

      const analyser =
        audioContext.createAnalyser();

      const microphone =
        audioContext.createMediaStreamSource(
          stream
        );

      microphone.connect(analyser);

      analyser.fftSize = 256;

      const dataArray =
        new Uint8Array(
          analyser.frequencyBinCount
        );

      audioContextRef.current =
        audioContext;

      analyserRef.current =
        analyser;

      setMicEnabled(true);

      function updateMicLevel() {
        analyser.getByteFrequencyData(
          dataArray
        );

        let sum = 0;

        for (
          let i = 0;
          i < dataArray.length;
          i++
        ) {
          sum += dataArray[i];
        }

        const average =
          sum / dataArray.length;

        setMicLevel(average);

        requestAnimationFrame(
          updateMicLevel
        );
      }

      updateMicLevel();
    } catch (err) {
      console.error(err);
    }
  }

  function playTone(
    panValue: number
  ) {
    const audioContext =
      new AudioContext();

    const oscillator =
      audioContext.createOscillator();

    const gainNode =
      audioContext.createGain();

    const panNode =
      audioContext.createStereoPanner();

    oscillator.type = "sine";

    oscillator.frequency.value = 440;

    panNode.pan.value = panValue;

    oscillator.connect(gainNode);

    gainNode.connect(panNode);

    panNode.connect(
      audioContext.destination
    );

    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 1000);
  }

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Audio Test"
        description="Test speaker dan microphone"
      />

      <ToolCard>
        <h2 className="mb-4 text-xl font-semibold">
          Speaker Test
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              playTone(-1)
            }
            className="
              rounded-xl
              bg-blue-600
              px-5
              py-3
              text-white
            "
          >
            Left Speaker
          </button>

          <button
            onClick={() =>
              playTone(1)
            }
            className="
              rounded-xl
              bg-green-600
              px-5
              py-3
              text-white
            "
          >
            Right Speaker
          </button>

          <button
            onClick={() =>
              playTone(0)
            }
            className="
              rounded-xl
              bg-purple-600
              px-5
              py-3
              text-white
            "
          >
            Stereo Test
          </button>
        </div>
      </ToolCard>

      <ToolCard>
        <h2 className="mb-4 text-xl font-semibold">
          Microphone Test
        </h2>

        {!micEnabled && (
          <button
            onClick={startMicTest}
            className="
              rounded-xl
              bg-blue-600
              px-5
              py-3
              text-white
            "
          >
            Start Mic Test
          </button>
        )}

        <div
          className="
            mt-4
            h-6
            w-full
            overflow-hidden
            rounded-full
            bg-slate-200
          "
        >
          <div
            className="
              h-full
              bg-green-500
              transition-all
            "
            style={{
              width: `${micLevel}%`,
            }}
          />
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Mic Level:
          {" "}
          {Math.round(micLevel)}
        </p>
      </ToolCard>
    </div>
  );
}