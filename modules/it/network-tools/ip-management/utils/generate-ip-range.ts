export function generateIPRange(
  start: string,
  end: string
) {

  const ips: string[] = [];

  const startPart =
    Number(
      start.split(".")[3]
    );

  const endPart =
    Number(
      end.split(".")[3]
    );

  const prefix =
    start
      .split(".")
      .slice(0, 3)
      .join(".");

  for (
    let i = startPart;
    i <= endPart;
    i++
  ) {

    ips.push(
      `${prefix}.${i}`
    );

  }

  return ips;
}