import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center  bg-gray-50 p-6">
      <div className="text-center max-w-sm w-full">
        {/* Tulisan di bagian atas */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
          Selamat datang di operational umum dan teknis aplikasi
        </h1>
        
        {/* Gambar Portrait (736 x 1028) */}
        <div className="relative w-full aspect-[736/1028] rounded-2xl overflow-hidden shadow-xl border border-gray-100">
          <Image
            src="/a.jpg"
            alt="Dashboard Ilustrasi"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}