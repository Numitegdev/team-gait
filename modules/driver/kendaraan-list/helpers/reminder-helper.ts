export function getNearestReminder(

  reminders: any[],
  reminderLogs: any[]

) {

  const currentYear =
    new Date().getFullYear();

  const activeReminders =
    reminders.filter(
      (reminder) => {

        const verified =
          reminderLogs.some(

            (log) =>

              log.reminder_id ===
                reminder.id

              &&

              log.reminder_year ===
                currentYear

          );

        return !verified;

      }
    );

  if (
    activeReminders.length === 0
  ) {
    return null;
  }

  const now =
    new Date();

  const mapped =
    activeReminders.map(
      (item) => {

        let nextDate =
          new Date(

            currentYear,

            item.month - 1,

            item.day

          );

        if (
          nextDate < now
        ) {

          nextDate =
            new Date(

              currentYear + 1,

              item.month - 1,

              item.day

            );

        }

        const daysRemaining =
          Math.ceil(

            (
              nextDate.getTime()
              -
              now.getTime()
            )

            /

            (
              1000 *
              60 *
              60 *
              24
            )

          );

        return {

          ...item,

          nextDate,

          daysRemaining,

        };

      }
    );

  mapped.sort(
    (a, b) =>

      a.daysRemaining
      -
      b.daysRemaining

  );

  return mapped[0];

}