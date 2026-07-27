import {
  CreateAssetHistoryPayload,
} from "../types/CreateAssetHistoryPayload";

import {
  HISTORY_ACTION,
} from "../constants/history-action";

export function buildAssetHistory(

  oldAsset: any,

  newAsset: any,

  userId?: string | null

): CreateAssetHistoryPayload | null {

  const history: CreateAssetHistoryPayload = {

    asset_id: oldAsset.id,

    action_type:
      HISTORY_ACTION.UPDATE,

    created_by:
      userId ?? null,

    remarks:
      "Asset diperbarui.",

  };

  let changed = false;

    if (

    oldAsset.company_id !==

    newAsset.company_id

  ) {

    history.old_company_id =
      oldAsset.company_id;

    history.new_company_id =
      newAsset.company_id;

    changed = true;

  }

  if (

  oldAsset.location_id !==

  newAsset.location_id

) {

  history.old_location_id =
    oldAsset.location_id;

  history.new_location_id =
    newAsset.location_id;

  changed = true;

}

if (

  oldAsset.condition_id !==

  newAsset.condition_id

) {

  history.old_condition_id =
    oldAsset.condition_id;

  history.new_condition_id =
    newAsset.condition_id;

  changed = true;

}

if (

  oldAsset.status_id !==

  newAsset.status_id

) {

  history.old_status_id =
    oldAsset.status_id;

  history.new_status_id =
    newAsset.status_id;

  changed = true;

}

if (

  oldAsset.ip_management_id !==

  newAsset.ip_management_id

) {

 history.old_ip_management_id =
  oldAsset.ip_management_id;

  history.new_ip_management_id =
    newAsset.ip_management_id;

  changed = true;

}

return changed

  ? history

  : null;

}