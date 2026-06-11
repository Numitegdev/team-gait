"use client";

import { MaintenanceHistory }
from "../types/maintenance-history";

interface Props {

  open: boolean;

  onClose: () => void;

  data:
    MaintenanceHistory
    | null;

}

export function MaintenanceHistoryDetailModal({

  open,

  onClose,

  data,

}: Props) {

  if (!open || !data)
    return null;

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
          rounded-2xl
          bg-white
          p-6
        "
      >

        <h2
          className="
            mb-6
            text-2xl
            font-bold
          "
        >
          Detail Maintenance
        </h2>

        <div
          className="
            grid
            gap-3
            md:grid-cols-2
          "
        >

          <Info
            label="Tanggal"
            value={data.tanggal}
          />

          <Info
            label="Kode PC"
            value={data.kode_pc}
          />

          <Info
            label="Ruangan"
            value={data.ruangan}
          />

          <Info
            label="Teknisi"
            value={data.teknisi}
          />

          <Info
            label="Mouse"
            value={data.keyboard_mouse}
          />

          <Info
            label="RAM"
            value={data.ram}
          />

          <Info
            label="Motherboard"
            value={data.motherboard}
          />

          <Info
            label="Hardisk"
            value={data.hardisk}
          />

          <Info
            label="Power Supply"
            value={data.power_supply}
          />

          <Info
            label="Cleaner"
            value={data.cleaner}
          />

          <Info
            label="Baut"
            value={data.baut}
          />

        </div>

        <div
          className="
            mt-4
          "
        >

          <p
            className="
              font-semibold
            "
          >
            Keluhan
          </p>

          <p>
            {data.keluhan}
          </p>

        </div>

        <div
          className="
            mt-4
          "
        >

          <p
            className="
              font-semibold
            "
          >
            Keterangan
          </p>

          <p>
            {data.keterangan}
          </p>

        </div>

        <div
          className="
            mt-6
            flex
            justify-end
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
            Close
          </button>

        </div>

      </div>

    </div>

  );

}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div
      className="
        rounded-xl
        border
        p-3
      "
    >

      <p
        className="
          text-xs
          text-slate-500
        "
      >
        {label}
      </p>

      <p
        className="
          font-semibold
        "
      >
        {value}
      </p>

    </div>

  );

}