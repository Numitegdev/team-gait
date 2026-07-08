import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all dark:bg-slate-900 sm:p-10 border border-slate-100 dark:border-slate-800">
        
        {/* Icon Peringatan dengan Efek Animasi Pulse */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 animate-pulse dark:bg-red-950/50 dark:text-red-400">
          <svg
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="360"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Teks Konten yang Responsif */}
        <div className="mt-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Akses Ditolak
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan periksa kembali akun Anda atau hubungi admin.
          </p>
        </div>

        {/* Group Tombol Aksi yang Responsif */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {/* <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Kembali ke Beranda
          </Link> */}
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-white border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Login Akun 
          </Link>
        </div>
        
      </div>
    </div>
  );
}