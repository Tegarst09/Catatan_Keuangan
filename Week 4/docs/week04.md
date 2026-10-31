# Week 4: Model Data dan REST API

Sumber: `week4 (2).pptx`, Task 1–3 pada slide 9, 10, dan 11.

## Task 1 — Model the Money Track Data

Resource utama adalah transaksi, pengguna, dan anggaran bulanan. Nominal disimpan sebagai **integer rupiah**, sehingga Rp25.000 disimpan sebagai `25000`. Jenis transaksi menentukan apakah nominal menambah atau mengurangi ringkasan. Tanggal transaksi adalah tanggal kalender `YYYY-MM-DD`, sedangkan anggaran memakai bulan `YYYY-MM`.

Implementasi: [task01-data-model.js](../mobile/src/weeks/week04/task01-data-model.js).

| Field DTO transaksi | Tipe | Field UI | Arti |
| --- | --- | --- | --- |
| `id` | string UUID | `id` | Identitas transaksi |
| `title` | string | `title` | Catatan 2–80 karakter |
| `type` | `income`/`expense` | `type` | Pemasukan atau pengeluaran |
| `amount_rupiah` | integer positif | `amount` | Nominal rupiah |
| `category` | string enum | `category` | Kategori sesuai jenis transaksi |
| `transaction_date` | string tanggal | `date` | Tanggal transaksi |
| `created_at`, `updated_at` | string ISO | Tidak dipakai | Metadata server |

Contoh respons:

```json
{
  "data": [{
    "id": "71c030e7-7bed-42e2-a408-a8628c98cd38",
    "title": "Makan siang di kantin",
    "type": "expense",
    "amount_rupiah": 25000,
    "category": "Makan",
    "transaction_date": "2026-10-27"
  }]
}
```

`transactionFromDTO` memilih field yang dibutuhkan UI dan memeriksa format respons. `transactionToDTO` memetakan data form kembali ke bentuk API. `summarize` menghitung pemasukan, pengeluaran, selisih bulan ini, anggaran tersisa, persentase penggunaan, dan pengeluaran per kategori.

Pengguna publik memuat `id`, `name`, dan `email`; hash password tidak disertakan. DTO anggaran memuat `month` dan `amount_rupiah`. Kepemilikan pengguna disimpan di server, bukan dipercaya dari body request.

## Task 2 — Connect Money Track to REST API

Aplikasi mengirim HTTP request memakai Fetch, memeriksa `response.ok`, melakukan parsing JSON, lalu mengubah DTO menjadi model aplikasi. Base URL diambil dari konfigurasi. Backend lokal disertakan sehingga tidak bergantung pada API contoh yang mungkin tidak tersedia. Endpoint Week 4 memakai dataset contoh bersama tanpa bearer. Login lokal dari Week 3 tetap menjadi alur masuk UI. Gunakan transaksi fiktif.

Implementasi: [task02-rest-api.js](../mobile/src/weeks/week04/task02-rest-api.js), [app.mjs](../server/src/app.mjs), dan [store.mjs](../server/src/store.mjs). Rincian method/request/response: [API.md](API.md).

Demo: jalankan backend, cek `/api/health`, daftar akun, lalu buat transaksi. Tunjukkan request `GET /api/transactions?month=YYYY-MM` dan response JSON di network inspector tanpa menyalin token ke laporan publik.

## Task 3 — Display API Data

`useMoneyData` mengambil transaksi serta anggaran untuk bulan yang dipilih. Respons transaksi di-mapping melalui `transactionFromDTO`, disimpan di state, lalu diberikan ke `HomeScreen` dan `TransactionList`. Komponen UI yang telah dibuat di Week 2 tetap dipakai. Sesudah tambah/edit/hapus, data diminta ulang dari API agar ringkasan mengikuti hasil server. Pemilihan bulan mengubah query API, bukan sekadar mengganti judul layar.

Implementasi: [task03-api-data.jsx](../mobile/src/weeks/week04/task03-api-data.jsx), `LiveMoney` pada [App.jsx](../mobile/App.jsx), serta form di `mobile/src/components`.

Demo: tambah pemasukan Rp2.000.000 dan pengeluaran Rp25.000 pada bulan yang sama. Ringkasan menampilkan selisih Rp1.975.000. Edit atau hapus pengeluaran dan pastikan nilai ikut berubah. Pilih bulan lain untuk melihat data terpisah. Mode contoh tetap memakai data fiktif yang diberi label jelas; setelah login data berasal dari backend.
