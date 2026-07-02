import { createClient } from "@/lib/supabase/client";
import { Peripheral } from "../types/peripheral.types";
const supabase = createClient();

export async function getPeripherals(): Promise<Peripheral[]> {
  const { data, error } = await supabase
    .from("peripherals")
    .select(`
      id,

      ip_management_id,

      score,

      score_detail,

      status,

      scanner_version,

      last_scan_at,

      last_scan_by,

      hardware,

      software,

      ip_management(
        id,
        device,
        ip_terkini,
        ruangan,
        jenis_network
      ),

      peripheral_device_addons(
        id,
        addon:peripheral_addons(
          id,
          addon_name
        )
      )
    `)
    .order("id");

  if (error) throw error;

 return (data ?? []).map((item: any) => ({
  
  ...item,

  ip_management: Array.isArray(item.ip_management)
    ? item.ip_management[0]
    : item.ip_management,

  peripheral_device_addons:
    (item.peripheral_device_addons ?? []).map((addon: any) => ({
      ...addon,

      addon: Array.isArray(addon.addon)
        ? addon.addon[0]
        : addon.addon,
    })),
})) as Peripheral[];
}

export async function getAvailableDevices() {
  const { data: peripherals, error: peripheralError } =
    await supabase
      .from("peripherals")
      .select("ip_management_id");

  if (peripheralError) throw peripheralError;

  const ids =
    peripherals.map((item) => item.ip_management_id);

  let query =
    supabase
      .from("ip_management")
      .select(`
        id,
        device,
        ip_terkini,
        ruangan,
        jenis_network
      `);

  if (ids.length > 0) {
    query = query.not("id", "in", `(${ids.join(",")})`);
  }

  const { data, error } = await query.order("device");

  if (error) throw error;

  return data;
}

export async function createPeripheral(
  ip_management_id: number
) {
  return supabase
    .from("peripherals")
    .insert([
      {
        ip_management_id,
      },
    ]);
}

export async function deletePeripheral(
  id: number
) {
  return supabase
    .from("peripherals")
    .delete()
    .eq("id", id);
}

export async function getAddons() {
  const { data, error } = await supabase
    .from("peripheral_addons")
    .select("*")
    .eq("is_active", true)
    .order("addon_name");

  if (error) throw error;

  return data;
}

export async function createAddon(
  payload: {
    addon_name: string;
    description?: string;
  }
) {
  return supabase
    .from("peripheral_addons")
    .insert([payload]);
}

export async function deleteAddon(
  id: number
) {
  return supabase
    .from("peripheral_addons")
    .delete()
    .eq("id", id);
}

export async function assignAddon(
  peripheral_id: number,
  addon_id: number
) {
  return supabase
    .from("peripheral_device_addons")
    .insert([
      {
        peripheral_id,
        addon_id,
      },
    ]);
}

export async function removeAssignedAddon(
  id: number
) {
  return supabase
    .from("peripheral_device_addons")
    .delete()
    .eq("id", id);
}

export async function getPeripheralAddons(
  peripheralId: number
) {
  const { data, error } = await supabase
    .from("peripheral_device_addons")
    .select(`
      id,
      addon_id,
      peripheral_addons (
        id,
        addon_name
      )
    `)
    .eq("peripheral_id", peripheralId);

  if (error) throw error;

  return data;
}