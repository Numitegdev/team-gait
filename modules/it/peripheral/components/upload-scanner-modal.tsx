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

  const [file, setFile] =
    useState<File | null>(null);

  const { upload } =
    useScanner();
const [dragging, setDragging] =
  useState(false);

const fileInputRef =
  useRef<HTMLInputElement>(null);

  useEffect(() => {

  if (open) {

    setFile(null);

    setDragging(false);

    if (fileInputRef.current) {

      fileInputRef.current.value = "";

    }

  }

}, [open]);
  
  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl p-6 w-[450px] space-y-4">

        <h2 className="text-lg font-semibold">
          Upload Scanner
        </h2>

      <div
  onDragOver={(e) => {
    e.preventDefault();
    setDragging(true);
  }}
  onDragLeave={() => {
    setDragging(false);
  }}
  onDrop={(e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile =
      e.dataTransfer.files?.[0];

    if (droppedFile) {
      setFile(droppedFile);
    }
  }}
  className={`border-2 border-dashed rounded-xl p-8 text-center transition
    ${
      dragging
        ? "border-blue-500 bg-blue-50"
        : "border-gray-300"
    }`}
>

<input
  ref={fileInputRef}
  type="file"
  accept=".json"
  className="hidden"
  id="scanner-upload"
  onChange={(e) =>
    setFile(
      e.target.files?.[0] ?? null
    )
  }
/>

  <label
    htmlFor="scanner-upload"
    className="cursor-pointer block"
  >

    <div className="text-sm text-gray-500">

      Drag & Drop file scanner JSON
      <br />
      atau klik untuk memilih file

    </div>

    {file && (

      <div className="mt-3 text-green-600 font-medium">

        {file.name}

      </div>

    )}

  </label>

</div>
        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Batal
          </button>

          <button
            onClick={async () => {

              if (
                !file ||
                !peripheralId
              )
                return;

              await upload(
                peripheralId,
                file
              );

              
              setFile(null);

                if (fileInputRef.current) {

                    fileInputRef.current.value = "";

                }

              onSuccess();

              onClose();

            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Upload
          </button>

        </div>

      </div>

    </div>

  );

}