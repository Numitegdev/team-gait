"use client";

import { useState } from "react";
import { Peripheral } from "../types/peripheral.types";

interface Props {
  open: boolean;
  peripheral: Peripheral | null;
  onClose: () => void;
}

export default function HardwareDetailModal({
  open,
  peripheral,
  onClose,
}: Props) {
  const [tab, setTab] = useState<
    "hardware" | "software" | "network"
  >("hardware");

  if (!open || !peripheral) return null;

  const hardware = peripheral.hardware;

  const software = peripheral.software ?? [];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">

      <div className="bg-white rounded-xl w-[900px] max-h-[90vh] overflow-hidden">

        {/* HEADER */}

        <div className="border-b p-6 flex justify-between">

          <div>

            <h2 className="text-xl font-semibold">
              {peripheral.ip_management.device}
            </h2>

            <p className="text-sm text-gray-500">
              {peripheral.ip_management.ip_terkini}
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-gray-500"
          >
            ✕
          </button>

        </div>

        {/* TAB */}

        <div className="border-b flex">

          <button
            onClick={() =>
              setTab("hardware")
            }
            className={`px-5 py-3 ${
              tab === "hardware"
                ? "border-b-2 border-blue-600 font-semibold"
                : ""
            }`}
          >
            Hardware
          </button>

          <button
            onClick={() =>
              setTab("software")
            }
            className={`px-5 py-3 ${
              tab === "software"
                ? "border-b-2 border-blue-600 font-semibold"
                : ""
            }`}
          >
            Software
          </button>

          <button
            onClick={() =>
              setTab("network")
            }
            className={`px-5 py-3 ${
              tab === "network"
                ? "border-b-2 border-blue-600 font-semibold"
                : ""
            }`}
          >
            Network
          </button>

        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto p-6 max-h-[70vh]">

          {tab === "hardware" && (

            <div className="space-y-6">

              {/* CPU */}

              <section>

                <h3 className="font-semibold mb-2">
                  CPU
                </h3>

                <div className="border rounded-lg p-4">

                  <div>
                    {hardware?.cpu?.model}
                  </div>

                  <div className="text-sm text-gray-500">

                    {hardware?.cpu?.cores} Core ·{" "}
                    {hardware?.cpu?.threads} Thread

                  </div>

                </div>

              </section>

              {/* MEMORY */}

              <section>

                <h3 className="font-semibold mb-2">
                  Memory
                </h3>

                <div className="border rounded-lg p-4">

                  <div className="font-medium mb-3">

                    Total {hardware?.memory?.total_gb} GB

                  </div>

                  {hardware?.memory?.modules?.map(
                    (ram: any, index: number) => (

                      <div
                        key={index}
                        className="border-t py-2 first:border-0"
                      >

                        {ram.manufacturer}

                        {" • "}

                        {ram.size_gb} GB

                        {" • "}

                        {ram.type}

                        {" • "}

                        {ram.speed} MHz

                      </div>

                      

                    )
                    
                  )}

                </div>

              </section>

              {/* STORAGE */}

              <section>

                <h3 className="font-semibold mb-2">
                  Storage
                </h3>

                <div className="border rounded-lg">

                  {hardware?.storage?.physical?.map(
                    (
                      disk: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="border-b p-4 last:border-0"
                      >

                        <div className="font-medium">

                          {disk.model}

                        </div>

                        <div className="text-sm text-gray-500">

                          {disk.media_type}

                          {" • "}

                          {disk.bus_type}

                          {" • "}

                          {disk.size_gb} GB

                        </div>

                      </div>

                    )
                  )}

                </div>

              </section>

              {/* GPU */}

              <section>

                <h3 className="font-semibold mb-2">
                  GPU
                </h3>

                <div className="border rounded-lg">

                  {hardware?.gpu?.map(
                    (
                      gpu: any,
                      index: number
                    ) => (

                      <div
                        key={index}
                        className="border-b p-4 last:border-0"
                      >

                        <div>

                          {gpu.name}

                        </div>

                        <div className="text-sm text-gray-500">

                          {gpu.adapter_ram_mb} MB

                        </div>

                      </div>

                    )
                  )}

                </div>

              </section>

              {/* Motherboard */}

              <section>

                <h3 className="font-semibold mb-2">
                  Motherboard
                </h3>

                <div className="border rounded-lg p-4">

                  <div>

                    {hardware?.motherboard?.manufacturer}

                  </div>

                  <div>

                    {hardware?.motherboard?.product}

                  </div>

                  <div className="text-sm text-gray-500">

                    {hardware?.motherboard?.serial_number}

                  </div>

                </div>

              </section>

              {/* BIOS */}

              <section>

                <h3 className="font-semibold mb-2">
                  BIOS
                </h3>

                <div className="border rounded-lg p-4">

                  <div>

                    {hardware?.bios?.manufacturer}

                  </div>

                  <div>

                    {hardware?.bios?.version}

                  </div>

                </div>

              </section>

            </div>

          )}

          {tab === "software" && (

            <div className="space-y-3">

              {software.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                    className="border rounded-lg p-4 flex justify-between"
                  >

                    <div>

                      <div className="font-medium">

                        {item.name}

                      </div>

                      <div className="text-sm text-gray-500">

                        {item.version || "-"}

                      </div>

                    </div>

                    <div>

                      {item.installed
                        ? "✅ Installed"
                        : "❌ Not Installed"}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

          {tab === "network" && (

            <div className="space-y-4">

              {hardware?.network?.map(
                (
                  net: any,
                  index: number
                ) => (

                  <div
                    key={index}
                    className="border rounded-lg p-4"
                  >

                    <div className="font-semibold">

                      {net.adapter}

                    </div>

                    <div>IP : {net.ipv4}</div>

                    <div>Gateway : {net.gateway}</div>

                    <div>DNS : {JSON.stringify(net.dns)}</div>

                    <div>MAC : {net.mac_address}</div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


      </div>

    </div>
  );
}