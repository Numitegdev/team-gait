import { Asset } from "./asset";

import { Company } from "./masters/Company";
import { Location } from "./masters/Location";
import { AssetCategory } from "./masters/AssetCategory";
import { AssetModel } from "./masters/AssetModel";
import { AssetCondition } from "./masters/AssetCondition";
import { AssetStatus } from "./masters/AssetStatus";
import { IPManagement } from "./IPManagement";

export interface AssetDetail
  extends Asset {

  company:
    Company | null;

  location:
    Location | null;

  category:
    AssetCategory | null;

  model:
    AssetModel | null;

  condition:
    AssetCondition | null;

  status:
    AssetStatus | null;

    ip_management: IPManagement | null;

}