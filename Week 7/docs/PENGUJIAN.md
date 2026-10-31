# Pengujian Week 7

| Pemeriksaan | Hasil |
| --- | --- |
| Sintaks JavaScript/JSX | 37 file lolos |
| Unit/integration test | 24 tes lolos, 0 gagal |
| Antarmuka browser | 25 pemeriksaan lolos, 0 error halaman |
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
- Data API kosong ditampilkan
- Pemasukan tersimpan melalui API
- Ringkasan sesuai data API
- Anggaran tersimpan
- Edit transaksi bekerja
- Hapus transaksi bekerja
- API terlindungi menolak request tanpa token
- Bearer dipasang pada request
- Server error tampil
- Retry berhasil
- Offline state tampil
- Data kembali setelah koneksi pulih
- Halaman sensor dan pintasan tampil
- Logout mengembalikan halaman login
- Logout mencabut token lama di server
- Password salah ditolak
- Login ulang dengan credential benar

Jalankan ulang pemeriksaan source/API dengan `npm run check` dan `npm test`.

## Checklist HP sebelum presentasi

- [ ] Jalankan versi ini melalui Expo Go di perangkat presentasi.
- [ ] Periksa SecureStore setelah tutup/buka aplikasi dan setelah logout.
- [ ] Putar portrait/landscape, perbesar font sistem, gunakan TalkBack/VoiceOver.
- [ ] Periksa koneksi HP ke alamat IP laptop sesuai konfigurasi.
- [ ] Matikan Wi-Fi serta data seluler, lalu pulihkan jaringan dan coba lagi.
- [ ] Berikan/tolak izin sensor, periksa X/Y/Z nyata, lalu coba getaran dan pintasan goyang.

Checklist fisik tersebut belum dijalankan di lingkungan penyiapan. Bundling memeriksa pemaketan kode; pengujian browser memeriksa alur serta respons layar. Perilaku OS, SecureStore native, pembaca layar, dan sensor/getaran perlu dikonfirmasi pada HP.
