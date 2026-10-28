import * as XLSX from "xlsx";
import { Peripheral } from "../types/peripheral.types";
import { getRoomName } from "@/modules/it/network-tools/ip-management/constants/room-options";


type JsonObject = Record<string, any>;

export function exportPeripheralsToExcel(
  peripherals: Peripheral[]
) {
  const rows = peripherals.map((item) => {
    const hardware: JsonObject = item.hardware ?? {};
    const scoreDetail: JsonObject = item.score_detail ?? {};

    const cpu: JsonObject = hardware.cpu ?? {};
    const bios: JsonObject = hardware.bios ?? {};
    const memory: JsonObject = hardware.memory ?? {};
    const motherboard: JsonObject = hardware.motherboard ?? {};
    const windows: JsonObject = hardware.windows ?? {};
    const storage: JsonObject = hardware.storage ?? {};

    const gpuList: JsonObject[] = Array.isArray(hardware.gpu)
      ? hardware.gpu
      : [];

    const ramModules: JsonObject[] = Array.isArray(memory.modules)
      ? memory.modules
      : [];

    const networkList: JsonObject[] = Array.isArray(hardware.network)
      ? hardware.network
      : [];

    const physicalDisks: JsonObject[] = Array.isArray(storage.physical)
      ? storage.physical
      : [];

    const volumes: JsonObject[] = Array.isArray(storage.volumes)
      ? storage.volumes
      : [];

    const addons = (item.peripheral_device_addons ?? [])
      .map((entry) => entry.addon?.addon_name)
      .filter(Boolean)
      .join(", ");

    const row: Record<string, string | number> = {
      "ID Peripheral": item.id,
      "ID IP Management": item.ip_management_id,
      "Nama Device": item.ip_management?.device ?? "-",
      "IP Address": item.ip_management?.ip_terkini ?? "-",
      "Ruangan": item.ip_management?.ruangan
        ? getRoomName(item.ip_management.ruangan)
        : "-",
      "Network": item.ip_management?.jenis_network ?? "-",
      "Addon": addons || "-",

      "Score": item.score ?? "-",
      "Score Detail CPU": scoreDetail.cpu ?? "-",
      "Score Detail GPU": scoreDetail.gpu ?? "-",
      "Score Detail RAM": scoreDetail.ram ?? "-",
      "Score Detail Storage": scoreDetail.storage ?? "-",
      "Score Detail Windows": scoreDetail.windows ?? "-",

      "Status": item.status ?? "-",
      "Scanner Version": item.scanner_version ?? "-",
      "Last Scan At": item.last_scan_at ?? "-",
      "Last Scan By": item.last_scan_by ?? "-",

      // CPU
      "CPU Model": cpu.model ?? "-",
      "CPU Vendor": cpu.vendor ?? "-",
      "CPU Cores": cpu.cores ?? "-",
      "CPU Threads": cpu.threads ?? "-",
      "CPU Max Clock": cpu.max_clock ?? "-",

      // BIOS
      "BIOS Manufacturer": bios.manufacturer ?? "-",
      "BIOS Version": bios.version ?? "-",
      "BIOS Release Date": bios.release_date ?? "-",
      "BIOS Serial Number": bios.serial_number ?? "-",

      // Memory
      "Total RAM (GB)": memory.total_gb ?? "-",

      // Motherboard
      "Motherboard Manufacturer": motherboard.manufacturer ?? "-",
      "Motherboard Product": motherboard.product ?? "-",
      "Motherboard Version": motherboard.version ?? "-",
      "Motherboard Serial Number": motherboard.serial_number ?? "-",

      // Windows
      "Windows Name": windows.name ?? "-",
      "Windows Version": windows.version ?? "-",
      "Windows Build": windows.build ?? "-",
      "Windows Architecture": windows.architecture ?? "-",
      "Windows Install Date": windows.install_date ?? "-",
      "Windows Last Boot": windows.last_boot ?? "-",
    };

    // GPU
    gpuList.forEach((gpu, index) => {
      const prefix = `GPU ${index + 1}`;

      row[`${prefix} Model`] = gpu.name ?? "-";
      row[`${prefix} Manufacturer`] = gpu.manufacturer ?? "-";
      row[`${prefix} VRAM (MB)`] = gpu.adapter_ram_mb ?? "-";
      row[`${prefix} Resolution`] = gpu.resolution ?? "-";
      row[`${prefix} Driver Version`] = gpu.driver_version ?? "-";
      row[`${prefix} Driver Date`] = gpu.driver_date ?? "-";
      row[`${prefix} Video Processor`] = gpu.video_processor ?? "-";
    });

    // RAM modules
    ramModules.forEach((ram, index) => {
      const prefix = `RAM Module ${index + 1}`;

      row[`${prefix} Size (GB)`] = ram.size_gb ?? "-";
      row[`${prefix} Type`] = ram.type ?? "-";
      row[`${prefix} Speed (MHz)`] = ram.speed ?? "-";
      row[`${prefix} Manufacturer`] = ram.manufacturer ?? "-";
    });

    // Network adapters
    networkList.forEach((network, index) => {
      const prefix = `Network Adapter ${index + 1}`;

      row[`${prefix} Name`] = network.adapter ?? "-";
      row[`${prefix} Description`] = network.description ?? "-";
      row[`${prefix} IPv4`] = network.ipv4 ?? "-";
      row[`${prefix} Gateway`] = network.gateway ?? "-";
      row[`${prefix} DNS`] = network.dns ?? "-";
      row[`${prefix} MAC Address`] = network.mac_address ?? "-";
    });

    // Physical disks
    physicalDisks.forEach((disk, index) => {
      const prefix = `Physical Disk ${index + 1}`;

      row[`${prefix} Model`] = disk.model ?? "-";
      row[`${prefix} Size (GB)`] = disk.size_gb ?? "-";
      row[`${prefix} Bus Type`] = disk.bus_type ?? "-";
      row[`${prefix} Media Type`] = disk.media_type ?? "-";
    });

    // Storage volumes
    volumes.forEach((volume, index) => {
      const prefix = `Volume ${index + 1}`;

      row[`${prefix} Drive`] = volume.drive ?? "-";
      row[`${prefix} Label`] = volume.label ?? "-";
      row[`${prefix} Size (GB)`] = volume.size_gb ?? "-";
      row[`${prefix} Free (GB)`] = volume.free_gb ?? "-";
      row[`${prefix} File System`] = volume.filesystem ?? "-";
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Data Peripheral"
  );

  XLSX.writeFile(
    workbook,
    `data-peripheral-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}