export interface ParsedStorage {

    type: "NVMe" | "SSD" | "HDD" | "Unknown";

    capacity: number;

    bus: string;

}

export function parseStorage(
    storage: any
): ParsedStorage {

    const disk = storage.physical?.[0];

    if (!disk) {

        return {

            type: "Unknown",

            capacity: 0,

            bus: "",

        };

    }

    let type: ParsedStorage["type"] = "Unknown";

    if (disk.bus_type === "NVMe") {

        type = "NVMe";

    }

    else if (disk.media_type === "SSD") {

        type = "SSD";

    }

    else if (disk.media_type === "HDD") {

        type = "HDD";

    }

    return {

        type,

        capacity: disk.size_gb,

        bus: disk.bus_type,

    };

}