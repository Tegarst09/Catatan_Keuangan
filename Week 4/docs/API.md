# REST API Week 4

Base URL latihan: `http://localhost:3001/api`. Dataset contoh dipakai bersama tanpa bearer. Login perangkat adalah alur UI Week 3. Gunakan transaksi fiktif.

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET | `/health` | Pemeriksaan server |
| GET | `/transactions?month=YYYY-MM` | Daftar contoh transaksi |
| POST | `/transactions` | Membuat contoh transaksi |
| PATCH | `/transactions/:id` | Mengubah contoh transaksi |
| DELETE | `/transactions/:id` | Menghapus contoh transaksi |
| GET | `/budget?month=YYYY-MM` | Anggaran bulan tersebut |
| PUT | `/budget` | Menyimpan anggaran contoh |

Body transaksi: `title`, `type` (`income`/`expense`), `amount_rupiah` (integer positif), `category`, `transaction_date` (`YYYY-MM-DD`). Respons daftar `{ "data": [...] }`; respons satu transaksi `{ "data": { ... } }`. Body anggaran: `month` dan `amount_rupiah`. Server memvalidasi tanggal, nominal, serta bulan. Data server diabaikan Git.

Mobile memetakan DTO ke `id`, `title`, `type`, `amount`, `category`, dan `date`, lalu menampilkan data melalui UI yang telah dibuat.
