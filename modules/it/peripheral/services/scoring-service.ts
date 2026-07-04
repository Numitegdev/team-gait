import { ScannerFile } from "../types/scanner.types";
import { ParsedCPU, parseCPU } from "./cpu-parser";
import { parseRAM,ParsedRAM } from "./ram-parser";
import {
    parseStorage,
    ParsedStorage
} from "./storage-parser";
import {
    parseGPU,
    ParsedGPU
} from "./gpu-parser";
import {
    parseWindows,
    ParsedWindows
} from "./windows-parser";
export interface ScoreResult {

  cpu: number;

  ram: number;

  storage: number;

  windows: number;

  gpu: number;

  total: number;

  status: string;

}

function scoreCPU(
  cpu: ScannerFile["cpu"]
): number {

  const parsed = parseCPU(cpu.model);

  switch (parsed.vendor) {

    case "Intel":
      return scoreIntel(parsed);

    case "AMD":
      return scoreAMD(parsed);

    case "Xeon":
      return scoreXeon(parsed);

    default:
      return 10;

  }

}

function scoreSuffix(
    suffix: string
): number {

    switch (suffix) {

        case "Y":
            return -6;

        case "U":
            return -5;

        case "P":
            return -2;

        case "G":
            return -1;

        case "GE":
            return 0;

        case "H":
            return 1;

        case "HQ":
            return 2;

        case "HK":
            return 3;

        case "HX":
            return 4;

        case "F":
            return 0;

        case "KF":
            return 2;

        case "K":
            return 2;

        case "X":
            return 3;

        case "XE":
            return 4;

        default:
            return 0;

    }

}


function scoreIntel(cpu: ParsedCPU): number {

    let score = 0;

    if (cpu.generation >= 12) {

        switch (cpu.family) {

            case "i9": score = 35; break;
            case "i7": score = 34; break;
            case "i5": score = 32; break;
            case "i3": score = 29; break;

            case "Pentium Gold":
                score = 22;
                break;

            case "Pentium":
                score = 18;
                break;

            case "Celeron":
                score = 12;
                break;

            default:
                score = 15;
        }

    }

    else if (cpu.generation >= 10) {

        switch (cpu.family) {

            case "i9": score = 34; break;
            case "i7": score = 31; break;
            case "i5": score = 29; break;
            case "i3": score = 27; break;

            case "Pentium Gold":
                score = 20;
                break;

            case "Pentium":
                score = 16;
                break;

            case "Celeron":
                score = 10;
                break;

            default:
                score = 14;
        }

    }

    else if (cpu.generation >= 8) {

        switch (cpu.family) {

            case "i9": score = 32; break;
            case "i7": score = 28; break;
            case "i5": score = 26; break;
            case "i3": score = 24; break;

            case "Pentium Gold":
                score = 18;
                break;

            case "Pentium":
                score = 14;
                break;

            case "Celeron":
                score = 9;
                break;

            default:
                score = 13;
        }

    }

    else if (cpu.generation >= 6) {

        switch (cpu.family) {

            case "i7": score = 25; break;
            case "i5": score = 23; break;
            case "i3": score = 20; break;

            case "Pentium":
                score = 13;
                break;

            case "Celeron":
                score = 8;
                break;

            default:
                score = 12;
        }

    }

    else {

        switch (cpu.family) {

            case "i7": score = 22; break;
            case "i5": score = 20; break;
            case "i3": score = 17; break;

            case "Pentium":
                score = 12;
                break;

            case "Celeron":
                score = 7;
                break;

            default:
                score = 10;
        }

    }

    score += scoreSuffix(cpu.suffix);

    return Math.max(0, Math.min(score, 35));

}
function scoreAMD(cpu: ParsedCPU): number {

    let score = 0;

    // Ryzen berdasarkan generasi
    if (cpu.generation >= 7) {

        switch (cpu.family) {

            case "Ryzen 3":
                score = 29;
                break;

            case "Ryzen 5":
                score = 32;
                break;

            case "Ryzen 7":
                score = 34;
                break;

            case "Ryzen 9":
                score = 35;
                break;

            case "Athlon":
                score = 14;
                break;

            default:
                score = 15;
        }

    }

    else if (cpu.generation >= 5) {

        switch (cpu.family) {

            case "Ryzen 3":
                score = 27;
                break;

            case "Ryzen 5":
                score = 30;
                break;

            case "Ryzen 7":
                score = 32;
                break;

            case "Ryzen 9":
                score = 34;
                break;

            case "Athlon":
                score = 13;
                break;

            default:
                score = 14;
        }

    }

    else if (cpu.generation >= 3) {

        switch (cpu.family) {

            case "Ryzen 3":
                score = 24;
                break;

            case "Ryzen 5":
                score = 27;
                break;

            case "Ryzen 7":
                score = 30;
                break;

            case "Ryzen 9":
                score = 32;
                break;

            case "Athlon":
                score = 12;
                break;

            default:
                score = 13;
        }

    }

    else {

        switch (cpu.family) {

            case "Ryzen 3":
                score = 21;
                break;

            case "Ryzen 5":
                score = 24;
                break;

            case "Ryzen 7":
                score = 28;
                break;

            case "Ryzen 9":
                score = 30;
                break;

            case "Athlon":
                score = 10;
                break;

            default:
                score = 12;
        }

    }

    score += scoreSuffix(cpu.suffix);

    return Math.max(
        0,
        Math.min(score, 35)
    );

}

