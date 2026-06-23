"use client";

import {

  useEffect,

  useState,

} from "react";

import {

  getAllChecklistItems,

  createChecklistItem,

  updateChecklistItem,

  deactivateChecklistItem,

}
from "../services/checklist-items-service";

export function useChecklistItems() {

  const [

    checklistItems,

    setChecklistItems,

  ] = useState<any[]>([]);

  const [

    loading,

    setLoading,

  ] = useState(false);

  const [

    openModal,

    setOpenModal,

  ] = useState(false);

  const [

    selectedItem,

    setSelectedItem,

  ] = useState<any>(
    null
  );

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    try {

      setLoading(
        true
      );

      const data =
        await getAllChecklistItems();

      setChecklistItems(
        data
      );

    } finally {

      setLoading(
        false
      );

    }

  }

  async function handleCreate(
    payload: any
  ) {

    await createChecklistItem(
      payload
    );

    await loadData();

    setOpenModal(
      false
    );

  }

  async function handleUpdate(
    id: number,
    payload: any
  ) {

    await updateChecklistItem(

      id,

      payload

    );

    await loadData();

    setOpenModal(
      false
    );

  }

  async function handleDeactivate(
    id: number
  ) {

    const confirmDelete =
      confirm(
        "Nonaktifkan item checklist?"
      );

    if (
      !confirmDelete
    )
      return;

    await deactivateChecklistItem(
      id
    );

    await loadData();

  }

  return {

    checklistItems,

    loading,

    loadData,

    openModal,

    setOpenModal,

    selectedItem,

    setSelectedItem,

    handleCreate,

    handleUpdate,

    handleDeactivate,

  };

}