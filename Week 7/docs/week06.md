# Week 6: Error, Loading, Retry, dan Offline

Sumber: `week6.pptx`, Task 1–3 pada slide 9, 10, dan 11.

## Task 1 — Handle API Error

Setiap respons diperiksa melalui `response.ok` dan status HTTP. Status 400 memberi informasi perbaikan input, 401 mengakhiri sesi, 403 menolak akses, 404 menyatakan data tidak ditemukan, dan 5xx memberi pesan gangguan server. JSON yang tidak valid, kegagalan jaringan, request yang dibatalkan, serta timeout dibedakan lewat kode error. Pesan 5xx tidak memakai detail internal server.

Implementasi: [task01-api-error.js](../mobile/src/weeks/week06/task01-api-error.js) dan wrapper Fetch Week 4. `AbortController` menghentikan request setelah 8 detik. Timer serta listener dibersihkan dalam `finally`.

Demo/uji: jalankan `npm test`, yang memeriksa 400/401/403/404/409/429/500/503, format rusak, network error, timeout, dan cancellation. Tampilan UI menerima pesan yang dapat dibaca tanpa crash.

## Task 2 — Loading, Error & Retry

State request dibedakan menjadi `idle`, `loading`, `success`, `empty`, `error`, dan `offline`. Loading menampilkan indikator, error menampilkan pesan serta tombol **Coba lagi**, dan respons kosong menampilkan ajakan membuat catatan pertama. Saat request dimulai atau gagal, data lama dilepas sehingga tidak muncul sebagai hasil terkini. Tombol coba lagi mengirim request GET baru, bukan mengulang simpan transaksi secara otomatis.

Implementasi: [task02-loading-retry.js](../mobile/src/weeks/week06/task02-loading-retry.js), reducer [request-state.js](../mobile/src/weeks/week06/request-state.js), dan `ResourceStatus` Week 4. Urutan request mencegah respons lama menimpa hasil bulan/akun yang lebih baru. Request dibatalkan saat komponen dilepas.

Demo: munculkan error, tekan **Coba lagi** setelah server pulih, dan periksa data tampil kembali. Saat tidak ada transaksi bulan tersebut, aplikasi menunjukkan empty state. Pengiriman transaksi baru memakai `Idempotency-Key` supaya percobaan ulang dari form yang sama setelah respons terputus tidak membuat catatan ganda.

## Task 3 — Handle Offline

NetInfo memantau status koneksi dan memeriksa koneksi sebelum request. Pada web, event `online`/`offline` serta `navigator.onLine` juga diperiksa agar perubahan koneksi browser segera terbaca. Ketika koneksi terputus, aplikasi menghapus tampilan data request dan menampilkan pesan yang menjelaskan langkah berikutnya. Setelah koneksi kembali, halaman dapat memuat ulang dan tombol retry tetap tersedia. Jika perangkat masih terhubung Wi-Fi tetapi server/API tidak terjangkau, Fetch menampilkan pesan gangguan jaringan atau timeout.

Implementasi: [task03-offline.js](../mobile/src/weeks/week06/task03-offline.js), `useRemoteResource`, dan `ResourceStatus`.

Demo di HP: login dan buka data, matikan Wi-Fi **serta** data seluler, periksa pesan koneksi terputus, aktifkan kembali jaringan, lalu coba lagi. Untuk API LAN, Wi-Fi yang tetap tersambung ke laptop masih dapat menjangkau API meskipun akses internet luar mati. Karena itu aplikasi tidak menganggap hasil probe internet eksternal sebagai bukti pasti bahwa API LAN gagal.

## Mengaktifkan skenario demo terkontrol

Pada `server/.env`, ubah `ALLOW_TEST_SCENARIOS=true`, lalu mulai ulang server. Pada `mobile/.env`, isi salah satu nilai berikut, kemudian mulai ulang Metro dengan `npm start -- --clear`.

| `EXPO_PUBLIC_TEST_SCENARIO` | Hasil |
| --- | --- |
| Kosong | Request normal |
| `client-error` | HTTP 400 |
| `forbidden` | HTTP 403 |
| `not-found` | HTTP 404 |
| `server-error` | HTTP 503 |
| `timeout` | Server menunggu 10 detik, klien timeout 8 detik |
| `empty` | Respons transaksi kosong |

Request skenario tetap memerlukan login. Hapus nilai skenario sesudah demo. Server mengabaikan skenario jika mode production atau flag server tidak aktif. Aplikasi tidak menyimpan antrean transaksi offline; data form dipertahankan saat gagal agar pengguna dapat memeriksa lalu mencoba kembali.
