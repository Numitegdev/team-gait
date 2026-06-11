import { rooms }
from "@/modules/it/network-tools/ip-management/constants/room-options";

interface Props {

  form: any;

  setForm: any;

}

export function MaintenanceFormCard({

  form,

  setForm,

}: Props) {

  return (

    <div
      className="
        rounded-2xl
        border
        bg-white
        p-6
      "
    >

      <h3
        className="
          mb-4
          text-lg
          font-semibold
        "
      >
        Informasi Maintenance
      </h3>

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
        "
      >

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >
            Tanggal Eksekusi
          </label>

          <input
            type="date"
            value={form.tanggal}
            onChange={(e) =>
              setForm({
                ...form,
                tanggal:
                  e.target.value,
              })
            }
            className="
              w-full
              rounded-xl
              border
              p-3
            "
          />

        </div>

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >
            Kode PC
          </label>

          <input
            value={form.kode_pc}
            onChange={(e) =>
              setForm({
                ...form,
                kode_pc:
                  e.target.value,
              })
            }
            placeholder="PC-HRD-01"
            className="
              w-full
              rounded-xl
              border
              p-3
            "
          />

        </div>

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >
            Ruangan
          </label>

          <select
            value={form.ruangan}
            onChange={(e) =>
              setForm({
                ...form,
                ruangan:
                  e.target.value,
              })
            }
            className="
              w-full
              rounded-xl
              border
              p-3
            "
          >

            <option value="">
              Pilih Ruangan
            </option>

            {rooms.map(
              (room) => (

                <option
                  key={room}
                  value={room}
                >
                  {room}
                </option>

              )
            )}

          </select>

        </div>

        <div>

          <label
            className="
              mb-1
              block
              text-sm
              font-medium
            "
          >
            Teknisi
          </label>

          <input
            value={form.teknisi}
            readOnly
            className="
              w-full
              rounded-xl
              border
              bg-slate-100
              p-3
            "
          />

        </div>

      </div>

      <div className="mt-4">

        <label
          className="
            mb-1
            block
            text-sm
            font-medium
          "
        >
          Keluhan Sebelum Maintenance
        </label>

        <textarea
          rows={4}
          value={form.keluhan}
          onChange={(e) =>
            setForm({
              ...form,
              keluhan:
                e.target.value,
            })
          }
          className="
            w-full
            rounded-xl
            border
            p-3
          "
        />

      </div>

      <div className="mt-4">

        <label
          className="
            mb-1
            block
            text-sm
            font-medium
          "
        >
          Keterangan
        </label>

        <textarea
          rows={4}
          value={form.keterangan}
          onChange={(e) =>
            setForm({
              ...form,
              keterangan:
                e.target.value,
            })
          }
          className="
            w-full
            rounded-xl
            border
            p-3
          "
        />

      </div>

    </div>

  );

}