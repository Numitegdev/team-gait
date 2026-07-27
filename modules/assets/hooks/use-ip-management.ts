import {
  useEffect,
  useState,
} from "react";

import {
  getAvailableIPs,
  
} from "../services/ip-management-service";

import {
  IPManagement,
  
} from "../types/IPManagement";

export function useIPManagement(
  currentAssetId?: number 
) {

  const [ips, setIPs] =
    useState<IPManagement[]>([]);

  async function loadIPs() {

    try {

      const data =
        await getAvailableIPs(
          currentAssetId
        );

      setIPs(data);

    } catch (error) {

      console.error(error);

    }

  }

  useEffect(() => {

    loadIPs();

  }, [currentAssetId]);

  return {

    ips,

    reloadIPs: loadIPs,

  };

}