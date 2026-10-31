# Pengujian Week 3

| Pemeriksaan | Hasil |
| --- | --- |
| Sintaks JavaScript/JSX | 16 file lolos |
| Unit/integration test | 5 tes lolos, 0 gagal |
| Antarmuka browser | 12 pemeriksaan lolos, 0 error halaman |
| Bundel Android, iOS, web | Berhasil dibuat melalui Expo |
| React Native | 0.88.1, sesuai paket Expo SDK 58 yang dipakai |
| Pembagian | Task 1 Anggota 1, Task 2–3 Anggota 2 |
| Integritas sumber | Gabungan dua bagian identik dengan paket lengkap |

Uji browser yang berhasil:

- Halaman login tampil
- Form kosong ditolak
- Mode contoh dapat dibuka
- Responsif 320x640
- Responsif 390x844
- Responsif 844x390
- Responsif 1024x768
- Register membuka beranda
- UI contoh berfungsi setelah login
- Logout mengembalikan halaman login
- Password salah ditolak
- Login ulang dengan credential benar

Jalankan ulang pemeriksaan source/API dengan `npm run check` dan `npm test`.

## Checklist HP sebelum presentasi

- [ ] Jalankan versi ini melalui Expo Go di perangkat presentasi.
- [ ] Periksa SecureStore setelah tutup/buka aplikasi dan setelah logout.
- [ ] Putar portrait/landscape, perbesar font sistem, gunakan TalkBack/VoiceOver.

Checklist fisik tersebut belum dijalankan di lingkungan penyiapan. Bundling memeriksa pemaketan kode; pengujian browser memeriksa alur serta respons layar. Perilaku OS, SecureStore native, pembaca layar, dan sensor/getaran perlu dikonfirmasi pada HP.
