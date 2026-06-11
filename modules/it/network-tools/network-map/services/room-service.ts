import { createClient }
from "@/lib/supabase/client";

const supabase =
  createClient();

export async function getRoomByCode(
  roomCode: string
) {

  console.log(
    "SEARCH ROOM:",
    roomCode
  );

  const { data, error } =
    await supabase
      .from("rooms")
      .select("*")
      .eq(
        "room_code",
        roomCode
      )
      .single();

  console.log(
    "DATA:",
    data
  );

  console.log(
    "ERROR:",
    error
  );

  if (error) {
    return null;
  }

  return data;
}