# TQA Nurul Bayan — hasil pemisahan file

## Struktur
- `index.html`: struktur halaman dan referensi aset.
- `assets/css/main.css`: style utama.
- `assets/css/theme.css`: variabel dan style tema gelap.
- `assets/css/responsive.css`: aturan responsif.
- `assets/js/`: JavaScript dipisah berdasarkan bagian/fungsi yang sudah ada di file asal.
- `assets/img/`: tempat aset gambar tambahan; logo saat ini masih dibuat dari SVG di JavaScript.

## Catatan
- File JavaScript dimuat sebagai script klasik dalam urutan bernomor agar fungsi dan variabel global lama tetap kompatibel.
- Library Chart.js dan jsPDF tetap memakai CDN seperti file asal.
- Sebelum dipakai di hosting, buka `index.html` lewat server lokal/hosting (bukan mengubah urutan script) dan uji semua fitur.
- Data aplikasi lama tersimpan di `localStorage` browser masing-masing. Unduh backup JSON dari aplikasi asal sebelum mengganti file atau browser.


## Database Al-Qur’an & autofill
- Database lokal berisi 114 surah, jumlah ayat, dan juz yang beririsan dengan rentang pembagian juz standar (`assets/js/04a-quran.js`).
- Form Setoran memakai dropdown surah dan juz; memilih juz memfilter surah, memilih surah menampilkan jumlah ayat dan mengisi juz pertama yang sesuai bila perlu.
- Data setoran tetap menyimpan nama surah agar riwayat dan laporan yang sudah ada tetap terbaca.
- Data disimpan lokal di browser/perangkat. Backup data sebelum mengganti folder aplikasi.

## Versi fresh (data kosong)
- Data santri, setoran, absensi, mutabaah, halaqah, amalan tersimpan, pengumuman, dan sesi login lama dibersihkan satu kali saat versi fresh pertama kali dibuka.
- Database Al-Qur'an 114 surah, struktur aplikasi, menu, serta fitur tetap dipertahankan.
- Setelah dibuka, data baru yang dimasukkan akan tersimpan normal di browser.
