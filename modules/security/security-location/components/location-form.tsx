"use client";

import {
  useState,
} from "react";

interface Props {

  onSubmit: (
    nama: string
  ) => Promise<void>;

}

export function LocationForm({

  onSubmit,

}: Props) {

  const [
    nama,
    setNama,
  ] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    if (!nama.trim())
      return;

    await onSubmit(
      nama
    );

    setNama("");

  }

  return (

    <form
      onSubmit={
        handleSubmit
      }
    >

    <input
        value={nama}
        onChange={(e) =>
            setNama(e.target.value)
        }
        placeholder="Masukkan nama lokasi"
        className="
            flex-1
            rounded-xl
            border
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
        "
        />

      <button
        type="submit"
        className="
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-medium
            text-white
        "
        >
        Tambah Lokasi
        </button>
    </form>

  );

}