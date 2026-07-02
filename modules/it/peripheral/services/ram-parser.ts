
export interface ParsedRAM {

    totalGB: number;

    type: "DDR3" | "DDR4" | "DDR5" | "Unknown";

    speed: number;

    modules: number;

}

export function parseRAM(
    memory: any
): ParsedRAM {

    const modules = memory.modules ?? [];

    return {

        totalGB: memory.total_gb,

        type: modules[0]?.type ?? "Unknown",

        speed: modules[0]?.speed ?? 0,

        modules: modules.length,

    };

}