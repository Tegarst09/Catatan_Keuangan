# Kontrak REST API

Base URL latihan: `http://localhost:3001/api`. Pada HP gunakan IP LAN laptop. Endpoint publik hanya health, register, dan login. Endpoint lainnya memerlukan `Authorization: Bearer <access_token>` dan mengembalikan JSON dengan `Cache-Control: no-store`.

## Endpoint

| Method | Path | Autentikasi | Kegunaan |
| --- | --- | --- | --- |
| GET | `/health` | Tidak | Memeriksa server hidup |
| POST | `/auth/register` | Tidak | Membuat akun dan sesi |
| POST | `/auth/login` | Tidak | Login dan memperoleh JWT |
| GET | `/auth/me` | Ya | Verifikasi sesi dan pengguna |
| POST | `/auth/logout` | Ya | Mencabut sesi JWT saat ini |
| GET | `/transactions?month=YYYY-MM` | Ya | Daftar transaksi milik pengguna pada bulan itu |
| POST | `/transactions` | Ya | Membuat transaksi |
| PATCH | `/transactions/:id` | Ya | Mengubah transaksi milik pengguna |
| DELETE | `/transactions/:id` | Ya | Menghapus transaksi milik pengguna |
| GET | `/budget?month=YYYY-MM` | Ya | Anggaran bulan itu, default 0 |
| PUT | `/budget` | Ya | Mengatur/mengganti anggaran bulan itu |

## Autentikasi

Body register:

```json
{ "name": "Mahasiswa", "email": "nama@example.test", "password": "PasswordLatihan123!" }
```

Login menggunakan `email` dan `password`. Contoh respons register (201) atau login (200):

```json
{
  "access_token": "JWT_YANG_DITERBITKAN_SERVER",
  "token_type": "Bearer",
  "expires_at": "2026-10-27T12:30:00.000Z",
  "user": { "id": "uuid", "name": "Mahasiswa", "email": "nama@example.test" }
}
```

Nama/email dinormalisasi seperlunya. Password tidak dipangkas dan harus 8–128 karakter. Rate limit autentikasi adalah 15 percobaan per alamat koneksi per menit. JWT memakai HS256, issuer `money-track-api`, audience `money-track-mobile`, dan `jti` sesi. Nilai kedaluwarsa default 1800 detik. Logout hanya mencabut sesi yang digunakan pada request itu; sesi perangkat lain tetap berjalan.

`GET /auth/me` mengembalikan `user` dan `expires_at`. Logout mengembalikan `{ "ok": true }`. Respons gagal memakai `{ "message": "..." }` tanpa hash, token, maupun stack trace.

## Transaksi

Body POST/PATCH:

```json
{
  "title": "Makan siang",
  "type": "expense",
  "amount_rupiah": 25000,
  "category": "Makan",
  "transaction_date": "2026-10-27"
}
```

`PATCH` pada praktikum ini menerima seluruh field transaksi yang dapat diedit. POST/PATCH mengembalikan `{ "data": { ...transaksi } }`, sementara GET mengembalikan `{ "data": [...] }`. Nilai rupiah harus integer 1–1.000.000.000. Tanggal harus valid antara tahun 2000 dan 2100. Body `user_id` tidak dipakai; pemilik selalu diambil dari token.

Kategori pengeluaran: Makan, Transportasi, Kuliah, Kos, Hiburan, Lainnya. Kategori pemasukan: Uang saku, Beasiswa, Kerja sampingan, Lainnya.

Form POST mengirim header `Idempotency-Key` yang tetap untuk satu form. Server mengembalikan transaksi yang sama jika permintaan dengan kunci dan data yang sama diulang, serta menolak konflik data dengan 409. Ini membantu mencegah catatan ganda jika respons pertama terputus. Kunci hanya berlaku untuk pengguna yang sama dan tidak dikirim sebagai field publik transaksi.

## Anggaran

Body PUT:

```json
{ "month": "2026-10", "amount_rupiah": 1500000 }
```

GET/PUT mengembalikan objek yang sama. Anggaran harus integer 0–1.000.000.000. Angka 0 berarti tanpa batas anggaran. Anggaran dan transaksi masing-masing dibatasi menurut pengguna dan bulan.

## Status dan konfigurasi

| Status | Contoh |
| --- | --- |
| 200/201 | Berhasil |
| 400 | Input/bulan/tanggal tidak valid |
| 401 | Token/credential tidak valid atau sesi dicabut |
| 403 | Origin tidak diizinkan, atau skenario latihan forbidden |
| 404 | Endpoint/transaksi tidak ditemukan pada akun pengguna |
| 409 | Email telah terdaftar, atau konflik kunci permintaan |
| 413 | Body melebihi 16 KB |
| 429 | Terlalu banyak percobaan autentikasi |
| 500/503 | Gangguan internal/skenario server error |

Variabel server dijelaskan pada `server/.env.example`. CORS diizinkan untuk origin web yang terdaftar dalam `CORS_ORIGINS`, dipisah koma. Aplikasi native tidak menggunakan pemeriksaan origin browser. Jika membuka pratinjau melalui port lain, tambahkan origin yang tepat ke konfigurasi dan mulai ulang server.

Skenario jaringan khusus development dijelaskan di [Week 6](week06.md). Untuk deployment publik, gunakan HTTPS melalui penyedia hosting/reverse proxy, secret yang dikelola sebagai environment variable, dan database yang sesuai. Proyek ini tidak membuat deployment atau repository GitHub secara otomatis.
