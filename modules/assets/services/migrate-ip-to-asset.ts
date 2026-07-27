import { Device }
from "@/modules/it/network-tools/ip-management/types/ip-management";

import { Asset }
from "../types/asset";

export interface MigrateAssetPayload {

  device: Device;

  asset: Partial<Asset>;

}

export async function migrateIPToAsset(

  payload: MigrateAssetPayload

) {

  // Sprint 2
  // Akan kita isi bertahap.

}