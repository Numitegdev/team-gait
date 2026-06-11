export async function addWatermark(
  file: File,
  lokasi: string
): Promise<File> {

  return new Promise(
    (resolve) => {

      const img =
        new Image();

      img.onload =
        () => {

          const canvas =
            document.createElement(
              "canvas"
            );

          canvas.width =
            img.width;

          canvas.height =
            img.height;

          const ctx =
            canvas.getContext(
              "2d"
            );

          if (!ctx)
            return;

          ctx.drawImage(
            img,
            0,
            0
          );

          ctx.fillStyle =
            "rgba(255,255,255,0.9)";

          ctx.font =
            "28px Arial";

          ctx.fillText(
            lokasi,
            20,
            img.height - 60
          );

          ctx.fillText(
            new Date()
              .toLocaleString(),
            20,
            img.height - 20
          );

          canvas.toBlob(
            (blob) => {

              if (!blob)
                return;

              resolve(
                new File(
                  [blob],
                  file.name,
                  {
                    type:
                      "image/jpeg",
                  }
                )
              );

            },
            "image/jpeg",
            0.9
          );

        };

      img.src =
        URL.createObjectURL(
          file
        );

    }
  );

}