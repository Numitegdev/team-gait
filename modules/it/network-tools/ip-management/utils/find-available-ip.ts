import { IP_POOLS }
from "../constants/ip-pools";

import { findSharedIP }
from "./find-shared-ip";

interface Result {
  recommendedIP: string | null;
  availableIPs: string[];
}

function generateRange(
  startIP: string,
  endIP: string
) {

  const startParts =
    startIP.split(".");

  const endParts =
    endIP.split(".");

  const startSubnet =
    startParts
      .slice(0, 3)
      .join(".");

  const endSubnet =
    endParts
      .slice(0, 3)
      .join(".");

  const start =
    Number(startParts[3]);

  const end =
    Number(endParts[3]);

  const ips: string[] = [];

  if (
    startSubnet === endSubnet
  ) {

    for (
      let i = start;
      i <= end;
      i++
    ) {

      ips.push(
        `${startSubnet}.${i}`
      );

    }

  }

  return ips;
}

export function findAvailableIP(
  room: string,
  network: string,
  usedIPs: string[]
): Result {

  const networkPool =
    (
      IP_POOLS as Record<
        string,
        Record<
          string,
          string[]
        >
      >
    )[network];

  const roomPool =
    networkPool?.[room];

  /*
    ROOM PUNYA POOL
  */

  if (roomPool) {

    const [
      startIP,
      endIP,
    ] = roomPool;

    const roomIPs =
      generateRange(
        startIP,
        endIP
      );

    const roomAvailable =
      roomIPs.filter(
        (ip) =>
          !usedIPs.includes(ip)
      );

    if (
      roomAvailable.length > 0
    ) {

      return {

        recommendedIP:
          roomAvailable[0],

        availableIPs:
          roomAvailable,

      };

    }

  }

  /*
    ROOM TIDAK PUNYA POOL
    ATAU POOL SUDAH PENUH
  */

 const sharedPool =
  findSharedIP(
    network,
    usedIPs
  );

  return {

  recommendedIP:
    sharedPool.recommendedIP,

  availableIPs:
    sharedPool.availableIPs,

};

}