"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { ToolCard } from "@/modules/it/shared/components/tool-card";

import { ToolHeader } from "@/modules/it/shared/components/tool-header";
import {
  getCameraStream,
  stopCameraStream,
} from "./services/camera.service";
export default function WebcamTestPage() {
  const videoRef =
    useRef<HTMLVideoElement>(null);

  const [stream, setStream] =
    useState<MediaStream | null>(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function startCamera() {
    try {
      setLoading(true);

      const mediaStream =
         await getCameraStream();(
          {
            video: true,
            audio: false,
          }
        );

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject =
          mediaStream;
      }

      setError("");
    } catch (err) {
      setError(
        "Webcam tidak tersedia atau permission ditolak"
      );
    } finally {
      setLoading(false);
    }
  }

  function stopCamera() {
        stopCameraStream(stream);

    setStream(null);
  }

  useEffect(() => {
    return () => {
        stopCameraStream(stream);
    };
  }, [stream]);

  return (
    <div className="space-y-6">
      <ToolHeader
        title="Webcam Test"
        description="Test kamera perangkat"
      />

      <ToolCard>
        <div className="space-y-4">
          {/* VIDEO */}
          <div
            className="
              aspect-video
              overflow-hidden
              rounded-2xl
              bg-black
              flex
              items-center
              justify-center
            "
          >
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <p className="text-slate-500">
                Camera Preview
              </p>
            )}
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="
                rounded-xl
                border
                border-red-500/20
                bg-red-500/10
                p-4
                text-red-500
              "
            >
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={startCamera}
              disabled={loading}
              className="
                rounded-xl
                bg-blue-600
                px-5
                py-3
                text-white
                transition-all
                hover:bg-blue-700
                disabled:opacity-50
              "
            >
              {loading
                ? "Loading..."
                : "Start Camera"}
            </button>

            <button
              onClick={stopCamera}
              className="
                rounded-xl
                bg-slate-800
                px-5
                py-3
                text-white
                transition-all
                hover:bg-slate-700
              "
            >
              Stop Camera
            </button>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}