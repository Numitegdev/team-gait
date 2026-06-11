export async function imageUrlToBase64(
  url: string
) {

  const response =
    await fetch(url);

  const blob =
    await response.blob();

  return await new Promise<string>(
    (resolve) => {

      const reader =
        new FileReader();

      reader.onloadend =
        () =>

          resolve(
            reader.result as string
          );

      reader.readAsDataURL(
        blob
      );

    }
  );

}