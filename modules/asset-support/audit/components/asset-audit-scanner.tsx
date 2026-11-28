
"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  LoaderCircle,
  AlertTriangle,
} from "lucide-react";

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
          throw new Error(
            "Kamera tidak ditemukan pada perangkat ini."
          );
        }

        const backCamera =
          cameras.find((camera: { label: string }) =>
            /back|rear|environment|belakang/i.test(camera.label)
          ) ?? cameras[cameras.length - 1];

        await scanner.start(
          backCamera.id,
          {
            fps: 12,

            // Kotak scan menyesuaikan area kamera.
            qrbox: (
              viewfinderWidth: number,
              viewfinderHeight: number
            ) => {
              const size = Math.floor(
                Math.min(
                  viewfinderWidth * 0.78,
                  viewfinderHeight * 0.55,
                  320
                )
              );

              return {
                width: size,
                height: size,
              };
            },

            // Biarkan library menyesuaikan rasio kamera.
          },
          async (decodedText: string) => {
            if (handledRef.current || cancelled) return;

            const assetCode = decodedText.trim();

            if (!assetCode) return;

            handledRef.current = true;

            try {
              if (scanner.isScanning) {
                await scanner.stop();
              }
            } catch {
              // Scanner mungkin sudah berhenti.
            }

            if (!cancelled) {
              onScan(assetCode);
            }
          },
          () => {
            // Abaikan pesan ketika QR belum terbaca.
          }
        );

        if (!cancelled) {
          setLoading(false);
        } else {
          try {
            if (scanner.isScanning) {
              await scanner.stop();
            }

            await scanner.clear();
          } catch {
            // Kamera mungkin sudah berhenti.
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
    <div className="fixed inset-0 z-[150] flex h-[100dvh] flex-col overflow-hidden bg-black text-white overscroll-contain">

      {/* HEADER */}
      <header className="relative z-20 flex shrink-0 items-center gap-3 border-b border-white/10 bg-gray-950 px-4 pb-4 pt-[calc(env(safe-area-inset-top)+16px)]">

        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Kembali ke Asset Audit"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold">
            Scan Kode Aset
          </h2>

          <p className="mt-0.5 text-xs text-gray-400">
            Arahkan kamera ke QR atau barcode aset.
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
          <Camera size={21} />
        </div>

      </header>

      {/* CAMERA AREA */}
      <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden bg-black">

        <div
          id={scannerId}
          className="
            h-full
            w-full
            overflow-hidden
            [&_video]:h-full
            [&_video]:w-full
            [&_video]:object-cover
            [&_video]:object-center
            [&_video]:!border-0
          "
        />

        {/* LOADING */}
        {loading && !error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-gray-950 text-white">

            <LoaderCircle
              className="animate-spin text-blue-400"
              size={42}
            />

            <div className="text-center">
              <p className="font-semibold">
                Menyiapkan kamera...
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Mohon tunggu sebentar.
              </p>
            </div>

          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-950 p-6">

            <div className="w-full max-w-sm rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                <AlertTriangle size={28} />
              </div>

              <h3 className="mt-4 font-bold text-white">
                Kamera tidak dapat dijalankan
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                {error}
              </p>

              <p className="mt-3 text-xs leading-relaxed text-gray-400">
                Pastikan izin kamera diberikan dan halaman
                dibuka melalui HTTPS atau localhost.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700"
              >
                <ArrowLeft size={18} />
                Kembali ke Asset Audit
              </button>

            </div>
          </div>
        )}

        {/* SCAN GUIDE */}
        {!loading && !error && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">

            <div className="relative aspect-square w-[78vw] max-w-[320px] rounded-3xl border-2 border-blue-400/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]">

              <span className="absolute -left-[2px] -top-[2px] h-9 w-9 rounded-tl-3xl border-l-4 border-t-4 border-blue-400" />

              <span className="absolute -right-[2px] -top-[2px] h-9 w-9 rounded-tr-3xl border-r-4 border-t-4 border-blue-400" />

              <span className="absolute -bottom-[2px] -left-[2px] h-9 w-9 rounded-bl-3xl border-b-4 border-l-4 border-blue-400" />

              <span className="absolute -bottom-[2px] -right-[2px] h-9 w-9 rounded-br-3xl border-b-4 border-r-4 border-blue-400" />

            </div>

            <p className="mt-7 rounded-full bg-black/65 px-5 py-2.5 text-center text-sm font-medium text-white backdrop-blur-sm">
              Posisikan kode aset di dalam kotak
            </p>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="relative z-20 shrink-0 border-t border-white/10 bg-gray-950 px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-4">

        {!error ? (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            {loading
              ? "Menghubungkan kamera..."
              : "Kamera aktif. Siap melakukan scan."}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400">
            Gunakan input Asset Code secara manual.
          </p>
        )}

      </footer>

    </div>
  );
}
