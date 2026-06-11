export function calculateDuration(

  start?: string,

  end?: string

) {

  if (
    !start ||
    !end
  )
    return "-";

  const diff =
    new Date(end)
      .getTime()

    -
    new Date(start)
      .getTime();

  const minutes =
    Math.floor(
      diff / 60000
    );

  const hours =
    Math.floor(
      minutes / 60
    );

  const remain =
    minutes % 60;

  return `${hours}j ${remain}m`;

}