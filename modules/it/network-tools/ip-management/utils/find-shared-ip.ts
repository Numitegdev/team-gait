import { isIPReserved }
from "./is-ip-reserved";

export function findSharedIP(
  network: string,
  usedIPs: string[]
) {

  let startIP = "";
  let endIP = "";

  if (
    network ===
    "Network Office"
  ) {

    startIP =
      "192.168.4.114";

    endIP =
      "192.168.4.250";

  } else {

    startIP =
      "192.168.2.70";

    endIP =
      "192.168.3.250";

  }

  const available: string[] =
    [];

  const startParts =
    startIP.split(".");

  const endParts =
    endIP.split(".");

  const subnet =
    startParts
      .slice(0, 3)
      .join(".");

  const start =
    Number(
      startParts[3]
    );

  const end =
    Number(
      endParts[3]
    );

  for (
    let i = start;
    i <= end;
    i++
  ) {

    const ip =
      `${subnet}.${i}`;

    if (
      usedIPs.includes(ip)
    ) {
      continue;
    }

    if (
      isIPReserved(ip)
    ) {
      continue;
    }

    available.push(ip);

  }

  return {
    recommendedIP:
      available[0] || null,

    availableIPs:
      available.slice(0, 10),
  };

}