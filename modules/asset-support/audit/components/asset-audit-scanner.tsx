
"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Camera, LoaderCircle, X } from "lucide-react";

type AssetAuditScannerProps = {
  onScan: (assetCode: string) => void;
  onClose: () => void;
};

export default function AssetAuditScanner({
  onScan,
  onClose,
}: AssetAuditScannerProps) {
  const reactId = useId();
  const scannerId = `asset-audit-scanner-${reactId.replace(/:/g, "")}`;

  const scannerRef = useRef<any>(null);
  const handledRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        if (cancelled) return;

        const scanner = new Html5Qrcode(scannerId);
        scannerRef.current = scanner;

        const cameras = await Html5Qrcode.getCameras();

        if (cancelled) return;

        if (!cameras.length) {
          throw new Error("Kamera tidak ditemukan pada perangkat ini.");
        }

        const backCamera =
          cameras.find((camera: { label: string }) =>
            /back|rear|environment|belakang/i.test(camera.label)
          ) ?? cameras[cameras.length - 1];

        await scanner.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: { width: 240, height: 180 },
            aspectRatio: 1.333,
          },
          async (decodedText: string) => {
            if (handledRef.current || cancelled) return;

            const assetCode = decodedText.trim();

            if (!assetCode) return;

            handledRef.current = true;

            try {
              await scanner.stop();
            } catch {
              // Scanner mungkin sudah berhenti.
            }

            if (!cancelled) {
              onScan(assetCode);
            }
          },
          () => {
            // Abaikan pesan ketika kode belum terbaca.
          }
        );

        if (!cancelled) {
          setLoading(false);
        } else {
          try {
            if (scanner.isScanning) {
              await scanner.stop();
            }
          } catch {
            // Kamera mungkin sudah berhenti.
          }

          try {
            scanner.clear();
          } catch {
            // Elemen scanner mungkin sudah dibersihkan.
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Gagal menjalankan scanner:", err);

          setError(
            err instanceof Error
              ? err.message
              : "Scanner gagal dijalankan. Periksa izin kamera."
          );

          setLoading(false);
        }
      }
    }

    void startScanner();

    return () => {
      cancelled = true;

      const scanner = scannerRef.current;

      if (scanner) {
        void (async () => {
          try {
            if (scanner.isScanning) {
              await scanner.stop();
            }
          } catch {
            // Kamera mungkin sudah berhenti.
          }

          try {
            await scanner.clear();
          } catch {
            // Elemen scanner mungkin sudah dibersihkan.
          }
        })();
      }
    };
  }, [scannerId, onScan]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            Scan Kode Aset
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Arahkan kamera ke QR atau barcode aset.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Tutup scanner"
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gray-950">
        <div id={scannerId} className="w-full" />

        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-950 text-white">
            <LoaderCircle className="animate-spin" size={28} />

            <p className="text-sm">
              Menyiapkan kamera...
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <p>{error}</p>

          <p className="mt-1">
            Pastikan izin kamera diberikan dan halaman dibuka melalui
            HTTPS atau localhost.
          </p>
        </div>
      )}

      {!error && !loading && (
        <p className="mt-3 flex items-center gap-2 text-sm text-green-700">
          <Camera size={16} />
          Kamera aktif. Arahkan ke kode aset.
        </p>
      )}
    </div>
  );
}
