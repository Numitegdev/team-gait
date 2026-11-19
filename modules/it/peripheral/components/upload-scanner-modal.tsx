
"use client";

import { useEffect, useRef, useState } from "react";
import { useScanner } from "../hooks/use-scanner";

interface Props {
  open: boolean;
  peripheralId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadScannerModal({
  open,
  peripheralId,
  onClose,
  onSuccess,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { upload } = useScanner();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setFile(null);
      setDragging(false);
      setError("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open]);

  if (!open) return null;

  const handleUpload = async () => {
    if (!file || !peripheralId || uploading) return;

    setUploading(true);
    setError("");

    try {
      await upload(peripheralId, file);

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Scanner upload error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Upload gagal. Silakan periksa file dan coba lagi."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[450px] space-y-4 rounded-xl bg-white p-6">
        <h2 className="text-lg font-semibold">
          Upload Scanner
        </h2>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);

            const droppedFile = e.dataTransfer.files?.[0];

            if (droppedFile) {
              setFile(droppedFile);
              setError("");
            }
          }}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
            dragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            id="scanner-upload"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setError("");
            }}
          />

          <label
            htmlFor="scanner-upload"
            className="block cursor-pointer"
          >
            <div className="text-sm text-gray-500">
              Drag & Drop file scanner JSON
              <br />
              atau klik untuk memilih file
            </div>

            {file && (
              <div className="mt-3 font-medium text-green-600">
                {file.name}
              </div>
            )}
          </label>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={uploading}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            onClick={handleUpload}
            disabled={!file || !peripheralId || uploading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Mengupload..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
