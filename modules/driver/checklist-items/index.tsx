"use client";

import {

  Plus,

} from "lucide-react";

import {

  useChecklistItems,

}
from "./hooks/use-checklist-items";

import {

  ChecklistItemsTable,

}
from "./components/checklist-items-table";

import {

  ChecklistItemModal,

}
from "./components/checklist-item-modal";

export default function ChecklistItemsPage() {

  const {

    checklistItems,

    loading,

    openModal,

    setOpenModal,

    selectedItem,

    setSelectedItem,

    handleCreate,

    handleUpdate,

    handleDeactivate,

  }
  =
  useChecklistItems();

  return (

    <div
      className="
        p-4
        md:p-6
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h1
          className="
            text-2xl
            font-bold
          "
        >

          Master Checklist Item

        </h1>

        <button

          onClick={() => {

            setSelectedItem(
              null
            );

            setOpenModal(
              true
            );

          }}

          className="
            flex
            items-center
            gap-2
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-white
          "

        >

          <Plus
            className="
              h-4
              w-4
            "
          />

          Tambah Item

        </button>

      </div>

      <div
        className="
          mt-6
        "
      >

        <ChecklistItemsTable

          data={
            checklistItems
          }

          onEdit={(item) => {

            setSelectedItem(
              item
            );

            setOpenModal(
              true
            );

          }}

          onDeactivate={
            handleDeactivate
          }

        />

      </div>

      <ChecklistItemModal

        open={
          openModal
        }

        item={
          selectedItem
        }

        onClose={() =>

          setOpenModal(
            false
          )

        }

        onSubmit={

          async (
            payload
          ) => {

            if (
              selectedItem
            ) {

              await handleUpdate(

                selectedItem.id,

                payload

              );

            } else {

              await handleCreate(
                payload
              );

            }

          }

        }

      />

    </div>

  );

}