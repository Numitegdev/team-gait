interface Props {

  title?: string;

  description?: string;

}

export function EmptyActivity({

  title = "Belum ada aktivitas hari ini",

  description = "Aktivitas dari Driver, Checklist, dan Security akan muncul otomatis setelah pekerjaan selesai.",

}: Props) {

  return (

    <div className="rounded-2xl border border-dashed bg-white p-10 text-center">

      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">

        📭

      </div>

      <h2 className="text-lg font-semibold text-gray-800">

        {title}

      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">

        {description}

      </p>

    </div>

  );

}