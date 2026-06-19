"use client";

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
    flex
    justify-end
  "
>

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

          vehicles.map(
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