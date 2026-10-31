# Money Track — Week 4

Versi **Week 4: Model data dan REST API**, mengerjakan Task 1–3 minggu tersebut. Paket lengkap menyertakan fitur sebelumnya yang diperlukan dan dapat dipasang sendiri.

## Pembagian dua anggota

| Anggota | Bagian Week 4 | File utama |
| --- | --- | --- |
| Anggota 1 | Task 1: Model data/DTO | `mobile/src/weeks/week04/task01-data-model.js` |
| Anggota 2 | Task 2: Koneksi REST API. Task 3: Data API di UI | `mobile/src/weeks/week04/task02-rest-api.js`, `task03-api-data.jsx` |

File pendukung ikut dibagi. Lihat [PEMBAGIAN.md](docs/PEMBAGIAN.md) serta `docs/FILE_ANGGOTA_1.txt` dan `docs/FILE_ANGGOTA_2.txt`. Isi nama/NIM sebelum dikumpulkan.

## Menggabungkan paket

Ekstrak `MoneyTrack_Week4_Anggota_1.zip` dan `MoneyTrack_Week4_Anggota_2.zip` ke folder induk yang sama. Hasilnya menjadi satu folder `money-track-week-04`. Paket anggota saling melengkapi. Pilih `MoneyTrack_Week4_Lengkap.zip` untuk langsung memakai hasil gabungan. Setiap source file hanya masuk satu bagian anggota.

## Menjalankan

Gunakan Node.js 24, npm, dan Expo Go yang mendukung SDK 58. Dari folder `money-track-week-04`:

```bash
npm ci
npm run setup
```

Untuk HP fisik, edit `mobile/.env` menjadi `EXPO_PUBLIC_API_URL=http://IP_LAN_LAPTOP:3001/api`. Pakai IP laptop yang tersambung Wi-Fi yang sama dengan HP. `EXPO_PUBLIC_ALLOW_INSECURE_LAN=true` hanya dipakai saat development. Browser laptop memakai `http://localhost:3001/api`; Android Emulator memakai `http://10.0.2.2:3001/api`.

Jalankan dua terminal dari folder proyek:

```bash
# Terminal 1
npm run server
```

```bash
# Terminal 2
npm start
```

Pindai QR di Expo Go. Pratinjau browser: `npm run web`. Setelah mengubah konfigurasi mobile, mulai ulang dengan `npm start -- --clear`. Jalankan satu versi minggu pada satu waktu jika memakai port default. Pemeriksaan backend: `/api/health`.

Login pada Week 4 memakai akun lokal perangkat. API Week 4 menyediakan dataset latihan bersama tanpa bearer. Semua akun tahap ini melihat contoh data yang sama, jadi gunakan transaksi fiktif. Pada web, akun lokal dibuat ulang setelah refresh.

Setiap minggu memakai konfigurasi serta data latihan sendiri. Daftar akun pada versi yang sedang dipakai.

## Penjelasan tugas

| Minggu | Materi pada versi ini |
| --- | --- |
| Week 2 | [UI responsif dan aksesibilitas](docs/week02.md) |
| Week 3 | [Autentikasi dan penyimpanan aman](docs/week03.md) |
| Week 4 | [Model data dan REST API](docs/week04.md) |

Fokus paket: [Task 1–3 Week 4](docs/week04.md). [DEMO.md](docs/DEMO.md) memuat urutan presentasi; [PENGUJIAN.md](docs/PENGUJIAN.md) memuat hasil pemeriksaan dan checklist HP.

```bash
npm run check
npm test
npm run export:web
```

Pada versi yang memakai backend, hasil ekspor web produksi memerlukan URL API HTTPS. Latihan LAN memakai mode development melalui `npm start` atau `npm run web`.

## GitHub

Buat repository kosong. Ganti URL contoh dengan repository milikmu, lalu jalankan dari folder proyek lengkap:

```bash
git init
git add .
git commit -m "Complete Money Track week 4 tasks 1-3"
git branch -M main
git remote add origin https://github.com/USERNAME/money-track-week-04.git
git push -u origin main
```

Masing-masing anggota meninjau dan commit bagiannya memakai identitas Git sendiri. Dependensi, konfigurasi lokal, data server, serta hasil bundling diabaikan Git. Source, aset, tes, dokumen, lockfile, dan contoh konfigurasi ikut dipush. Proyek belum dipush ke akun mana pun.
