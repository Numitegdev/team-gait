"use client";

import { Device }
from "../types/ip-management";

interface Props {
  devices: Device[];
}

export function IPManagementSummary({
  devices,
}: Props) {

  const totalDevice =
    devices.length;

  const officeDevice =
    devices.filter(
      (item) =>
        item.jenis_network ===
        "Network Office"
    ).length;

  const serverDevice =
    devices.filter(
      (item) =>
        item.jenis_network ===
        "Network Server"
    ).length;

  const dbUtama =
    devices.filter(
      (item) =>
        item.fungsional ===
        "DB_Utama"
    ).length;

  const dbMirror =
    devices.filter(
      (item) =>
        item.fungsional ===
        "DB_Mirror"
    ).length;

  const whitelistDevice =
    devices.filter(
      (item) =>
        item.whitelist !== "-"
    ).length;

  const cards = [

    {
      title: "Total Device",
      value: totalDevice,
    },

    {
      title: "Office",
      value: officeDevice,
    },

    {
      title: "Server",
      value: serverDevice,
    },

    {
      title: "DB Utama",
      value: dbUtama,
    },

    {
      title: "DB Mirror",
      value: dbMirror,
    },

    {
      title: "Whitelist",
      value: whitelistDevice,
    },

  ];

  return (

    <div
      className="
        grid
        gap-4
        md:grid-cols-3
        xl:grid-cols-6
      "
    >

      {cards.map((card) => (

        <div
          key={card.title}
          className="
            rounded-2xl
            border
            bg-white
            p-5
            shadow-sm
          "
        >

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            {card.title}
          </p>

          <h2
            className="
              mt-2
              text-3xl
              font-bold
            "
          >
            {card.value}
          </h2>

        </div>

      ))}

    </div>

  );
}