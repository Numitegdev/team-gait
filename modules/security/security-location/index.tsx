"use client";

import {
  LocationForm,
}
from "./components/location-form";

import {
  LocationTable,
}
from "./components/location-table";

import {
  useSecurityLocation,
}
from "./hooks/use-security-location";

export default function SecurityLocationPage() {

  const {

  locations,

  createLocation,

  updateLocation,

  toggleLocation,

  loadLocations,

}
=
useSecurityLocation();


    
  async function handleCreate(
    nama: string
  ) {

    await createLocation(
      nama
    );

    await loadLocations();

  }

  async function handleToggle(
    id: number,
    aktif: boolean
  ) {

    await toggleLocation(
      id,
      aktif
    );

    await loadLocations();

  }

async function handleEdit(

  id: number,

  nama: string

) {

  await updateLocation(
    id,
    nama
  );

  await loadLocations();

}

  return (

    <div
      className="
        space-y-6
      "
    >

      <h1
        className="
          text-3xl
          font-bold
        "
      >

        Security Location

      </h1>

      <LocationForm
        onSubmit={
          handleCreate
        }
      />

     <LocationTable

  data={locations}

  onToggle={
    handleToggle
  }

  onEdit={
    handleEdit
  }

/>

    </div>

  );

}