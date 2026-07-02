export interface ScannerResult {
  scanner_version: string;

  scan_time: string;

  computer: ComputerInfo;

  windows: WindowsInfo;

  cpu: CpuInfo;

  memory: MemoryInfo;

  motherboard: MotherboardInfo;

  bios: BiosInfo;

  gpu: GpuInfo[];

  storage: StorageInfo[];

  network: NetworkInfo;

  softwares: SoftwareInfo[];
}

export interface ComputerInfo {
  hostname: string;

  username: string;

  domain: string;
}

export interface WindowsInfo {
  edition: string;

  version: string;

  build: string;

  install_date: string;

  last_boot: string;

  activated: boolean;
}

export interface CpuInfo {
  vendor: string;

  series: string;

  model: string;

  generation: number;

  cores: number;

  threads: number;

  base_clock: number;

  max_clock: number;
}

export interface MemoryInfo {
  total_gb: number;

  modules: MemoryModule[];
}

export interface MemoryModule {
  manufacturer: string;

  size_gb: number;

  type: string;

  speed: number;
}

export interface GpuInfo {
  vendor: string;

  model: string;

  memory_gb: number;
}

export interface StorageInfo {
  drive: string;

  model: string;

  type: string;

  size_gb: number;

  free_gb: number;
}

export interface MotherboardInfo {
  manufacturer: string;

  model: string;

  serial: string;
}

export interface BiosInfo {
  vendor: string;

  version: string;

  date: string;
}

export interface NetworkInfo {
  ip: string;

  mac: string;

  gateway: string;

  dns: string[];
}

export interface SoftwareInfo {
  name: string;

  installed: boolean;

  version: string | null;
}

export interface ScannerFile {
  scanner_version: string;
  scan_time: string;

  computer: {
    hostname: string;
    username: string;
    domain: string;
  };

  cpu: {
    vendor: string;
    model: string;
    cores: number;
    threads: number;
    max_clock: number;
  };

  memory: {
    total_gb: number;
    modules: {
      manufacturer: string;
      size_gb: number;
      type: string;
      speed: number;
    }[];
  };

  storage: {
    physical: {
      model: string;
      media_type: string;
      bus_type: string;
      size_gb: number;
    }[];

    volumes: {
      drive: string;
      label: string;
      filesystem: string;
      size_gb: number;
      free_gb: number;
    }[];
  };

  gpu: {
    name: string;
    manufacturer: string;
    driver_version: string;
    driver_date: string;
    resolution: string;
    video_processor: string;
    adapter_ram_mb: number;
  }[];

  motherboard: {
    manufacturer: string;
    product: string;
    serial_number: string;
    version: string;
  };

  bios: {
    manufacturer: string;
    version: string;
    serial_number: string;
    release_date: string;
  };

  windows: {
    name: string;
    version: string;
    build: string;
    architecture: string;
    install_date: string;
    last_boot: string;
  };

  network: {
    adapter: string;
    description: string;
    ipv4: string;
    gateway: string;
    dns: string[];
    mac_address: string;
  }[];

  software: {
    name: string;
    installed: boolean;
    version: string;
    path: string;
  }[];

    server_services: {

    sql_server: {

      installed: boolean;

      running: boolean;

      instance: string;

      edition: string;

      version: string;

    };

    otomax: {

      installed: boolean;

      running: boolean;

      version: string;

    };

  };

}