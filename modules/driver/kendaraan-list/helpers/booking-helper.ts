export function getNearestBooking(
  bookings: any[]
) {

  if (
    bookings.length === 0
  ) {
    return null;
  }

  const today =
    new Date();

  const upcoming =
    bookings
      .map((item) => {

        const bookingDate =
          new Date(
            item.booking_date
          );

        const daysRemaining =
          Math.ceil(

            (
              bookingDate.getTime()
              -
              today.getTime()
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

          daysRemaining,

        };

      })

      .filter(
        item =>
          item.daysRemaining >= 0
      )

      .sort(
        (a, b) =>
          a.daysRemaining -
          b.daysRemaining
      );

  return (
    upcoming[0]
    ?? null
  );

}