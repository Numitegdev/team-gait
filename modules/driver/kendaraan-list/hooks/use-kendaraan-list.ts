"use client";

import {
  useEffect,
  useState,
}
from "react";

import {

  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  uploadVehiclePhoto,
  getVehicleReminders,
  getVehicleBookings,

}
from "../services/kendaraan-list-service";


import {
  createReminder,
}
from "../services/create-reminder-service";

import {

  deleteReminder,

  updateReminder,

}
from "../services/reminder-service";

import {
  verifyReminder,
   getReminderLogs,
}
from "../services/reminder-log-service";

import {
  getReminderYear,
}
from "../helpers/reminder-date-helper";

import {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
}
from "../services/booking-service";
export function useKendaraanList() {

  const [
    vehicles,
    setVehicles,
  ] = useState<any[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(
    false
  );

    const [
    openForm,
    setOpenForm,
    ] = useState(false);

 

    const [

  openDetail,

  setOpenDetail,

] = useState(
  false
);

const [

  selectedVehicle,

  setSelectedVehicle,

] = useState<any>(
  null
);
const [
  detailVehicle,
  setDetailVehicle,
] = useState<any>(
  null
);

const [

  reminders,

  setReminders,

] = useState<any[]>(
  []
);

const [

  openReminderForm,

  setOpenReminderForm,

] = useState(
  false
);


const [

  selectedReminder,

  setSelectedReminder,

] = useState<any>(
  null
);


const [

  reminderLogs,

  setReminderLogs,

] = useState<any[]>(
  []
);

const [

  bookings,

  setBookings,

] = useState<any[]>(
  []
);

const [

  openBookingForm,

  setOpenBookingForm,

] = useState(
  false
);

const [

  selectedBooking,

  setSelectedBooking,

] = useState<any>(
  null
);

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    try {

      setLoading(true);

    const vehicles =
  await getVehicles();

    const reminders =
      await getVehicleReminders();

    const bookingData =
  await getVehicleBookings();

    const mergedVehicles =
      vehicles.map(
        (vehicle) => ({

          ...vehicle,

          reminders:
            reminders.filter(
              (reminder) =>
                reminder.vehicle_id ===
                vehicle.id
            ),

          bookings:
            bookingData.filter(
              (booking: any) =>
                booking.vehicle_id ===
                vehicle.id
            ),

        })
      );

      const logs =
      await getReminderLogs();

      setReminderLogs(
        logs
      );

    setVehicles(
      mergedVehicles
    );

    } finally {

      setLoading(false);

    }

  }


 async function handleCreate(
  payload: any
) {

  try {

  let photoUrl: string | undefined;

    if (
      payload.photo
    ) {

      photoUrl =
        await uploadVehiclePhoto(
          payload.photo
        );

    }

    await createVehicle({

      plat_nomor:
        payload.plat_nomor,

      nama_kendaraan:
        payload.nama_kendaraan,

      foto_url:
        photoUrl,

    });

    await loadData();

    setOpenForm(
      false
    );

  } catch (error) {

    console.error(
      error
    );

  }

}

async function handleUpdate(

  id: number,

  payload: {
    plat_nomor: string;
    nama_kendaraan: string;
    photo?: File | null;
  }

) {

  try {

    let photoUrl:
      string | undefined;

    if (
      payload.photo
    ) {

      photoUrl =
        await uploadVehiclePhoto(
          payload.photo
        );

    }

    await updateVehicle(

      id,

      {

        plat_nomor:
          payload.plat_nomor,

        nama_kendaraan:
          payload.nama_kendaraan,

        foto_url:
          photoUrl,

      }

    );

    await loadData();

    setOpenForm(false);

    setSelectedVehicle(
      null
    );

  } catch (error) {

    console.error(
      error
    );

  }

}

async function handleDelete(
  id: number
) {

  const confirmDelete =
    window.confirm(
      "Hapus kendaraan ini?"
    );

  if (!confirmDelete)
    return;

  try {

    await deleteVehicle(
      id
    );

    await loadData();

  } catch (error: any) {

  console.error(
    "DELETE VEHICLE ERROR:",
    error
  );

  alert(

    JSON.stringify(
      error
    )

  );

}

}

async function handleDetail(
  vehicle: any
) {

  setSelectedVehicle(
    vehicle
  );

  setDetailVehicle(
    vehicle
  );

  const reminderData =
    await getVehicleReminders();

  setReminders(

    reminderData.filter(

      (item) =>

        item.vehicle_id ===
        vehicle.id

    )

  );

  const bookingData =
    await getBookings();

  setBookings(

    bookingData.filter(

      (item) =>

        item.vehicle_id ===
        vehicle.id

    )

  );

  setOpenDetail(
    true
  );

}
async function handleCreateReminder(
  payload: any
) {

  if (
    !detailVehicle
  )
    return;

  try {

    await createReminder({

      vehicle_id:
     detailVehicle?.id,

      ...payload,

    });

    const reminderData =
      await getVehicleReminders();

    setReminders(

      reminderData.filter(

        (item) =>

          item.vehicle_id ===
          detailVehicle?.id

      )

    );

   setSelectedReminder(
  null
);

setOpenReminderForm(
  false
);

  } catch (error) {

    console.error(
      error
    );

  }

}

async function handleDeleteReminder(
  id: number
) {

  const confirmed =
    window.confirm(
      "Hapus reminder ini?"
    );

  if (!confirmed)
    return;

  try {

    await deleteReminder(
      id
    );

    const reminderData =
      await getVehicleReminders();

    setReminders(

      reminderData.filter(

        (item) =>

          item.vehicle_id ===
         detailVehicle?.id

      )

    );

  } catch (error) {

    console.error(
      error
    );

  }

}

async function handleCloseDetail() {

  setOpenDetail(
    false
  );

  await loadData();

}

async function handleUpdateReminder(
  payload: any
) {

  if (
    !selectedReminder
  )
    return;

await updateReminder(
  selectedReminder.id,
  payload
);

  const reminderData =
    await getVehicleReminders();

  setReminders(

    reminderData.filter(

      item =>

        item.vehicle_id ===
        detailVehicle?.id

    )

  );

  setSelectedReminder(
    null
  );

  setOpenReminderForm(
    false
  );

}

function handleEditReminder(
  reminder: any
) {

  setSelectedReminder(
    reminder
  );

  setOpenReminderForm(
    true
  );

}

async function handleVerifyReminder(
  reminder: any
) {

  const confirmed =
    window.confirm(

      "Verifikasi reminder ini?"

    );

  if (!confirmed)
    return;

  try {

  await verifyReminder(

  reminder.id,

  getReminderYear(
    reminder.month,
    reminder.day
  )

);

    alert(
      "Reminder berhasil diverifikasi"
    );

    await loadData();

  } catch (error) {

    console.error(
      error
    );

  }

}

async function handleCreateBooking(
  payload: any
) {

  if (
    !detailVehicle
  )
    return;

    const bookingData =
      await getBookings();

    const isConflict =
      bookingData.some(
        (booking: any) => {

          if (
            booking.vehicle_id !==
            selectedVehicle.id
          ) {
            return false;
          }

          const newStart =
            new Date(
              payload.booking_date
            );

          const newEnd =
            new Date(
              payload.end_date
            );

          const existingStart =
            new Date(
              booking.booking_date
            );

          const existingEnd =
            new Date(
              booking.end_date
            );

          return (

            newStart <=
              existingEnd &&

            newEnd >=
              existingStart

          );

        }
      );

    if (isConflict) {

      alert(
        "Tanggal booking bertabrakan dengan booking lain."
      );

      return;

    }
    
  await createBooking({

    vehicle_id:
     detailVehicle?.id,

    ...payload,

  });

  

 const refreshedBookings =
  await getBookings();

setBookings(

  refreshedBookings.filter(

    (item) =>

      item.vehicle_id ===
      detailVehicle?.id

  )

);

  setOpenBookingForm(
    false
  );

}

async function handleUpdateBooking(
  payload: any
) {

  if (
    !selectedBooking
  )
    return;

  await updateBooking(

    selectedBooking.id,

    payload

  );

  const bookingData =
    await getVehicleBookings();

  setBookings(

    bookingData.filter(

      (item: any) =>

        item.vehicle_id ===
       detailVehicle?.id

    )

  );

  setSelectedBooking(
    null
  );

  setOpenBookingForm(
    false
  );

}

async function handleDeleteBooking(
  id: number
) {

  const confirmDelete =
    window.confirm(
      "Hapus booking ini?"
    );

  if (!confirmDelete)
    return;

  await deleteBooking(
    id
  );

  const bookingData =
    await getVehicleBookings();

  setBookings(

    bookingData.filter(

      (item: any) =>

        item.vehicle_id ===
        detailVehicle?.id

    )

  );

}

function handleEditBooking(
  booking: any
) {

  setSelectedBooking(
    booking
  );

  setOpenBookingForm(
    true
  );

}

 return {

  vehicles,

  loading,

  loadData,

  openForm,
  setOpenForm,

  selectedVehicle,
  setSelectedVehicle,

  handleCreate,
  handleUpdate,
  handleDelete,
  openDetail,
setOpenDetail,

handleCreateReminder,

reminders,
detailVehicle,       
  setOpenReminderForm,

handleDetail,
 openReminderForm,
handleDeleteReminder,
handleCloseDetail,
selectedReminder,
setSelectedReminder,
handleEditReminder,
handleUpdateReminder,
handleVerifyReminder,
reminderLogs,
bookings,

openBookingForm,

setOpenBookingForm,

handleCreateBooking,

selectedBooking,
setSelectedBooking,

handleEditBooking,
handleUpdateBooking,
handleDeleteBooking,

setDetailVehicle,

};
}