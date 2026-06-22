"use client";

import {
  useState,
} from "react";

import {
  useKendaraanList,
}
from "./hooks/use-kendaraan-list";

import {
  VehicleCard,
}
from "./components/vehicle-card";

import {
  VehicleFormModal,
}
from "./components/vehicle-form-modal";

import {
  VehicleDetailModal,
}
from "./components/vehicle-detail-modal";

import {
  ReminderFormModal,
}
from "./components/reminder-form-modal";

import {
  BookingFormModal,
}
from "./components/booking-form-modal";

export default function KendaraanListPage() {

 const {

  vehicles,

  openForm,

  setOpenForm,

  selectedVehicle,
  
detailVehicle,
 
  setSelectedVehicle,

  handleCreate,

  handleUpdate,

  handleDelete,
  openDetail,
 setOpenDetail,
setOpenReminderForm,
handleCreateReminder,
openReminderForm,
reminders,
handleDetail,
handleDeleteReminder,
handleCloseDetail,
selectedReminder,
  handleUpdateReminder,
  handleEditReminder,
  handleVerifyReminder,
  reminderLogs,

  bookings,

openBookingForm,

setOpenBookingForm,

handleCreateBooking,

selectedBooking,
setSelectedBooking,
handleUpdateBooking,
  handleDeleteBooking,
}
=
useKendaraanList();

const handleEditBooking =
  (booking: any) => {

    setSelectedBooking(
      booking
    );

    setOpenBookingForm(
      true
    );

  };

  const [search, setSearch] =
  useState("");

  return (

    <div
      className="
        p-4
        md:p-6
      "
    >

      <h1
        className="
          text-2xl
          font-bold
        "
      >
        Kendaraan
      </h1>

      <div
  className="
    mt-4
    grid
    gap-4
    md:grid-cols-2
  "
>

  <div
    className="
      rounded-xl
      border
      bg-white
      p-4
      shadow-sm
    "
  >

    <div
      className="
        text-sm
        text-slate-500
      "
    >
      Total Kendaraan
    </div>

    <div
      className="
        mt-1
        text-3xl
        font-bold
      "
    >
      {vehicles.length}
    </div>

  </div>

  <div
    className="
      rounded-xl
      border
      bg-white
      p-4
      shadow-sm
    "
  >

    <div
      className="
        text-sm
        text-slate-500
      "
    >
      Booking Aktif
    </div>

    <div
      className="
        mt-1
        text-3xl
        font-bold
        text-indigo-600
      "
    >
      {
        vehicles.reduce(

          (total, vehicle) =>

            total +

            (
              vehicle.bookings
              ?.length || 0
            ),

          0

        )
      }
    </div>

  </div>

</div>
           
<div
  className="
    mt-4
    flex
    flex-col
    gap-3
    md:flex-row
    md:items-center
    md:justify-between
  "
>

  <input

    value={search}

    onChange={(e) =>
      setSearch(
        e.target.value
      )
    }

    placeholder="
      Cari plat / nama kendaraan
    "

    className="
      w-full
      rounded-lg
      border
      px-4
      py-2
      md:max-w-sm
    "

  />

  <button

    onClick={() => {

      setSelectedVehicle(
        null
      );

      setOpenForm(
        true
      );

    }}

    className="
      rounded-lg
      bg-blue-600
      px-4
      py-2
      text-white
    "

  >

    + Tambah Kendaraan

  </button>

</div>

      <div
        className="
          mt-6
          grid
          gap-4

          md:grid-cols-2

          xl:grid-cols-4
        "
      >
        

        {

          vehicles

          .filter(
            (vehicle) =>

              vehicle.plat_nomor
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )

              ||

              vehicle.nama_kendaraan
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          )

          .map(
            (vehicle) => (

             <VehicleCard

                key={
                    vehicle.id
                }

                vehicle={
                    vehicle
                }

                onEdit={(
                    vehicle
                ) => {

                    setSelectedVehicle(
                    vehicle
                    );

                    setOpenForm(
                    true
                    );

                }}

                onDelete={
                    handleDelete
                }

                    onDetail={
                    handleDetail
                }

              reminderLogs={
                reminderLogs
              }

                />

            )
          )

        }

      </div>
<VehicleFormModal

  open={openForm}

  vehicle={selectedVehicle}

  onClose={() => {

    setOpenForm(false);

    setSelectedVehicle(null);

  }}

  onSubmit={(payload) => {

    if (selectedVehicle) {

      handleUpdate(
        selectedVehicle.id,
        payload
      );

    } else {

      handleCreate(
        payload
      );

    }

  }}

/>

<BookingFormModal

  open={
    openBookingForm
  }

  booking={
    selectedBooking
  }

  onClose={() => {

    setOpenBookingForm(
      false
    );

    setSelectedBooking(
      null
    );

  }}

  onSubmit={

    selectedBooking

      ? handleUpdateBooking

      : handleCreateBooking

  }

/>


<VehicleDetailModal
  open={openDetail}
  vehicle={selectedVehicle}
  reminders={reminders}
  reminderLogs={reminderLogs}
  bookings={bookings}
  onClose={handleCloseDetail}
  onAddReminder={() =>
    setOpenReminderForm(true)
  }
  onAddBooking={() =>
    setOpenBookingForm(true)
  }
  onDeleteReminder={handleDeleteReminder}
  onEditReminder={handleEditReminder}
  onVerifyReminder={handleVerifyReminder}
 onEditBooking={handleEditBooking}
  onDeleteBooking={handleDeleteBooking}
/>


<ReminderFormModal

  open={openReminderForm}

  onClose={() =>
    setOpenReminderForm(false)
  }

  reminder={
    selectedReminder
  }

  onSubmit={(payload) => {

    if (
      selectedReminder
    ) {

      handleUpdateReminder(
        payload
      );

    } else {

      handleCreateReminder(
        payload
      );

    }

  }}

/>

    </div>



  );

}