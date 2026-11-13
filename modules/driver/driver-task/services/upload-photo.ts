
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const MAX_FILE_SIZE = 200 * 1024;
const MAX_DIMENSION = 1600;
const MIN_DIMENSION = 480;

const QUALITIES = [0.82, 0.72, 0.62, 0.52, 0.42, 0.32, 0.24];

type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  cleanup: () => void;
};

// 1. Baca foto dengan metode modern, lalu fallback ke Image()
async function decodeImage(file: File): Promise<DecodedImage> {
  // Metode pertama: createImageBitmap
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);

      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close(),
      };
    } catch (error) {
      console.warn(
        "createImageBitmap gagal, mencoba fallback:",
        error
      );
    }
  }

  // Metode kedua: HTMLImageElement
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();

    image.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error("Browser tidak bisa membaca foto."));
    });

    if (!image.naturalWidth || !image.naturalHeight) {
      throw new Error("Resolusi foto tidak valid.");
    }

    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      cleanup: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

// 2. Konversi canvas menjadi Blob
function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Gagal mengompres foto."));
          return;
        }

        resolve(blob);
      },
      type,
      quality
    );
  });
}

// 3. Kompres foto dengan fallback WebP dan JPEG
async function compressImage(file: File): Promise<File> {
  if (
    !file.type.startsWith("image/") &&
    !/\.(jpg|jpeg|png|webp|heic|heif)$/i.test(file.name)
  ) {
    throw new Error("File harus berupa gambar.");
  }

  let decoded: DecodedImage;

  try {
    decoded = await decodeImage(file);
  } catch (error) {
    console.error("Gagal membaca foto:", error);

    throw new Error(
      "Foto tidak bisa dibaca oleh browser. Jika menggunakan iPhone, coba pilih foto JPEG atau ubah pengaturan kamera ke Most Compatible."
    );
  }

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Browser tidak mendukung pemrosesan foto.");
    }

    // Batasi ukuran awal maksimal 1600px
    const originalMax = Math.max(
      decoded.width,
      decoded.height
    );

    const initialScale = Math.min(
      1,
      MAX_DIMENSION / originalMax
    );

    let width = Math.round(decoded.width * initialScale);
    let height = Math.round(decoded.height * initialScale);

    // WebP dicoba lebih dahulu, JPEG sebagai fallback
    const formats = [
      { type: "image/webp", extension: "webp" },
      { type: "image/jpeg", extension: "jpg" },
    ];

    while (true) {
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      ctx.drawImage(
        decoded.source,
        0,
        0,
        width,
        height
      );

      for (const format of formats) {
        for (const quality of QUALITIES) {
          const blob = await canvasToBlob(
            canvas,
            format.type,
            quality
          );

          // Pastikan browser benar-benar menghasilkan format yang diminta
          if (blob.type !== format.type) {
            continue;
          }

          if (blob.size <= MAX_FILE_SIZE) {
            const compressedFile = new File(
              [blob],
              `${Date.now()}.${format.extension}`,
              {
                type: format.type,
                lastModified: Date.now(),
              }
            );

            console.log(
              "FORMAT FOTO:",
              format.type
            );

            return compressedFile;
          }
        }
      }

      // Jika resolusi sudah minimum, hentikan
      const currentMax = Math.max(width, height);

      if (currentMax <= MIN_DIMENSION) {
        break;
      }

      // Turunkan resolusi bertahap tanpa melewati 480px
      const nextMax = Math.max(
        MIN_DIMENSION,
        Math.round(currentMax * 0.85)
      );

      const scale = nextMax / currentMax;

      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    throw new Error(
      "Foto tidak berhasil dikompres hingga 200 KB. Silakan gunakan foto lain."
    );
  } finally {
    decoded.cleanup();
  }
}

// 4. Upload foto ke Supabase
export async function uploadCompletionPhoto(file: File) {
  console.log(
    "FOTO ASLI:",
    (file.size / 1024).toFixed(2),
    "KB"
  );

  const compressedFile = await compressImage(file);

  console.log(
    "FOTO SETELAH KOMPRESI:",
    (compressedFile.size / 1024).toFixed(2),
    "KB"
  );

  if (compressedFile.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran foto masih melebihi 200 KB.");
  }

  const fileName =
    `${Date.now()}-${Math.random().toString(36).slice(2)}.${
      compressedFile.type === "image/webp" ? "webp" : "jpg"
    }`;

  const { error } = await supabase.storage
    .from("driver_photos")
    .upload(fileName, compressedFile, {
      upsert: false,
      contentType: compressedFile.type,
      cacheControl: "3600",
    });

  if (error) {
    console.error("UPLOAD FOTO GAGAL:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from("driver_photos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
