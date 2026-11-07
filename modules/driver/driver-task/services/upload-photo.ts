
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const MAX_FILE_SIZE = 200 * 1024; // 200 KB
const MAX_DIMENSION = 1600;
const MIN_DIMENSION = 480;

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  const bitmap = await createImageBitmap(file);

  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Browser tidak mendukung kompresi gambar.");
    }

    // Batasi resolusi awal maksimal 1600px
    const originalMax = Math.max(bitmap.width, bitmap.height);

    let scale = Math.min(1, MAX_DIMENSION / originalMax);

    let width = Math.round(bitmap.width * scale);
    let height = Math.round(bitmap.height * scale);

    const qualities = [0.82, 0.72, 0.62, 0.52, 0.42, 0.32];

    // Kompresi bertahap sampai maksimal 200 KB
    for (let attempt = 0; attempt < 12; attempt++) {
      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      ctx.drawImage(
        bitmap,
        0,
        0,
        width,
        height
      );

      for (const quality of qualities) {
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (result) => {
              if (result) {
                resolve(result);
              } else {
                reject(new Error("Gagal mengompres gambar."));
              }
            },
            "image/webp",
            quality
          );
        });

        if (blob.type !== "image/webp") {
          throw new Error("Browser tidak mendukung format WebP.");
        }

        if (blob.size <= MAX_FILE_SIZE) {
          return new File(
            [blob],
            `${Date.now()}.webp`,
            {
              type: "image/webp",
              lastModified: Date.now(),
            }
          );
        }
      }

      // Jika masih lebih dari 200 KB, kecilkan resolusi
      if (Math.max(width, height) <= MIN_DIMENSION) {
        break;
      }

      width = Math.max(1, Math.round(width * 0.85));
      height = Math.max(1, Math.round(height * 0.85));

      // Jangan turunkan resolusi di bawah batas minimum
      const currentMax = Math.max(width, height);

      if (currentMax < MIN_DIMENSION) {
        const resizeScale = MIN_DIMENSION / currentMax;

        width = Math.round(width * resizeScale);
        height = Math.round(height * resizeScale);
      }
    }

    throw new Error(
      "Foto terlalu sulit dikompres hingga 200 KB. Silakan gunakan foto lain."
    );
  } finally {
    bitmap.close();
  }
}

export async function uploadCompletionPhoto(file: File) {
  // 1. Kompres foto sebelum upload
  const compressedFile = await compressImage(file);

  console.log("FOTO ASLI:", 
    (file.size / 1024).toFixed(2), "KB"
  );

  console.log("FOTO SETELAH KOMPRESI:",
    (compressedFile.size / 1024).toFixed(2), "KB"
  );

  // 2. Upload hasil kompresi ke Supabase
  const fileName =
    `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

  const { error } = await supabase.storage
    .from("driver_photos")
    .upload(fileName, compressedFile, {
      upsert: false,
      contentType: "image/webp",
      cacheControl: "3600",
    });

  if (error) {
    throw error;
  }

  // 3. Ambil URL publik
  const { data } = supabase.storage
    .from("driver_photos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
