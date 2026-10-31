# Money Track — Week 3

Versi **Week 3: Autentikasi dan penyimpanan aman**, mengerjakan Task 1–3 minggu tersebut. Paket lengkap menyertakan fitur sebelumnya yang diperlukan dan dapat dipasang sendiri.

## Pembagian dua anggota

| Anggota | Bagian Week 3 | File utama |
| --- | --- | --- |
| Anggota 1 | Task 1: Register/login | `mobile/src/weeks/week03/task01-auth-flow.jsx` |
| Anggota 2 | Task 2: SecureStore. Task 3: Validasi dan uji keamanan | `mobile/src/weeks/week03/task02-secure-storage.js`, `task03-security-validation.js` |

File pendukung ikut dibagi. Lihat [PEMBAGIAN.md](docs/PEMBAGIAN.md) serta `docs/FILE_ANGGOTA_1.txt` dan `docs/FILE_ANGGOTA_2.txt`. Isi nama/NIM sebelum dikumpulkan.

## Menggabungkan paket

Ekstrak `MoneyTrack_Week3_Anggota_1.zip` dan `MoneyTrack_Week3_Anggota_2.zip` ke folder induk yang sama. Hasilnya menjadi satu folder `money-track-week-03`. Paket anggota saling melengkapi. Pilih `MoneyTrack_Week3_Lengkap.zip` untuk langsung memakai hasil gabungan. Setiap source file hanya masuk satu bagian anggota.

## Menjalankan

Gunakan Node.js 24, npm, dan Expo Go yang mendukung SDK 58. Dari folder `money-track-week-03`:

```bash
npm ci
npm start
```

Pindai QR menggunakan Expo Go. Untuk browser gunakan `npm run web`. Buat akun melalui Daftar. Akun/sesi native tersimpan di SecureStore; akun/sesi web berada dalam memori sampai refresh. Data transaksi Week 3 adalah contoh dalam state sementara.

Setiap minggu memakai konfigurasi serta data latihan sendiri. Daftar akun pada versi yang sedang dipakai.

## Penjelasan tugas

| Minggu | Materi pada versi ini |
| --- | --- |
| Week 2 | [UI responsif dan aksesibilitas](docs/week02.md) |
| Week 3 | [Autentikasi dan penyimpanan aman](docs/week03.md) |

Fokus paket: [Task 1–3 Week 3](docs/week03.md). [DEMO.md](docs/DEMO.md) memuat urutan presentasi; [PENGUJIAN.md](docs/PENGUJIAN.md) memuat hasil pemeriksaan dan checklist HP.

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
git commit -m "Complete Money Track week 3 tasks 1-3"
git branch -M main
git remote add origin https://github.com/USERNAME/money-track-week-03.git
git push -u origin main
```

Masing-masing anggota meninjau dan commit bagiannya memakai identitas Git sendiri. Dependensi, konfigurasi lokal, data server, serta hasil bundling diabaikan Git. Source, aset, tes, dokumen, lockfile, dan contoh konfigurasi ikut dipush. Proyek belum dipush ke akun mana pun.
