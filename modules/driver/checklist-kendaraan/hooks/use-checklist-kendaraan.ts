"use client";

import {
  createClient,
}
from "@/lib/supabase/client";

import {
  useEffect,
  useState,
}
from "react";

import {
  getVehicles,
  getVehicleReminders,
  getVehicleBookings,
}
from "../../kendaraan-list/services/kendaraan-list-service";


import {
  getChecklistItems,
}
from "../services/checklist-item-service";

import {

  createChecklistHeader,

  createChecklistDetail,

  checkTodayChecklist,

}
from "../services/checklist-service";

import {
  uploadChecklistPhoto,
}
from "../services/checklist-photo-service";

export function useChecklistKendaraan() {

  const supabase =
  createClient();

  const [

    vehicles,

    setVehicles,

  ] = useState<any[]>([]);

  const [

    loading,

    setLoading,

  ] = useState(false);

  useEffect(() => {

    loadData();

  }, []);

  const [

  checklistItems,

  setChecklistItems,

] = useState<any[]>([]);

const [

  openChecklist,

  setOpenChecklist,

] = useState(false);

const [

  selectedVehicle,

  setSelectedVehicle,

] = useState<any>(null);

  async function loadData() {

    try {

      setLoading(true);

      const vehicleData =
        await getVehicles();

      const reminderData =
        await getVehicleReminders();

      const bookingData =
        await getVehicleBookings();

        const items =
          await getChecklistItems();

        setChecklistItems(
          items
        );

      const merged =
        vehicleData.map(
          (vehicle: any) => ({

            ...vehicle,

            reminders:
              reminderData.filter(

                (item: any) =>

                  item.vehicle_id ===
                  vehicle.id

              ),

            bookings:
              bookingData.filter(

                (item: any) =>

                  item.vehicle_id ===
                  vehicle.id

              ),

          })
        );

      setVehicles(
        merged
      );

    } finally {

      setLoading(false);

    }

  }


  async function handleSubmitChecklist(
  payload: any
) {

  if (
    !selectedVehicle
  )
    return;

    const {

      answers,

      photos,

       notes,

    }
    =
    payload;

  try {

    const {

      data: { user },

    } =
      await supabase.auth.getUser();

    if (!user)
      return;

    const today =
      new Date()

        .toISOString()

        .split("T")[0];
    
    const existing =
        await checkTodayChecklist(

          selectedVehicle.id,

          user.id,

          today

        );

      if (existing) {

        alert(
          "Checklist kendaraan ini sudah dibuat hari ini."
        );

        return;

      }

    const header =
      await createChecklistHeader({

        vehicle_id:
          selectedVehicle.id,

        user_id:
          user.id,

        checklist_date:
          today,

        status:
          "pending",

      });

   for (

  const itemId of

  Object.keys(
    answers
  )

) {

  

let photoUrl =
  null;

if (

  photos?.[itemId]

) {

  photoUrl =
    await uploadChecklistPhoto(

      photos[itemId]

    );

}
  await createChecklistDetail({

  checklist_id:
    header.id,

  item_id:
    Number(itemId),

  condition:
    answers[itemId],

  photo_url:
    photoUrl,

  notes:
    notes?.[itemId]
    ?? null,

});
}

    alert(
      "Checklist berhasil disimpan"
    );

    setOpenChecklist(
      false
    );

  } catch (error: any) {

  console.error(
    "CHECKLIST ERROR:",
    error
  );

  alert(
    JSON.stringify(error)
  );

}

}
  return {

    vehicles,

    loading,

    loadData,

    checklistItems,

    openChecklist,

    setOpenChecklist,

    selectedVehicle,
    
    setSelectedVehicle,

    handleSubmitChecklist,

  };

}