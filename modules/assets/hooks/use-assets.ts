"use client";

import { useEffect, useState } from "react";
import {AssetListItem} from "../types/AssetListItem";
import {

  getAssetList,

  getAssetById,

  createAsset,

  updateAsset,

  deleteAsset,

} from "../services/asset-service";

import { Asset } from "../types/asset";

export function useAssets() {

const [assets, setAssets] =
useState<AssetListItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const pageSize = 15;

  useEffect(() => {

    setPage(1);

  }, [search]);

  async function loadAssets() {

    try {

      setLoading(true);

      const data =
        await getAssetList();

      setAssets(data ?? []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

async function loadAssetDetail(
  id: number
) {

  return await getAssetById(id);

}

async function getAssetDetail(
  id: number
) {

  return await getAssetById(id);

}

  async function addAsset(
    payload: Omit<Asset, "id">
  ) {

    await createAsset(payload);

    await loadAssets();

  }

  async function editAsset(
    id: number,
    payload: Partial<Asset>
  ) {

    await updateAsset(
      id,
      payload
    );

    await loadAssets();

  }

  async function removeAsset(
    id: number
  ) {

    const confirmDelete =
      window.confirm(
        "Hapus asset ini?"
      );

    if (!confirmDelete) {

      return;

    }

    await deleteAsset(id);

    await loadAssets();

  }

  useEffect(() => {

    loadAssets();

  }, []);

  const filteredAssets =
    assets.filter((item) => {

      const keyword =
        search.toLowerCase();

      return (

        item.asset_code
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.asset_name
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.brand
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.serial_number
          ?.toLowerCase()
          .includes(keyword)

      );

    });

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredAssets.length /
        pageSize
      )
    );

  const paginatedAssets =
    filteredAssets.slice(

      (page - 1) * pageSize,

      page * pageSize

    );

  return {

    assets:
      paginatedAssets,

    fullAssets:
      filteredAssets,

    loading,

    page,
    setPage,

    totalPages,

    search,
    setSearch,

    loadAssets,

    loadAssetDetail,

    addAsset,

    editAsset,

    removeAsset,

    getAssetDetail,

  };

}