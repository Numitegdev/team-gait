interface Props {

  vehicle: any;

  onEdit?: (
    vehicle: any
  ) => void;

  onDelete?: (
    id: number
  ) => void;

   onDetail: (
    vehicle: any
  ) => void;


}

export function VehicleCard({

  vehicle,

  onEdit,

  onDelete,

  onDetail,

}: Props) {

  return (

    <div
      className="
        rounded-xl
        border
        bg-white
        p-4
        shadow-sm
        justify-between
      "
    >
         <div
            className="
                mt-4
                flex
                gap-2
            "
            >

            <button

                onClick={() =>
                onEdit?.(
                    vehicle
                )
                }

                className="
                rounded-lg
                border
                px-3
                py-1
                "
            >

                Edit

            </button>

            <button

                onClick={() =>
                onDelete?.(
                    vehicle.id
                )
                }

                className="
                rounded-lg
                bg-red-600
                px-3
                py-1
                text-white
                "
            >

                Delete

            </button>
</div>

    {vehicle.foto_url ? (

        <img

            src={
            vehicle.foto_url
            }

            alt={
            vehicle.nama_kendaraan
            }

            className="
            aspect-video
            w-full
            rounded-lg
            object-cover
            "

        />

        ) : (

        <div
            className="
            aspect-video
            rounded-lg
            bg-slate-100
            "
        />

        )}

      <div className="mt-3">

        <div
          className="
            font-semibold
          "
        >
          {vehicle.plat_nomor}
        </div>

        <div
          className="
            text-sm
            text-slate-500
          "
        >
          {vehicle.nama_kendaraan}
        </div>

      </div>
           <div>
            <button

            onClick={() =>
                onDetail(
                vehicle
                )
            }

            className="
                mt-3
                w-full
                rounded-lg
                border
                px-3
                py-2
            "
            >

            Detail

            </button>

            </div>
    </div>

  );

}