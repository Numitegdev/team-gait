"use client";

import { useEffect, useState } from "react";
import { Company } from "../types/masters/Company";
import { Location } from "../types/masters/Location";
import { AssetCategory } from "../types/masters/AssetCategory";
import { AssetModel } from "../types/masters/AssetModel";
import { AssetCondition } from "../types/masters/AssetCondition";
import { AssetStatus } from "../types/masters/AssetStatus";
import {

  getCompanies,

  getLocations,

  getCategories,

  getModels,

  getConditions,

  getStatuses,

} from "../services/master-service";

export function useAssetMaster() {

  const [loading, setLoading] =
    useState(true);

  const [companies, setCompanies] =
  useState<Company[]>([]);

  const [locations, setLocations] =
  useState<Location[]>([]);

const [categories, setCategories] =
  useState<AssetCategory[]>([]);

 const [models, setModels] =
  useState<AssetModel[]>([]);

const [conditions, setConditions] =
  useState<AssetCondition[]>([]);

const [statuses, setStatuses] =
  useState<AssetStatus[]>([]);

  async function loadMaster() {

    try {

      setLoading(true);

      const [

        companyData,

        locationData,

        categoryData,

        modelData,

        conditionData,

        statusData,

      ] = await Promise.all([

        getCompanies(),

        getLocations(),

        getCategories(),

        getModels(),

        getConditions(),

        getStatuses(),

      ]);

      setCompanies(companyData ?? []);

      setLocations(locationData ?? []);

      setCategories(categoryData ?? []);

      setModels(modelData ?? []);

      setConditions(conditionData ?? []);

      setStatuses(statusData ?? []);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadMaster();

  }, []);

  return {

    loading,

    companies,

    locations,

    categories,

    models,

    conditions,

    statuses,

    reload: loadMaster,

  };

}