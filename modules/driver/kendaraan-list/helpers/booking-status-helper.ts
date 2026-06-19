export function getBookingStatus(
    
  booking: any
) {

  const now =
    new Date();

  const start =
    new Date(
      booking.booking_date
    );

  const end =
    new Date(
      booking.end_date
    );

  if (
    now >= start &&
    now <= end
  ) {

    return {
      text:
        "Sedang Dipakai",
      color:
        "bg-red-200",
    };

  }

  const diff =
    Math.ceil(

      (
        start.getTime()
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

  if (diff <= 7) {

    return {
      text:
        "Mendekati Jadwal",
      color:
        "bg-yellow-200",
    };

  }

  return {

    text:
      "Terjadwal",

    color:
      "bg-green-200",

  };

}