# Week 3: Autentikasi dan Penyimpanan Aman

Sumber: `week3(1).pptx`, Task 1–3 pada slide 6, 9, dan 12.

## Task 1 — Build the Authentication Flow

Alur aplikasi adalah **Daftar → sesi terautentikasi → beranda** atau **Masuk → validasi credential → beranda**. Pendaftaran meminta nama, email, password, dan konfirmasi. Login meminta email serta password. Input kosong, format email keliru, password di luar 8–128 karakter, dan konfirmasi yang berbeda ditolak sebelum request. Password disembunyikan secara default; pengguna dapat memilih menampilkannya. Credential salah dari server menghasilkan feedback tanpa membuka data akun.

Implementasi: [task01-auth-flow.jsx](../mobile/src/weeks/week03/task01-auth-flow.jsx), [task03-security-validation.js](../mobile/src/weeks/week03/task03-security-validation.js), dan `Gate` pada [App.jsx](../mobile/App.jsx). Versi akhir menggunakan alur API bertoken dari Week 5 sehingga autentikasi seluruh aplikasi konsisten, bukan pemeriksaan password hardcode.

Demo: kirim form kosong, coba email tidak valid, daftar akun baru, keluar, lalu masuk dengan credential akun tersebut. Coba password salah dan tunjukkan bahwa halaman utama tetap terlindungi.

## Task 2 — Secure the Local Data

Data sensitif adalah access token. Token ditulis dan dibaca kembali memakai Expo SecureStore di Android/iOS. Password hanya berada dalam form selama diperlukan, kemudian dibersihkan; password tidak masuk SecureStore, AsyncStorage, maupun log. Data transaksi diambil dari server dan hanya berada dalam state saat dipakai. Pilihan menyembunyikan nominal termasuk preferensi biasa dan disimpan melalui AsyncStorage.

Implementasi: [task02-secure-storage.js](../mobile/src/weeks/week03/task02-secure-storage.js) serta adapter [session-store.js](../mobile/src/weeks/week03/session-store.js). Fungsi `get`, `set`, dan `clear` menyediakan siklus penyimpanan. Pada web, adapter hanya memakai memori karena SecureStore native tidak tersedia. Web tidak mengklaim menyediakan penyimpanan terenkripsi.

Demo di HP: login, tutup dan buka aplikasi, pastikan token yang tersimpan diverifikasi lewat `/auth/me`, lalu logout. Buka kembali aplikasi dan periksa bahwa layar login tampil. Bila server tidak tersedia saat pemulihan, aplikasi meminta koneksi dan pemulihan ulang, bukan membuka data akun tanpa verifikasi.

## Task 3 — Validate the Security

Pengujian menggabungkan validasi input, adapter penyimpanan, dan API nyata. Credential benar memperoleh JWT. Credential salah ditolak, input kosong gagal validasi, dan logout mencabut sesi. Password disimpan sebagai hash scrypt dengan salt acak pada server. Hasil API tidak mengembalikan password/hash, dan transaksi akun lain tidak dapat diedit atau dihapus. Pesan kegagalan server tidak menampilkan stack trace atau token.

Implementasi/uji: [domain.test.mjs](../tests/domain.test.mjs), [api.test.mjs](../server/tests/api.test.mjs), dan [network.test.mjs](../tests/network.test.mjs). Jalankan `npm test`.

| Skenario | Hasil yang harus muncul |
| --- | --- |
| Credential benar | Login berhasil, API terlindungi dapat diakses |
| Credential salah | Ditolak dengan pesan email/password tidak sesuai |
| Input kosong | Pesan validasi, tidak mengirim request login |
| Token diubah/kedaluwarsa | API mengembalikan 401 |
| Logout | Token lokal dihapus, sesi server dicabut bila terhubung |
| Akses data milik akun lain | Tidak mengembalikan atau mengubah data tersebut |
| Baca ulang token di HP | Memerlukan pemeriksaan SecureStore native secara manual |

Uji adapter otomatis membuktikan kontrak set/get/delete. Pemeriksaan enkripsi OS, TalkBack/VoiceOver, dan perilaku SecureStore sesudah membuka ulang aplikasi harus dilakukan pada HP.
