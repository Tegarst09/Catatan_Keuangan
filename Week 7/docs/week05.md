# Week 5: Token Authentication dan Sesi

Sumber: `week5.pptx`, Task 1–3 pada slide 10, 11, dan 12.

## Task 1 — Implement Token Authentication

Login mengirim email/password melalui `POST /auth/login`. Server memvalidasi password terhadap hash scrypt, lalu menerbitkan access token JWT HS256. Respons memuat token, waktu kedaluwarsa, dan pengguna publik. Aplikasi menyimpan token ke SecureStore native sebelum mengubah state menjadi terautentikasi. Pendaftaran juga membentuk sesi setelah akun berhasil dibuat.

Implementasi: [task01-token-auth.js](../mobile/src/weeks/week05/task01-token-auth.js), [auth.mjs](../server/src/auth.mjs), dan endpoint autentikasi pada [app.mjs](../server/src/app.mjs). Secret server dibuat acak oleh `npm run setup`, tidak ditaruh dalam kode aplikasi atau Git.

Demo: login dengan akun terdaftar. Tunjukkan perpindahan dari halaman autentikasi ke beranda. Token tidak ditampilkan pada UI atau console. JWT merupakan token bertanda tangan, bukan wadah terenkripsi; payload hanya berisi identitas/metadata sesi yang dibutuhkan, tanpa password atau data transaksi.

## Task 2 — Attach Token to API Request

Untuk request terlindungi, aplikasi membaca token dari adapter SecureStore lalu menambahkan `Authorization: Bearer <token>`. Server memeriksa algoritma, signature, issuer, audience, expiry, serta keberadaan sesi aktif. Setelah lolos autentikasi, server hanya membaca/mengubah data dengan `user_id` milik pemegang token. Klien tidak dapat memilih pemilik data melalui body.

Implementasi: [task02-authorized-request.js](../mobile/src/weeks/week05/task02-authorized-request.js), fungsi `api` pada provider sesi, serta [api.test.mjs](../server/tests/api.test.mjs).

Demo/uji: request transaksi tanpa token menghasilkan 401, token valid menghasilkan data, token yang diubah atau kedaluwarsa menghasilkan 401, dan akun berbeda tidak melihat transaksi akun pertama. `npm test` memverifikasi skenario ini.

## Task 3 — Protect the Money Track Session

Saat aplikasi dibuka, provider membaca token tersimpan lalu memverifikasinya melalui `/auth/me`. Timer mengikuti expiry yang diberikan server; expiry diperiksa lagi saat aplikasi kembali aktif. Respons 401 mengakhiri sesi dan menghapus token. Logout menghapus token lokal, membersihkan state, dan meminta server mencabut JWT melalui identitas sesi `jti`. Request lama dibatasi berdasarkan generasi sesi agar tidak menghidupkan kembali data sesudah logout atau perpindahan akun.

Implementasi: [task03-session.jsx](../mobile/src/weeks/week05/task03-session.jsx), adapter Week 3, dan pengujian revocation pada API. Komponen data di-unmount saat pengguna keluar, sehingga state catatan akun sebelumnya ikut dibersihkan.

Demo: login, akses Transaksi, logout, kemudian coba token lama melalui pengujian otomatis. Token lama harus ditolak. Pada HP, tutup/buka aplikasi sebelum logout untuk memeriksa pemulihan token. Pada browser token hanya berada di memori sehingga refresh meminta login ulang.

Jika server tidak dapat dihubungi saat logout, aplikasi menjelaskan bahwa sesi lokal sudah diakhiri tetapi pencabutan token server belum berhasil. Batas token default adalah 30 menit dan dapat dikonfigurasi melalui `TOKEN_TTL_SECONDS`. Tidak ada refresh token dalam lingkup tugas ini. Komunikasi publik harus memakai HTTPS; HTTP LAN hanya untuk development yang diaktifkan secara eksplisit.
