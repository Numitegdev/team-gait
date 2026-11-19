export interface ParsedCPU {

  vendor: "Intel" | "AMD" | "Xeon" | "Unknown";

  family: string;

  generation: number;

  model: string;

  suffix: string;

  raw: string;

}


export interface ParsedCPU {
  vendor: "Intel" | "AMD" | "Xeon" | "Unknown";
  family: string;
  generation: number;
  model: string;
  suffix: string;
  raw: string;
}

export function parseCPU(raw: string): ParsedCPU {
  const text = String(raw ?? "").trim();

  const unknown: ParsedCPU = {
    vendor: "Unknown",
    family: "",
    generation: 0,
    model: "",
    suffix: "",
    raw: text,
  };

  if (!text) return unknown;

  // =====================
  // XEON
  // =====================
  if (/Xeon/i.test(text)) {
    const familyMatch = text.match(
      /Xeon.*?\b(E3|E5|E7|Silver|Gold|Platinum)\b/i
    );

    const versionMatch = text.match(/\bv(\d+)\b/i);

    return {
      vendor: "Xeon",
      family: familyMatch?.[1]
        ? familyMatch[1][0].toUpperCase() +
          familyMatch[1].slice(1).toLowerCase()
        : "Xeon",
      generation: versionMatch ? Number(versionMatch[1]) : 1,
      model: text.match(/\b\d{4,5}\b/)?.[0] ?? "",
      suffix: "",
      raw: text,
    };
  }

  // =====================
  // INTEL CORE N SERIES
  // =====================
  if (/Intel/i.test(text) && /Core/i.test(text)) {
    const nSeriesMatch = text.match(
      /\bi([3579])[-\s]+(N\d{3,4})([A-Za-z]{0,3})\b/i
    );

    if (nSeriesMatch) {
      return {
        vendor: "Intel",
        family: `i${nSeriesMatch[1]}`,
        generation: 0,
        model: nSeriesMatch[2].toUpperCase(),
        suffix: nSeriesMatch[3].toUpperCase(),
        raw: text,
      };
    }

    const match = text.match(/\bi([3579])[-\s]+(\d{4,5})([A-Za-z]{0,3})\b/i);

    if (match) {
      const model = match[2];
      const firstTwoDigits = Number(model.substring(0, 2));

      const generation =
        firstTwoDigits >= 10 && firstTwoDigits <= 19
          ? firstTwoDigits
          : Number(model.substring(0, 1));

      return {
        vendor: "Intel",
        family: `i${match[1]}`,
        generation,
        model,
        suffix: match[3].toUpperCase(),
        raw: text,
      };
    }
  }

  // =====================
  // PENTIUM
  // =====================
  if (/Pentium/i.test(text)) {
    const match = text.match(/G(\d{4})/i);

    return {
      vendor: "Intel",
      family: /Gold/i.test(text) ? "Pentium Gold" : "Pentium",
      generation: match ? Number(match[1].substring(0, 1)) : 0,
      model: match?.[1] ?? "",
      suffix: "",
      raw: text,
    };
  }

  // =====================
  // CELERON
  // =====================
  if (/Celeron/i.test(text)) {
    const match = text.match(/G(\d{4})|N(\d{4})/i);

    return {
      vendor: "Intel",
      family: "Celeron",
      generation: 0,
      model: match?.[1] ?? match?.[2] ?? "",
      suffix: "",
      raw: text,
    };
  }

  // =====================
  // AMD RYZEN
  // =====================
  if (/Ryzen/i.test(text)) {
    const match = text.match(/Ryzen\s+([3579])\s+(\d{4,5})/i);

    if (match) {
      const model = match[2];

      const suffixMatch = text.match(
        /\d{4,5}([A-Za-z]{1,3})\b/
      );

      return {
        vendor: "AMD",
        family: `Ryzen ${match[1]}`,
        generation: Number(model.substring(0, 1)) * 1000,
        model,
        suffix: suffixMatch?.[1]?.toUpperCase() ?? "",
        raw: text,
      };
    }
  }

  // =====================
  // AMD ATHLON
  // =====================
  if (/Athlon/i.test(text)) {
    return {
      vendor: "AMD",
      family: "Athlon",
      generation: 0,
      model: "",
      suffix: "",
      raw: text,
    };
  }

  return unknown;
}
