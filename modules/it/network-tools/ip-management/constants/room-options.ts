
export const rooms = [
{
    code: "R1",
    name: "Pos GA",
  },
  {
    code: "R2",
    name: "Gudang Mapuk",
  },
  {
    code: "R3",
    name: "Voucher",
  },
  {
    code: "R4",
    name: "Mushola",
  },
  {
    code: "R5",
    name: "Gudang GA",
  },
   {
    code: "R6",
    name: "Data Analis",
  },
  {
    code: "R7",
    name: "HRD",
  },
  {
    code: "R8",
    name: "UKS",
  },
  {
    code: "R9",
    name: "Ruang Meeting",
  },
  {
    code: "R10",
    name: "Finance",
  },
  {
    code: "R11",
    name: "Server Baru",
  },
  {
    code: "R12",
    name: "ACT",
  },
  {
    code: "R13",
    name: "Gudang Produksi",
  },
  {
    code: "R14",
    name: "Ruang Admin",
  },
  {
    code: "R15",
    name: "Ruang DIrektur",
  },
  {
    code: "R16",
    name: "SPV & Manager",
  },
  {
    code: "R17",
    name: "Gudang Mentah",
  },
  {
    code: "R18",
    name: "Operator",
  },
  {
    code: "R19",
    name: "Server Utama",
  },
  {
    code: "R20",
    name: "Ruang Marketing Briza",
  },
  {
    code: "R21",
    name: "Ruang Admin Briza 1",
  },
  {
    code: "R22",
    name: "Ruang Admin Briza 2",
  },
  {
    code: "R23",
    name: "Ruang CS OP Briza",
  },
  {
    code: "R24",
    name: "Ruang Gudang Briza",
  },
  {
    code: "R25",
    name: "Pak Bos",
  },
  {
    code: "R26",
    name: "Telemarketing & CS",
  },
];
export const getRoomName = (
  code: string
) => {
  return (
    rooms.find(
      (room) => room.code === code
    )?.name ?? code
  );
};