export interface ParsedWindows {

    type: "Windows" | "Windows Server" | "Unknown";

    major: number;

    edition: string;

    build: number;

}

export function parseWindows(
    windows: any
): ParsedWindows {

    const name =
        windows.name ?? "";

    const build =
        Number(windows.build ?? 0);

    let type: ParsedWindows["type"] =
        "Unknown";

    if (name.includes("Server"))
        type = "Windows Server";

    else if (name.includes("Windows"))
        type = "Windows";

    const majorMatch =
        name.match(/Windows\s(?:Server\s)?(\d+)/i);

    const major =
        majorMatch
            ? Number(majorMatch[1])
            : 0;

    const edition =
        name
            .replace("Microsoft","")
            .trim();

    return {

        type,

        major,

        edition,

        build,

    };

}