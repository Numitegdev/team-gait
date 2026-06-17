export function isReminderVerified(

  reminder: any,

  logs: any[]

) {

  const year =
    new Date()
      .getFullYear();

  return logs.some(

    (log) =>

      log.reminder_id ===
        reminder.id

      &&

      log.reminder_year ===
        year

  );

}