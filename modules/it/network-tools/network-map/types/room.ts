export interface Room {
  id: number;

  room_code: string;
  room_name: string;

  building: string;
  floor: string;

  pool_start: string;
  pool_end: string;

  cable_code: string;
  network_type: string;
}