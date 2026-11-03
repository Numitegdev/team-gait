
const MAX_SIZE = 200 * 1024; // 200 KB
const MAX_DIMENSION = 1920;

export async function addWatermark(
  file: File,
  lokasi: string
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        let scale = Math.min(
          1,
          MAX_DIMENSION / Math.max(img.width, img.height)
        );

        while (scale > 0) {
          const canvas = document.createElement("canvas");

          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            throw new Error("Gagal memproses gambar.");
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Watermark lokasi dan tanggal
          const fontSize = Math.max(12, canvas.width * 0.018);

          ctx.font = `bold ${fontSize}px Arial`;
          ctx.fillStyle = "rgba(255,255,255,0.95)";
          ctx.shadowColor = "rgba(0,0,0,0.7)";
          ctx.shadowBlur = 3;

          ctx.fillText(
            lokasi,
            20,
            canvas.height - 60
          );

          ctx.fillText(
            new Date().toLocaleString("id-ID"),
            20,
            canvas.height - 20
          );

          // Coba beberapa tingkat kualitas
          for (let quality = 0.82; quality >= 0.34; quality -= 0.08) {
            const blob = await new Promise<Blob>((res, rej) => {
              canvas.toBlob(
                (result) => {
                  if (!result) {
                    rej(new Error("Gagal mengompres gambar."));
                    return;
                  }

                  res(result);
                },
                "image/jpeg",
                quality
              );
            });

            if (blob.size <= MAX_SIZE) {
              const fileName =
                file.name.replace(/\.[^/.]+$/, "") + ".jpg";

              resolve(
                new File([blob], fileName, {
                  type: "image/jpeg",
                })
              );

              return;
            }
          }

          // Jika masih lebih dari 200 KB,
          // perkecil resolusi dan coba lagi.
          scale *= 0.85;
        }

        throw new Error(
          "Foto tidak dapat dikompres hingga maksimal 200 KB."
        );

      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Gagal membaca foto."));
    };

    img.src = objectUrl;
  });
}
