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
}
from "../services/kendaraan-list-service";

import {
  getVehicleReminders,
}
from "../services/kendaraan-reminder-service";

import {
  createReminder,
}
from "../services/create-reminder-service";

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

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    try {

      setLoading(true);

      const data =
        await getVehicles();

      setVehicles(data);

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

  } catch (error) {

    console.error(
      error
    );

    alert(
      "Gagal hapus kendaraan"
    );

  }

}

async function handleDetail(
  vehicle: any
) {

  const data =
    await getVehicleReminders(
      vehicle.id
    );

  setReminders(
    data
  );

  setSelectedVehicle(
    vehicle
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

  await createReminder({

    vehicle_id:
      detailVehicle.id,

    ...payload,

  });

  const reminders =
    await getVehicleReminders(
      detailVehicle.id
    );

  setReminders(
    reminders
  );

  setOpenReminderForm(
    false
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

};
}