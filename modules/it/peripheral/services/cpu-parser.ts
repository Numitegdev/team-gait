export interface ParsedCPU {

  vendor: "Intel" | "AMD" | "Xeon" | "Unknown";

  family: string;

  generation: number;

  model: string;

  suffix: string;

  raw: string;

}

export function parseCPU(raw: string): ParsedCPU {

  const text = raw.trim();

  // =====================
  // INTEL CORE
  // =====================

  if (text.includes("Intel") && text.includes("Core")) {

    const match = text.match(/i([3579])-(\d{4,5})/i);

    if (match) {

      const family = `i${match[1]}`;

      const model = match[2];

      const generation =
        model.length === 5
          ? Number(model.substring(0, 2))
          : Number(model.substring(0, 1));

      const suffixMatch =
    text.match(/[0-9]{4,5}([A-Za-z]{1,3})/);

const suffix =
    suffixMatch
        ? suffixMatch[1].toUpperCase()
        : "";    

      return {

    vendor: "Intel",

    family,

    generation,

    model,

    suffix,

    raw: text,

};

    }

  }

  // =====================
  // Pentium
  // =====================

if (text.includes("Pentium")) {

    const match =
        text.match(/G(\d{4})/i);

    return {

        vendor: "Intel",

        family: "Pentium",

        generation: match
            ? Number(match[1].substring(0,1))
            : 0,

        model: match?.[1] ?? "",

        suffix: "",

        raw:text

    };

}

//============================= 
// Celeron
// ============================
if (text.includes("Celeron")) {

    const match =
        text.match(/G(\d{4})|N(\d{4})/i);

    return {

        vendor:"Intel",

        family:"Celeron",

        generation:0,

        model:match?.[1] ?? match?.[2] ?? "",

        suffix:"",

        raw:text

    };

}

  // =====================
  // AMD RYZEN
  // =====================

  if (text.includes("Ryzen")) {

    const match = text.match(/Ryzen\s+([3579])\s+(\d{4})/i);

    if (match) {

      const family = `Ryzen ${match[1]}`;

      const model = match[2];

      const generation =
        Number(model.substring(0, 1)) * 1000;

        const suffixMatch =
            text.match(/[0-9]{4,5}([A-Za-z]{1,3})/);

        const suffix =
            suffixMatch
                ? suffixMatch[1].toUpperCase()
                : "";
      return {

        vendor: "AMD",

        family,

        generation,

        model,

        suffix,

        raw: text,

    };

    }

  }

// ==========================
// Athlon
// ==========================
if(text.includes("Athlon")){

    return{

        vendor:"AMD",

        family:"Athlon",

        generation:0,

        model:"",

        suffix:"",

        raw:text

    };

}


  // =====================
  // XEON
  // =====================

  if (text.includes("Xeon")) {

    const family =
      text.match(/Xeon.*?(E3|E5|E7|Silver|Gold|Platinum)/i);

    const version =
      text.match(/v(\d+)/i);

    return {

      vendor: "Xeon",

      family: family?.[1] ?? "Xeon",

      generation:
        version
          ? Number(version[1])
          : 1,

      model: "",

      suffix: "",
      
      raw: text,

    };

  }

 return {

    vendor: "Unknown",

    family: "",

    generation: 0,

    model: "",

    suffix: "",

    raw: text,

};

}