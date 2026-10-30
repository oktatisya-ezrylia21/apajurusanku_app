# Sinkronisasi Database Apa Jurusanku

Sinkronisasi memperbarui/menambahkan data konten dari file sumber ke SQLite tanpa menghapus data siswa, guru, hasil tes, maupun jawaban.

## Jalankan

1. Hentikan server backend.
2. Cadangkan `data/apajurusanku.sqlite` (jika ada file `-wal`/`-shm`, hentikan server terlebih dahulu agar SQLite menutup transaksi dengan benar).
3. Buka terminal pada folder `backend`.
4. Jalankan `npm run sinkron`.
5. Jalankan kembali backend dengan `npm run dev`.

## Sumber data

- Jurusan: `src/basisdata/benih/dataJurusan.js`
- Sekolah SMK dan sekolah asal: `src/basisdata/benih/dataSekolah.js`
- Soal: `src/basisdata/benih/dataSoal.js`

## Aturan keamanan

- Proses menggunakan transaksi SQLite. Jika proses gagal, perubahan dalam transaksi dibatalkan.
- Data siswa, guru, admin, hasil tes, dan jawaban tidak dihapus.
- Data konten yang sudah tidak ada di file sumber tidak dihapus otomatis, agar relasi/riwayat yang sudah ada tidak rusak.
- Sekolah SMK diperbarui berdasarkan NPSN; sekolah asal berdasarkan nama; soal diperbarui berdasarkan nomor urut agar ID soal yang sudah dipakai riwayat jawaban tetap stabil.
- Koordinat latitude/longitude boleh sama. Koordinat tidak dipakai sebagai kunci unik.
- Jika kode jurusan di file sumber bentrok, entri pertama mempertahankan kode aslinya. Entri berikutnya mendapat kode unik stabil berbasis nama. Karena daftar sekolah hanya menyimpan kode lama, hubungan sekolah yang memakai kode bentrok tetap mengarah ke entri pertama; periksa dan koreksi `kodeJurusan` sekolah secara manual jika sekolah tersebut sebenarnya membuka jurusan duplikat yang lain.
