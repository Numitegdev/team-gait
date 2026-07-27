"use client";

import { useState } from "react";

import AssetToolbar from "./components/AssetToolbar";
import AssetTable from "./components/AssetTable";
import AssetPagination from "./components/AssetPagination";
import AssetModal from "./components/AssetModal";
import AssetDetailModal from "./components/AssetDetailModal";
import {

  deleteAsset,

} from "./services/asset-service";

import { useAssets } from "./hooks/use-assets";

export default function AssetsPage() {

  const {

    assets,

    loading,

    search,

    setSearch,

    page,

    setPage,

    totalPages,

    loadAssets,

  } = useAssets();

const [openModal, setOpenModal] =
  useState(false);

const [selectedAssetId, setSelectedAssetId] =
  useState<number | null>(null);

const [openDetail, setOpenDetail] =
  useState(false);

const [selectedDetailId, setSelectedDetailId] =
  useState<number | null>(null);
  
  
  async function handleDelete(
  id: number
) {

  const confirmDelete =
    window.confirm(
      "Yakin ingin menonaktifkan asset ini?"
    );

  if (!confirmDelete)
    return;

  try {

    await deleteAsset(id);

    alert(
      "Asset berhasil dinonaktifkan."
    );

    loadAssets();

  } catch (error) {

    console.error(error);

    alert(
      "Gagal menghapus asset."
    );

  }

}

  return (

    <div
      className="
        space-y-5
      "
    >

      {/* Header */}

      <div>

        <h1
          className="
            text-2xl
            font-bold
          "
        >

          Assets Management

        </h1>

        <p
          className="
            text-sm
            text-gray-500
          "
        >

          Kelola seluruh asset perusahaan.

        </p>

      </div>

      <AssetToolbar

        search={search}

        setSearch={setSearch}

       onAdd={() => {

        setSelectedAssetId(
          null
        );

        setOpenModal(true);

      }}

      />

      <AssetTable

        assets={assets}

        loading={loading}

        onView={(id) => {

          setSelectedDetailId(id);

          setOpenDetail(true);

        }}

        onEdit={(id) => {

          setSelectedAssetId(id);

          setOpenModal(true);

        }}

        onDelete={handleDelete}

      />

      <AssetPagination

        page={page}

        totalPages={totalPages}

        setPage={setPage}

      />

        <AssetModal

          open={openModal}

          assetId={selectedAssetId}

          onClose={() => {

            setOpenModal(false);

            setSelectedAssetId(null);

          }}

          onSuccess={loadAssets}

        />

        <AssetDetailModal

          open={openDetail}

          assetId={selectedDetailId}

          onClose={() => {

            setOpenDetail(false);

            setSelectedDetailId(null);

          }}

        />

    </div>

  );

}