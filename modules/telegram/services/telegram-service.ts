import {

  TELEGRAM_BOT_TOKEN,

  TELEGRAM_CHAT_ID,

}
from "../constants/telegram-config";

export async function sendTelegramMessage(
  text: string
) {


  const response =
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
        }),
      }
    );

  const result =
    await response.json();

  console.log("SEND MESSAGE:");
 console.log(JSON.stringify(result, null, 2));

  if (!result.ok) {
    throw new Error(result.description);
  }

  return result;
}

export async function sendTelegramPhoto(
  photoUrl: string,
  caption: string
) {

  const response =
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          photo: photoUrl,
          caption,
        }),
      }
    );

  const result =
    await response.json();

  console.log("SEND PHOTO:");
  console.log(result);

  if (!result.ok) {
    throw new Error(result.description);
  }

  return result;
}