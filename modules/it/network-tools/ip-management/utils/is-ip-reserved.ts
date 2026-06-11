import { IP_POOLS }
from "../constants/ip-pools";

export function isIPReserved(
  ip: string
) {

  const parts =
    ip.split(".");

  const lastOctet =
    Number(parts[3]);

  const subnet =
    parts
      .slice(0, 3)
      .join(".");

  for (const network of Object.values(IP_POOLS)) {

    for (const pool of Object.values(network)) {

      const [
        startIP,
        endIP,
      ] = pool;

      const startSubnet =
        startIP
          .split(".")
          .slice(0, 3)
          .join(".");

      if (
        subnet !== startSubnet
      ) {
        continue;
      }

      const start =
        Number(
          startIP.split(".")[3]
        );

      const end =
        Number(
          endIP.split(".")[3]
        );

      if (
        lastOctet >= start &&
        lastOctet <= end
      ) {
        return true;
      }

    }

  }

  return false;

}