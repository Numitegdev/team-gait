import { Company } from "./masters/Company";
import { Location } from "./masters/Location";
import { AssetCategory } from "./masters/AssetCategory";
import { AssetModel } from "./masters/AssetModel";
import { AssetCondition } from "./masters/AssetCondition";
import { AssetStatus } from "./masters/AssetStatus";

export interface AssetListItem {

  id: number;

  asset_code: string;

  asset_name: string;

  barcode: string | null;

  brand: string | null;

  serial_number: string | null;

  company: Company | null;

  location: Location | null;

  category: AssetCategory | null;

  model: AssetModel | null;

  condition: AssetCondition | null;

  status: AssetStatus | null;

}