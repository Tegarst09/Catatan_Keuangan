# Week 3: Autentikasi dan Penyimpanan Aman

Sumber: `week3(1).pptx`, Task 1–3 pada slide 6, 9, dan 12.

## Task 1 — Build the Authentication Flow

Halaman Daftar meminta nama, email, password, dan konfirmasi. Halaman Masuk meminta email serta password. Input kosong, format email salah, password di luar 8–128 karakter, dan konfirmasi berbeda menghasilkan pesan validasi. Password disembunyikan secara default. Credential yang sesuai membuka beranda; logout mengembalikan halaman login.

Implementasi: [task01-auth-flow.jsx](../mobile/src/weeks/week03/task01-auth-flow.jsx), [local-session.jsx](../mobile/src/weeks/week03/local-session.jsx), dan [local-auth.js](../mobile/src/weeks/week03/local-auth.js). Anggota 1 memegang Task 1. Akun pada tahap ini diverifikasi di perangkat. Week 3 menampilkan data keuangan contoh dalam state sementara.

## Task 2 — Secure the Local Data

Android/iOS menyimpan akun dan sesi melalui Expo SecureStore. Password diolah dengan PBKDF2-HMAC-SHA256, salt acak 16 byte, 600.000 iterasi, dan keluaran 32 byte. Catatan akun berisi identitas, hash, salt, dan jumlah iterasi; password asli tidak disimpan. Sesi lokal memakai token dari 32 byte acak dan masa berlaku 30 menit. Profil publik pada state tidak membawa hash atau salt.

Implementasi: [task02-secure-storage.js](../mobile/src/weeks/week03/task02-secure-storage.js) dan `local-auth.js`. Pada web, akun serta sesi hanya berada dalam memori tab. Refresh halaman menghapus keduanya. Pada HP, token dibaca kembali saat membuka aplikasi dan dihapus saat logout atau kedaluwarsa; catatan akun tetap tersedia untuk login berikutnya. Anggota 2 memegang Task 2.

Demo native: daftar akun melalui Expo Go, tutup/buka aplikasi, periksa pemulihan sesi, logout, kemudian buka lagi. Akun web perlu dibuat kembali setelah refresh. Akun lokal ini merupakan latihan autentikasi perangkat; akun server menjadi tahap Week 5.

## Task 3 — Validate the Security

Validasi dipakai form dan driver akun. Tes otomatis memeriksa register, login benar/salah, input kosong, email ganda, pembacaan ulang sesi, logout, expiry, sesi rusak, salt berbeda antar akun, serta tidak tersimpannya password asli. Hasil PBKDF2 pada 600.000 iterasi dibandingkan dengan implementasi Node.js.

Kode: [task03-security-validation.js](../mobile/src/weeks/week03/task03-security-validation.js). Tes: [local-auth.test.mjs](../tests/local-auth.test.mjs). Jalankan `npm test`. Anggota 2 memegang Task 3.

| Skenario | Hasil |
| --- | --- |
| Credential benar | Beranda terbuka |
| Credential salah/kosong | Pesan penolakan/validasi |
| Email ganda | Pendaftaran ditolak |
| Sesi kedaluwarsa/rusak | Sesi dibersihkan |
| Logout | Token dihapus dan layar login tampil |
| Data sensitif | Akun/hash/salt/sesi melalui SecureStore native |

Pemeriksaan SecureStore native, pembaca layar, dan font besar dilakukan pada HP. Referensi: [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/), [Expo Crypto](https://docs.expo.dev/versions/latest/sdk/crypto/), [noble-hashes](https://github.com/paulmillr/noble-hashes).
