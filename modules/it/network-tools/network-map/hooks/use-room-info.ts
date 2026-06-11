"use client";

import { useState } from "react";

import { Room }
from "../types/room";

import { getRoomByCode }
from "../services/room-service";

export function useRoomInfo() {

  const [
    selectedRoom,
    setSelectedRoom,
  ] = useState("");

  const [
    roomInfo,
    setRoomInfo,
  ] = useState<Room | null>(
    null
  );

  async function loadRoom(
    roomCode: string
  ) {

    setSelectedRoom(
      roomCode
    );

    const data =
      await getRoomByCode(
        roomCode
      );

    setRoomInfo(data);
  }

  return {
    selectedRoom,
    roomInfo,
    loadRoom,
  };
}