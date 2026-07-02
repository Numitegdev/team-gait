# Team-Gait PC Scanner Tool (v1.0.0)


Aplikasi scanner berbasis PowerShell untuk melakukan audit hardware, sistem operasi, jaringan, serta verifikasi software add-on yang terinstall pada 
lingkungan kerja **ASW Group**. Script ini dirancang agar sinkron dengan kebutuhan pengecekan spesifikasi PC, scoring kelayakan system, 
dan inventarisasi aset IT kantor.

---

## 🛠️ Fitur Utama (Features)

* **Audit Hardware Lengkap:** Mengambil informasi CPU, Motherboard (Model & SN), BIOS, serta GPU (VRAM, Resolusi, Driver).
* **Analisis RAM Detil:** Menghitung total kapasitas (GB) dan memetakan tipe modul (DDR/DDR2/DDR3/DDR4/DDR5) per slot beserta kecepatannya.
* **Manajemen Penyimpanan (Storage):** Membaca fisik disk (SSD/HDD) sekaligus sisa kapasitas (Free Space) pada partisi/volume aktif.
* **Informasi Jaringan:** Mengidentifikasi IP Address IPv4, Gateway, DNS Server, dan MAC Address untuk keperluan manajemen aset IP.
* **Verifikasi Software Kantor & Add-on:** Secara otomatis memeriksa status instalasi dan versi aplikasi krusial:
    * Accurate
    * AnyDesk
    * UltraViewer
    * SQL Server 
    * Otomax Server (otw)
* **Output JSON Terstruktur:** Seluruh data digabungkan ke dalam file format `.json` dengan kedalaman object hingga 10 level (`-Depth 10`).

---

@saw_ind ASW GROUP