import { createClient }
from "@/lib/supabase/client";
import { Company } from "../types/masters/Company";
import { Location } from "../types/masters/Location";
import { AssetCategory } from "../types/masters/AssetCategory";
import { AssetModel } from "../types/masters/AssetModel";
import { AssetCondition } from "../types/masters/AssetCondition";
import { AssetStatus } from "../types/masters/AssetStatus";

const supabase =
  createClient();

export async function getCompanies(): Promise<Company[]>  {

  const { data, error } =
    await supabase
      .from("companies")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

  if (error) throw error;

  return data;
}

export async function getLocations(): Promise<Location[]>  {

  const { data, error } =
    await supabase
      .from("locations")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

  if (error) throw error;

  return data;
}

export async function getCategories(): Promise<AssetCategory[]> {

  const { data, error } =
    await supabase
      .from("asset_categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

  if (error) throw error;

  return data;
}

export async function getModels(): Promise<AssetModel[]> {

  const { data, error } =
    await supabase
      .from("asset_models")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

  if (error) throw error;

  return data;
}

export async function getConditions(): Promise<AssetCondition[]> {

  const { data, error } =
    await supabase
      .from("asset_conditions")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

  if (error) throw error;

  return data;
}

export async function getStatuses(): Promise<AssetStatus[]> {

  const { data, error } =
    await supabase
      .from("asset_statuses")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

  if (error) throw error;

  return data;
}