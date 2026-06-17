export function getReminderYear(
  month: number,
  day: number
) {

  const now =
    new Date();

  let year =
    now.getFullYear();

  const dueDate =
    new Date(
      year,
      month - 1,
      day
    );

  if (
    dueDate < now
  ) {

    year++;

  }

  return year;

}