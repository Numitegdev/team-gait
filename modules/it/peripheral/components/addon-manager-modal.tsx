"use client";

import { useMemo, useState } from "react";

import { Addon } from "../types/peripheral.types";

interface Props {
  open: boolean;

  addons: Addon[];

  onClose: () => void;

  onAdd: (
    addonName: string
  ) => Promise<void>;

  onDelete: (
    id: number
  ) => Promise<void>;
}

export default function AddonManagerModal({
  open,
  addons,
  onClose,
  onAdd,
  onDelete,
}: Props) {
  const [addonName, setAddonName] =
    useState("");

  const [keyword, setKeyword] =
    useState("");

  const filteredAddons =
    useMemo(() => {
      return addons.filter((item) =>
        item.addon_name
          .toLowerCase()
          .includes(
            keyword.toLowerCase()
          )
      );
    }, [addons, keyword]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b p-5">

          <h2 className="text-xl font-semibold">
            Master Addon
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>

        </div>

        {/* BODY */}

        <div className="space-y-5 p-5">

          {/* ADD */}

          <div>

            <label className="mb-2 block text-sm font-medium">

              Nama Addon

            </label>

            <div className="flex gap-2">

              <input
                value={addonName}
                onChange={(e) =>
                  setAddonName(
                    e.target.value
                  )
                }
                className="flex-1 rounded-lg border px-3 py-2"
                placeholder="Contoh : SQL Server"
              />

              <button
                onClick={async () => {

                  if (
                    !addonName.trim()
                  )
                    return;

                  await onAdd(
                    addonName
                  );

                  setAddonName("");

                }}
                className="rounded-lg bg-blue-600 px-5 text-white"
              >
                Tambah
              </button>

            </div>

          </div>

          {/* SEARCH */}

          <input
            value={keyword}
            onChange={(e) =>
              setKeyword(
                e.target.value
              )
            }
            placeholder="Cari addon..."
            className="w-full rounded-lg border px-3 py-2"
          />

          {/* LIST */}

          <div className="max-h-96 overflow-y-auto rounded-lg border">

            {filteredAddons.length ===
            0 ? (

              <div className="p-6 text-center text-gray-500">

                Tidak ada addon.

              </div>

            ) : (

              filteredAddons.map(
                (addon) => (

                  <div
                    key={addon.id}
                    className="flex items-center justify-between border-b p-4 last:border-b-0"
                  >

                    <span>

                      {
                        addon.addon_name
                      }

                    </span>

                    <button
                      onClick={() =>
                        onDelete(
                          addon.id
                        )
                      }
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>

    </div>
  );
}