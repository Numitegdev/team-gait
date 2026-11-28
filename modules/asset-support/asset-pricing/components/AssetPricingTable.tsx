
"use client";

import { useEffect, useState } from "react";

import type { PricingItem } from "../hooks/use-asset-pricing";

interface AssetPricingTableProps {
  items: PricingItem[];
  loading: boolean;
  saving: boolean;
  onAddPricing: (
    modelId: number,
    monthlyPrice: number
  ) => Promise<unknown>;
  onEditPricing: (
    id: number,
    modelId: number,
    monthlyPrice: number
  ) => Promise<unknown>;
}

export default function AssetPricingTable({
  items,
  loading,
  saving,
  onAddPricing,
  onEditPricing,
}: AssetPricingTableProps) {
  const [prices, setPrices] = useState<
    Record<number, string>
  >({});

  const [editingModel, setEditingModel] =
    useState<number | null>(null);

  useEffect(() => {
    const initialPrices: Record<number, string> = {};

    for (const item of items) {
      if (item.pricing) {
        initialPrices[item.model_id] =
          String(item.pricing.monthly_price);
      }
    }

    setPrices(initialPrices);
  }, [items]);

  function handlePriceChange(
    modelId: number,
    value: string
  ) {
    setPrices((current) => ({
      ...current,
      [modelId]: value,
    }));
  }

  async function handleSave(item: PricingItem) {
    const rawPrice = prices[item.model_id] ?? "";
    const price = Number(rawPrice);

    if (
      rawPrice.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      alert("Harga sewa harus diisi dengan benar.");
      return;
    }

    try {
      if (item.pricing) {
        await onEditPricing(
          item.pricing.id,
          item.model_id,
          price
        );
      } else {
        await onAddPricing(
          item.model_id,
          price
        );
      }

      setEditingModel(null);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500">
        Memuat data harga sewa...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500">
        Belum ada Model Asset milik PT ini.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-5 py-4 font-semibold">
                Family
              </th>

              <th className="px-5 py-4 font-semibold">
                Model Asset
              </th>

              <th className="px-5 py-4 text-center font-semibold">
                Jumlah Dipinjam
              </th>

              <th className="px-5 py-4 font-semibold">
                Harga / Bulan
              </th>

              <th className="px-5 py-4 text-center font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const hasPricing =
                item.pricing !== null;

              const isEditing =
                editingModel === item.model_id;

              const price =
                prices[item.model_id] ?? "";

              return (
                <tr
                  key={item.model_id}
                  className="border-b last:border-b-0"
                >
                  {/* Family */}
                  <td className="px-5 py-4 align-top">
                    <div className="font-semibold text-gray-900">
                      Family {item.family_code}
                    </div>
                  </td>

                  {/* Model */}
                  <td className="px-5 py-4 align-top">
                    <div className="font-medium text-gray-900">
                      {item.model_name}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      Model ID: {item.model_id}
                    </div>
                  </td>

                  {/* Jumlah */}
                  <td className="px-5 py-4 text-center align-top">
                    <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-gray-100 px-3 py-1 font-semibold">
                      {item.asset_count}
                    </span>
                  </td>

                  {/* Harga */}
                  <td className="px-5 py-4 align-top">
                    {hasPricing && !isEditing ? (
                      <div className="font-semibold text-gray-900">
                        Rp{" "}
                        {Number(
                          item.pricing?.monthly_price ?? 0
                        ).toLocaleString("id-ID")}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">
                          Rp
                        </span>

                        <input
                          type="number"
                          min="0"
                          value={price}
                          onChange={(e) =>
                            handlePriceChange(
                              item.model_id,
                              e.target.value
                            )
                          }
                          placeholder="0"
                          disabled={saving}
                          className="
                            h-10
                            w-40
                            rounded-xl
                            border
                            px-3
                            outline-none
                            focus:border-black
                            disabled:bg-gray-100
                          "
                        />
                      </div>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-center align-top">
                    {!hasPricing ? (
                      <button
                        type="button"
                        onClick={() => handleSave(item)}
                        disabled={saving}
                        className="
                          rounded-xl
                          bg-black
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-white
                          transition
                          hover:opacity-80
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        {saving ? "Saving..." : "Done"}
                      </button>
                    ) : isEditing ? (
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSave(item)}
                          disabled={saving}
                          className="
                            rounded-xl
                            bg-black
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-white
                            hover:opacity-80
                            disabled:opacity-50
                          "
                        >
                          {saving ? "Saving..." : "Simpan"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingModel(null)}
                          disabled={saving}
                          className="
                            rounded-xl
                            border
                            px-4
                            py-2
                            text-sm
                            font-medium
                            hover:bg-gray-50
                            disabled:opacity-50
                          "
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingModel(item.model_id)
                        }
                        disabled={saving}
                        className="
                          rounded-xl
                          border
                          px-4
                          py-2
                          text-sm
                          font-medium
                          hover:bg-gray-50
                          disabled:opacity-50
                        "
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
