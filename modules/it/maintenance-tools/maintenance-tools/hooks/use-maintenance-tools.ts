"use client";

import { useEffect, useState } from "react";

import {
  getTools,
  createTool,
  updateTool,
  deleteTool,
} from "../services/maintenance-tools-service";

import { MaintenanceTool }
from "../types/maintenance-tools";

export function useMaintenanceTools() {

  const [tools, setTools] =
    useState<MaintenanceTool[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  async function loadTools() {

    try {

      setLoading(true);

      const data =
        await getTools();

      setTools(data ?? []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  async function addTool(
    payload: Omit<
      MaintenanceTool,
      "id"
    >
  ) {

    await createTool(payload);

    await loadTools();

  }

  async function editTool(
    id: number,
    payload: Partial<MaintenanceTool>
  ) {

    await updateTool(
      id,
      payload
    );

    await loadTools();

  }

  async function removeTool(
    id: number
  ) {

    const confirmDelete =
      window.confirm(
        "Hapus tool ini?"
      );

    if (!confirmDelete)
      return;

    await deleteTool(id);

    await loadTools();

  }

  useEffect(() => {

    loadTools();

  }, []);

  const filteredTools =
    tools.filter((item) => {

      const keyword =
        search.toLowerCase();

      return (

        item.nama
          ?.toLowerCase()
          .includes(keyword)

        ||

        item.kategori
          ?.toLowerCase()
          .includes(keyword)

      );

    });

  return {

    tools:
      filteredTools,

    loading,

    search,
    setSearch,

    loadTools,

    addTool,
    editTool,
    removeTool,

  };

}