# Week 7: Sensor Perangkat dan Interaksi

Sumber: `week7.pptx`, Task 1–3 pada slide 10, 11, dan 12.

## Task 1 — Connect Money Track to Sensor

Halaman Sensor memakai `Accelerometer` dari `expo-sensors`. Sensor mulai setelah pengguna menekan **Aktifkan sensor**. Aplikasi meminta izin bila platform memerlukannya, memeriksa ketersediaan perangkat, memasang listener, dan membaca X/Y/Z setiap 100 ms. Data development dicetak ke console paling sering sekali per detik dengan label satuan **g**. Gyroscope dibaca sebagai pembanding rotasi jika tersedia; ketidaktersediaannya tidak menggagalkan accelerometer.

Implementasi: [task01-connect-sensor.js](../mobile/src/weeks/week07/task01-connect-sensor.js), serta konfigurasi pesan izin pada [app.json](../mobile/app.json). Listener dihapus melalui `subscription.remove()` saat berhenti, pindah tab, atau aplikasi masuk latar belakang. Pemeriksaan generasi mencegah proses izin yang terlambat memasang listener setelah halaman dilepas.

Demo di HP fisik melalui Expo Go: buka Sensor, aktifkan, izinkan akses jika diminta, lalu miringkan HP. Periksa perubahan X/Y/Z di console dan UI. Jika izin ditolak, tampilkan pesan dan tombol pengaturan; jika sensor tidak tersedia, pengguna tetap dapat membuka form secara manual.

## Task 2 — Display Sensor Data

Nilai mentah Expo accelerometer dinyatakan dalam **g**. Untuk UI, data dikalikan `9.80665` dan diberi label **m/s²**. Dengan demikian pembacaan diam sekitar 1 g akan tampil sebagai besar percepatan sekitar 9,81 m/s², bukan 1 m/s². X/Y/Z disajikan dua desimal, disertai waktu pembacaan dan grafik besar percepatan 24 sampel terakhir. Gyroscope ditampilkan terpisah dalam rad/s.

Implementasi: [task02-sensor-data.jsx](../mobile/src/weeks/week07/task02-sensor-data.jsx) dan fungsi konversi [motion.js](../mobile/src/weeks/week07/motion.js). State awal ditampilkan sebagai tanda menunggu, bukan angka sensor rekaan. Grafik membatasi tinggi visual pada 3 g dan menjelaskan skalanya.

Demo: letakkan HP diam, ubah orientasi, kemudian gerakkan perlahan. Terangkan bahwa nilai diam masih mengandung komponen gravitasi. Aplikasi menampilkan pembacaan sensor nyata; nilai sebenarnya bergantung pada orientasi dan perangkat.

## Task 3 — Sensor Interaction

Pengguna mengaktifkan **Pintasan goyang untuk pengeluaran**. Aplikasi menghitung magnitude `sqrt(x² + y² + z²)` dari data mentah. Jika melebihi **1,8 g** dan jeda **2 detik** terpenuhi, aplikasi memicu `Vibration.vibrate(160)`, menampilkan waktu goyang terdeteksi, serta membuka form pengeluaran. Form tidak tersimpan sebelum pengguna menekan **Simpan catatan**. Selama form terbuka, pemicu berikutnya tidak membuka form tambahan.

Implementasi: [task03-sensor-interaction.js](../mobile/src/weeks/week07/task03-sensor-interaction.js), [motion.js](../mobile/src/weeks/week07/motion.js), dan pengaitan `onQuickExpense` pada [App.jsx](../mobile/App.jsx). Besar percepatan dipakai agar perubahan orientasi statis sekitar 1 g tidak otomatis dianggap goyang.

Demo di HP: aktifkan sensor dan pintasan, goyangkan sekali, amati getaran/status/form, batalkan form, lalu ulangi sesudah dua detik. Hentikan sensor dan periksa tidak ada aksi baru. Gunakan gerakan wajar sambil memegang HP dengan aman.

Uji otomatis memeriksa konversi satuan, threshold, nilai invalid, dan cooldown. Pengujian sensor native, izin, dan getaran fisik belum dijalankan di lingkungan ini; [checklist pengujian](PENGUJIAN.md) menandainya sebagai pemeriksaan manual sebelum presentasi.
