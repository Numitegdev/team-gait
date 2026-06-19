import {
  useState,
  useEffect,
} from "react";

interface Props {

  open: boolean;

  onClose: () => void;

  onSubmit: (
    payload: any
  ) => void;

  booking?: any;

}



export function BookingFormModal({

  open,

  onClose,

  onSubmit,

  booking,

}: Props) {

    

  const [

    bookedBy,

    setBookedBy,

  ] = useState("");

  const [

    bookingDate,

    setBookingDate,

  ] = useState("");

  const [

  endDate,

  setEndDate,

] = useState("");

  const [

    purpose,

    setPurpose,

  ] = useState("");

useEffect(() => {

  if (booking) {

    setBookedBy(
      booking.booked_by ?? ""
    );

    setBookingDate(
      booking.booking_date ?? ""
    );

    setPurpose(
      booking.purpose ?? ""
    );

  }

}, [booking]);


  if (!open)
    return null;

 return (

  <div
    className="
      fixed
      inset-0
      z-999
      flex
      items-center
      justify-center
      bg-black/50
      p-4
    "
  >

    <div
      className="
        w-full
        max-w-lg
        rounded-2xl
        bg-white
        shadow-xl
        max-h-[90vh]
        overflow-y-auto
      "
    >

      <div
        className="
          border-b
          p-5
        "
      >

        <h2
          className="
            text-xl
            font-semibold
          "
        >
          Booking Kendaraan
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          Isi data peminjaman kendaraan
        </p>

      </div>

      <div
        className="
          p-5
          space-y-4
        "
      >

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >
            Nama Peminjam
          </label>

          <input

            value={bookedBy}

            onChange={(e) =>
              setBookedBy(
                e.target.value
              )
            }

            placeholder="Contoh: Pak Arif"

            className="
              w-full
              rounded-lg
              border
              p-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >
            Tanggal Booking
          </label>

          <input

            type="date"

            value={bookingDate}

            onChange={(e) =>
              setBookingDate(
                e.target.value
              )
            }

            className="
              w-full
              rounded-lg
              border
              p-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
          <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >
            Tanggal Selesai
          </label>

          <input

            type="date"

            value={endDate}

            onChange={(e) =>
              setEndDate(
                e.target.value
              )
            }

            className="
              w-full
              rounded-lg
              border
              p-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

        </div>

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >
            Keperluan
          </label>

          <textarea

            rows={4}

            value={purpose}

            onChange={(e) =>
              setPurpose(
                e.target.value
              )
            }

            placeholder="Contoh: Survey lokasi proyek"

            className="
              w-full
              rounded-lg
              border
              p-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

      </div>

      <div
        className="
          flex
          flex-col-reverse
          gap-2
          border-t
          p-5
          sm:flex-row
          sm:justify-end
        "
      >

        <button

          onClick={onClose}

          className="
            w-full
            rounded-lg
            border
            px-4
            py-3
            sm:w-auto
          "
        >

          Batal

        </button>

        <button

          onClick={() =>

          onSubmit({

            booked_by:
              bookedBy,

            booking_date:
              bookingDate,

            end_date:
              endDate,

            purpose,

          })

          }

          className="
            w-full
            rounded-lg
            bg-blue-600
            px-4
            py-3
            text-white
            hover:bg-blue-700
            sm:w-auto
          "
        >

          Simpan Booking

        </button>

      </div>

    </div>

  </div>

);

}