# Week 2: UI Money Track

Sumber: `week2.pptx`, Task 1–3 pada slide 4, 5, dan 6.

## Task 1 — Build the Mobile UI

Money Track ditujukan untuk mahasiswa yang sulit mengetahui penggunaan uang sakunya. Halaman utama menampilkan header merek, judul, sisa uang bulan yang dipilih, pemasukan, pengeluaran, tombol tambah catatan, anggaran, distribusi kategori, dan transaksi terbaru. Komponen `View`, `Text`, `Image`, `Pressable`, dan `StyleSheet` membentuk hierarki informasi tersebut melalui Flexbox. Logo dompet adalah aset lokal sehingga tampil tanpa internet.

Implementasi: [task01-home.jsx](../mobile/src/weeks/week02/task01-home.jsx), [App.jsx](../mobile/App.jsx), dan [demo.js](../mobile/src/demo.js). Data statis dipakai hanya melalui tombol **Lihat contoh tampilan**. Sesudah login, komponen halaman utama yang sama menerima data dinamis dari API.

Demo: buka aplikasi, pilih contoh tampilan, lalu tunjukkan enam unsur minimum: header, judul, informasi utama, visual, tombol, dan bagian konten. Pindah ke tab Transaksi, Anggaran, Sensor, serta Akun.

## Task 2 — Make the UI Responsive

`useWindowDimensions` membaca ukuran dan orientasi perangkat. Layout memakai lebar relatif, `flexWrap`, `flexShrink`, area yang dapat digulir, serta batas lebar konten 1040 px. Kartu ringkasan berubah dari susunan vertikal menjadi dua kolom saat lebar minimal 768 px. Padding menyesuaikan ukuran layar. Konten tidak memakai tinggi tetap sehingga teks dapat membesar mengikuti pengaturan perangkat.

Implementasi: [task02-responsive.js](../mobile/src/weeks/week02/task02-responsive.js), pemakaiannya pada halaman utama, autentikasi, dan App. Ukuran logo dan ikon dibuat tetap sebagai elemen visual; ukuran keseluruhan halaman mengikuti ruang layar.

Demo: periksa layar kecil 320×640, ponsel 390×844, landscape 844×390, dan tablet 1024×768. Pastikan tidak ada scroll horizontal, tombol tetap dapat dijangkau, serta halaman/form tetap dapat digulir. Validasi font besar di HP merupakan langkah manual terpisah.

## Task 3 — Inclusive Design & Accessibility

Tombol memiliki `accessibilityRole`, label tindakan, state disabled/busy, dan hint bila diperlukan. Label form tersedia sebagai teks dan `accessibilityLabel`. Tab menunjukkan pilihan aktif melalui warna serta state selected. Nominal positif/negatif dilengkapi kata **Pemasukan/Pengeluaran**, sehingga informasi tidak hanya bergantung pada warna. Judul memiliki role header, pesan memakai live region, dan tombol memiliki tinggi minimum 48 px.

Implementasi: [task03-accessibility.jsx](../mobile/src/weeks/week02/task03-accessibility.jsx), termasuk komponen `Button`, `Field`, `Chip`, `Heading`, dan `Notice` yang dipakai kembali sepanjang proyek. Warna teks utama `#172d2b` dan teks sekunder `#52635d` digunakan di permukaan terang.

Demo/manual: aktifkan TalkBack atau VoiceOver, telusuri urutan tab dan form, periksa nama tindakan edit/hapus yang menyebut judul transaksi, lalu besarkan font sistem. Pembaca layar dan font besar pada perangkat fisik belum dapat disertifikasi melalui tes browser saja.