function scoreXeon(cpu: ParsedCPU): number {

    let score = 24;

    switch (cpu.family) {

        case "E3":

            score = 21 + cpu.generation;
            break;

        case "E5":

            score = 23 + (cpu.generation * 2);
            break;

        case "Silver":

            score = 29;
            break;

        case "Gold":

            score = 33;
            break;

        case "Platinum":

            score = 35;
            break;

        default:

            score = 26;

    }

    return Math.max(
        0,
        Math.min(score, 35)
    );

}

function scoreRAM(
    memory: ScannerFile["memory"]
): number {

    const ram =
        parseRAM(memory);

    let score = 0;

    // kapasitas
    if(ram.totalGB >= 64)
        score = 22;

    else if(ram.totalGB >= 32)
        score = 20;

    else if(ram.totalGB >= 16)
        score = 16;

    else if(ram.totalGB >= 8)
        score = 10;

    else if(ram.totalGB >= 4)
        score = 5;

    // tipe RAM
    switch(ram.type){

        case "DDR5":
            score += 3;
            break;

        case "DDR4":
            score += 2;
            break;

        case "DDR3":
            score += 0;
            break;

    }

    // speed
    if(ram.speed >= 6000)
        score += 2;

    else if(ram.speed >= 4800)
        score += 2;

    else if(ram.speed >= 3200)
        score += 1;

    // dual channel / quad channel
    if(ram.modules >= 2)
        score += 1;

    return Math.min(score,25);

}

function scoreStorage(
    storage: ScannerFile["storage"]
): number {

    const disk =
        parseStorage(storage);

    let score = 0;

    switch(disk.type){

        case "NVMe":
            score = 17;
            break;

        case "SSD":
            score = 14;
            break;

        case "HDD":
            score = 7;
            break;

        default:
            score = 5;

    }

    if(disk.capacity >= 1000)
        score += 3;

    else if(disk.capacity >= 512)
        score += 2;

    else if(disk.capacity >= 256)
        score += 1;

    return Math.min(score,20);

}

function scoreWindows(
    windows: ScannerFile["windows"]
): number {

    const os =
        parseWindows(windows);

    if (os.type === "Windows") {

        if (os.major >= 11)
            return 10;

        if (os.major >= 10)
            return 8;

        if (os.major >= 8)
            return 6;

        if (os.major >= 7)
            return 4;

        return 2;

    }

    if (os.type === "Windows Server") {

        if (os.build >= 20348) // Server 2022
            return 10;

        if (os.build >= 17763) // Server 2019
            return 9;

        if (os.build >= 14393) // Server 2016
            return 8;

        return 7;

    }

    return 3;

}

function scoreGPU(
    gpu: ScannerFile["gpu"]
): number {

    if (!gpu.length)
        return 0;

    const parsed =
        parseGPU(gpu[0]);

    switch (parsed.vendor) {

        case "NVIDIA":
            return scoreNvidia(parsed);

        case "AMD":
            return scoreAMDGPU(parsed);

        case "Intel":
            return 2;

        default:
            return 1;

    }

}
function scoreNvidia(
    gpu: ParsedGPU
): number {

    let score = 0;

    if (gpu.family === "RTX") {

        if (gpu.series >= 5000)
            score = 5;

        else if (gpu.series >= 4000)
            score = 5;

        else if (gpu.series >= 3000)
            score = 4;

        else if (gpu.series >= 2000)
            score = 4;

    }

    else if (gpu.family === "GTX") {

        if (gpu.series >= 1600)
            score = 3;

        else if (gpu.series >= 1000)
            score = 3;

        else if (gpu.series >= 900)
            score = 2;

        else
            score = 1;

    }

    return score;

}
function scoreAMDGPU(
    gpu: ParsedGPU
): number {

    if (gpu.series >= 9000)
        return 5;

    if (gpu.series >= 7000)
        return 5;

    if (gpu.series >= 6000)
        return 4;

    if (gpu.series >= 5000)
        return 4;

    if (gpu.series >= 4000)
        return 3;

    return 2;

}

export function calculateScore(
  scanner: ScannerFile
): ScoreResult {

  const cpu =
    scoreCPU(scanner.cpu);

  const ram =
    scoreRAM(scanner.memory);

  const storage =
    scoreStorage(scanner.storage);

  const windows =
    scoreWindows(scanner.windows);

  const gpu =
    scoreGPU(scanner.gpu);

  const total =

    cpu +

    ram +

    storage +

    windows +

    gpu;

  let status = "Poor";

  if (total >= 90) {

    status = "Excellent";

  }
  else if (total >= 75) {

    status = "Good";

  }
  else if (total >= 60) {

    status = "Fair";

  }

  return {

    cpu,

    ram,

    storage,

    windows,

    gpu,

    total,

    status,

  };

}