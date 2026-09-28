"use client";

import {
  getActiveAssets,
} from "@/modules/assets/services/asset-service";

import {

  getCompanies,

  getLocations,

} from "@/modules/assets/services/master-service";

import {

  useState,

} from "react";

import {

  createMutation,

} from "../services/asset-mutation-service";

import { Asset } from "@/modules/assets/types/asset";
import { Location } from "@/modules/assets/types/masters/Location";
import { Company } from "@/modules/assets/types/masters/Company";


export function useMutationForm() {


const [

  assets,

  setAssets,

] = useState<Asset[]>([]);

const [

  companies,

  setCompanies,

] = useState<Company[]>([]);

const [

  locations,

  setLocations,

] = useState<Location[]>([]);
    
  const [

    loading,

    setLoading,

  ] = useState(false);

  const [

    form,

    setForm,

  ] = useState({

    asset_id: 0,

    from_company_id: 0,

    from_location_id: 0,

    to_company_id: 0,

    to_location_id: 0,

    remarks: "",

  });

  function handleChange(

    field: string,

    value: any

  ) {

    setForm(

      (prev) => ({

        ...prev,

        [field]: value,

      })

    );

  }

 async function handleSubmit() {

  try {

    setLoading(true);

    console.log("Submit", form);

    const result = await createMutation({

      ...form,

    });

    console.log(result);

    reset();

    return true;

  } catch (err) {

    console.error(err);

    alert(

      err instanceof Error

        ? err.message

        : "Terjadi kesalahan."

    );

    return false;

  } finally {

    setLoading(false);

  }

}


  function reset() {

    setForm({

      asset_id: 0,

      from_company_id: 0,

      from_location_id: 0,

      to_company_id: 0,

      to_location_id: 0,

      remarks: "",

    });

  }

async function loadMasterData() {

const [
  assets,
  companies,
  locations,
] = await Promise.all([
  getActiveAssets(),
  getCompanies(),
  getLocations(),
]);

  setAssets(assets);

  setCompanies(companies);

  setLocations(locations);

}
  


return {

  form,

  loading,

  assets,

  companies,

  locations,

  loadMasterData,

  handleChange,

  handleSubmit,

  reset,

};

}