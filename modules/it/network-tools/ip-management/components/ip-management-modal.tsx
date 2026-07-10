"use client";

import { useEffect, useState } from "react";

import { rooms } from "../constants/room-options";

import { Device } from "../types/ip-management";

import { findAvailableIP } from "../utils/find-available-ip";

interface Props {
  open: boolean;
  onClose: () => void;

  onSave: (payload: any) => Promise<void>;

  editingDevice?: Device | null;

  usedIPs: string[];

  existingDevices: Device[];
}

export function IPManagementModal({
  open,
  onClose,
  onSave,
  editingDevice,
  usedIPs,
  existingDevices,
}: Props) {
  const [ipError, setIpError] =
    useState("");

 const [
  recommendedIP,
  
  setRecommendedIP,
] = useState("");

const emptyForm = {
  ruangan: "",
  jenis_network: "Network Office",
  device: "",
  ip_terkini: "",
  fungsional: "Office",
  whitelist: "-",
  keterangan: "",
  isp_utama: "",
  isp_backup: "",
};


const [
  availableIPs,
  setAvailableIPs,
] = useState<string[]>([]);

  const [form, setForm] = useState({
  ruangan: "",
  jenis_network: "Network Office",

  device: "",

  ip_terkini: "",

  fungsional: "Office",

  whitelist: "-",

  keterangan: "",

  isp_utama: "",

  isp_backup: "",


  
});


  useEffect(() => {
    if (!editingDevice) {
      setForm({
        ruangan: "",
        jenis_network:
          "Network Office",

        device: "",

        ip_terkini: "",

        fungsional: "Office",

        whitelist: "-",

        keterangan: "",

        isp_utama: "",

        isp_backup: "",
      });

      return;
    }

    setForm({
  ruangan: editingDevice.ruangan,
  jenis_network: editingDevice.jenis_network,
  device: editingDevice.device,
  ip_terkini: editingDevice.ip_terkini,
  fungsional: editingDevice.fungsional,
  whitelist: editingDevice.whitelist,
  keterangan: editingDevice.keterangan,

  isp_utama: editingDevice.isp_utama ?? "",

  isp_backup: editingDevice.isp_backup ?? "",
});
  }, [editingDevice]);

 useEffect(() => {

  const result =
    findAvailableIP(
      form.ruangan,
      form.jenis_network,
      usedIPs
    );

  setRecommendedIP(
    result.recommendedIP || ""
  );

  setAvailableIPs(
    result.availableIPs || []
  );

}, [
  form.ruangan,
  form.jenis_network,
  usedIPs,
]);


  if (!open) return null;

  async function handleSave() {
    if (form.ip_terkini !== "0.0.0.0") {

  const duplicateIP =
    existingDevices.find((device) => {

      if (
        editingDevice &&
        device.id === editingDevice.id
      ) {
        return false;
      }

      return (
        device.ip_terkini.trim() ===
        form.ip_terkini.trim()
      );

    });

  if (duplicateIP) {

    setIpError(
      "IP Address sudah digunakan."
    );

    return;

  }

}

// setIpError("");

 try {

  await onSave(form);

  setForm(emptyForm);

  setIpError("");

  setRecommendedIP("");

  setAvailableIPs([]);

  onClose();

} catch (error: any) {

  setIpError(
    error.message ||
    "Gagal menyimpan data."
  );

}

    
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
      "
    >
      <div
      className="
        w-full
        max-w-3xl
        max-h-[90vh]
        overflow-auto
        rounded-2xl
        bg-white
        p-6
        shadow-xl
      "
>
        <h2
          className="
            mb-6
            text-2xl
            font-bold
          "
        >
          {editingDevice
            ? "Edit Device"
            : "Add Device"}
        </h2>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
          "
        >
          <select
          value={form.ruangan}
          onChange={(e) => {

            const room =
              e.target.value;

            const serverRooms = [
              "R19", // Server Utama
              "R26", // Telemarketing & CS
              "R18", // Operator
              "R3", // Voucher
            ];

            setForm({
              ...form,

              ruangan: room,

              jenis_network:
                serverRooms.includes(room)
                  ? "Network Server"
                  : "Network Office",
            });

          }}
            className="
              rounded-xl
              border
              p-3
            "
          >
            <option value="">
              Pilih Ruangan
            </option>

               {rooms.map((room) => (
              <option
                key={room.code}
                value={room.code}
              >
                {room.name}
              </option>
            ))}
          </select>

         <input
          value={
            form.jenis_network
          }
          readOnly
          className="
            rounded-xl
            border
            bg-slate-100
            p-3
          "
        />

          <input
            value={form.device}
            onChange={(e) =>
              setForm({
                ...form,
                device:
                  e.target.value,
              })
            }
            placeholder="Nama Device"
            className="
              rounded-xl
              border
              p-3
            "
          />

          <input
            value={
              form.ip_terkini
            }
            onChange={(e) =>
              setForm({
                ...form,
                ip_terkini:
                  e.target.value,
              })
            }
            placeholder="IP Address"
            className="
              rounded-xl
              border
              p-3
            "
          />

          <select
            value={
              form.fungsional
            }
            onChange={(e) =>
              setForm({
                ...form,
                fungsional:
                  e.target.value,
              })
            }
            className="
              rounded-xl
              border
              p-3
            "
          >
            <option>
              Office
            </option>

            <option>
              DB_Utama
            </option>

            <option>
              DB_Mirror
            </option>

            <option>
              No_DB
            </option>
          </select>

          <select
            value={
              form.whitelist
            }
            onChange={(e) =>
              setForm({
                ...form,
                whitelist:
                  e.target.value,
              })
            }
            className="
              rounded-xl
              border
              p-3
            "
          >
            <option>-</option>

            <option>
              DB_Utama
            </option>

            <option>
              DB_Mirror
            </option>
          </select>

<div>
  <label className="mb-1 block text-sm font-medium">
    ISP Utama
  </label>

  <input
    type="text"
    value={form.isp_utama}
    onChange={(e) =>
      setForm({
        ...form,
        isp_utama: e.target.value,
      })
    }
    className="
      w-full
      rounded-lg
      border
      p-2
    "
    placeholder="Contoh : Telkom"
  />
</div>

<div>
  <label className="mb-1 block text-sm font-medium">
    ISP Backup
  </label>

  <input
    type="text"
    value={form.isp_backup}
    onChange={(e) =>
      setForm({
        ...form,
        isp_backup: e.target.value,
      })
    }
    className="
      w-full
      rounded-lg
      border
      p-2
    "
    placeholder="Contoh : Biznet"
  />
</div>



        </div>

        {ipError && (
          <p
            className="
              mt-3
              text-sm
              text-red-500
            "
          >
            {ipError}
          </p>
        )}

        {recommendedIP && (

          <div
            className="
              mt-3
              rounded-xl
              border
              border-green-300
              bg-green-50
              p-4
            "
          >

           <p
              className="
                text-xs
                font-semibold
                text-green-600
              "
            >
              Recommended IP
            </p>

            <div
              className="
                mt-2
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-lg
                    font-bold
                    text-green-700
                  "
                >
                  {recommendedIP}
                </p>

                <p
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  IP pertama yang tersedia
                </p>

              </div>

              <button

                type="button"

                onClick={() =>
                  setForm({
                    ...form,
                    ip_terkini:
                      recommendedIP,
                  })
                }

                className="
                  rounded-xl
                  bg-green-600
                  px-4
                  py-2
                  text-white
                "
              >

                Gunakan IP Ini

              </button>

            </div>

          </div>

        )}

        {availableIPs.length > 0 && (

  <div
    className="
      mt-4
      rounded-xl
      border
      p-4
    "
  >

    <p
      className="
        mb-3
        text-sm
        font-semibold
      "
    >
      Available IP
    </p>

    <div
      className="
        flex
        flex-wrap
        gap-2
        max-h-40
        overflow-auto
      "
    >

      {availableIPs
        .slice(0, 10)
        .map((ip) => (

          <button
            key={ip}
            type="button"
            onClick={() =>
              setForm({
                ...form,
                ip_terkini: ip,
              })
            }
            className="
              rounded-lg
              border
              px-2
              py-1
              text-xs
              hover:bg-blue-50
            "
          >

            {ip}

          </button>

      ))}

    </div>

  </div>

)}

        <textarea
          value={
            form.keterangan
          }
          onChange={(e) =>
            setForm({
              ...form,
              keterangan:
                e.target.value,
            })
          }
          rows={4}
          placeholder="Keterangan"
          className="
            mt-4
            w-full
            rounded-xl
            border
            p-3
          "
        />

        <div
          className="
            mt-6
            flex
            justify-end
            gap-3
          "
        >
          <button
            onClick={onClose}
            className="
              rounded-xl
              border
              px-4
              py-2
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="
              rounded-xl
              bg-blue-600
              px-4
              py-2
              text-white
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}