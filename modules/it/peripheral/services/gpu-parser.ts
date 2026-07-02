export interface ParsedGPU {

    vendor: "NVIDIA" | "AMD" | "Intel" | "Unknown";

    family: string;

    series: number;

    vram: number;

    raw: string;

}

export function parseGPU(gpu: any): ParsedGPU {

    const text = gpu?.name ?? "";

    // =====================
    // NVIDIA
    // =====================

    if (text.match(/RTX\s*(\d{4})/i)) {

        const model = Number(
            text.match(/RTX\s*(\d{4})/i)![1]
        );

        return {

            vendor: "NVIDIA",

            family: "RTX",

            series: model,

            vram: gpu.adapter_ram_mb ?? 0,

            raw: text,

        };

    }

    if (text.match(/GTX\s*(\d{3,4})/i)) {

        const model = Number(
            text.match(/GTX\s*(\d{3,4})/i)![1]
        );

        return {

            vendor: "NVIDIA",

            family: "GTX",

            series: model,

            vram: gpu.adapter_ram_mb ?? 0,

            raw: text,

        };

    }

    // =====================
    // AMD
    // =====================

    if (text.match(/RX\s*(\d{4})/i)) {

        const model = Number(
            text.match(/RX\s*(\d{4})/i)![1]
        );

        return {

            vendor: "AMD",

            family: "RX",

            series: model,

            vram: gpu.adapter_ram_mb ?? 0,

            raw: text,

        };

    }

    // =====================
    // Intel
    // =====================

    if (text.includes("Intel")) {

        return {

            vendor: "Intel",

            family: "Integrated",

            series: 0,

            vram: gpu.adapter_ram_mb ?? 0,

            raw: text,

        };

    }

    return {

        vendor: "Unknown",

        family: "",

        series: 0,

        vram: 0,

        raw: text,

    };

}