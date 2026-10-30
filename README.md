# apajurusanku

Aplikasi tes minat (RIASEC) untuk merekomendasikan jurusan SMK, lengkap dengan pencarian sekolah terdekat lewat Google Maps.
Tiga peran: **siswa** (tes & hasil), **guru** (pantau hasil siswa sekolahnya), **admin** (kelola data).

Stack: Node.js + Express + **SQLite** (better-sqlite3) · Frontend HTML/CSS/JavaScript modul (tanpa build).

## Menjalankan (pengembangan)

```bash
cd backend
npm install
cp .env.example .env        # lalu isi JWT_RAHASIA dan ADMIN_KATA_SANDI
npm run dev                 # http://localhost:3000
```
Saat pertama menyala, tabel dibuat dan data awal diisi otomatis. Buka `http://localhost:3000`.

Akun uji coba (data contoh, hanya di luar produksi):
- Siswa: nama `Budi Santoso`, NISN `0012345678`
- Guru: email `rina@smpn1.sch.id`, sekolah `SMPN 1 Contoh, Kota Bandung`
- Admin: username & kata sandi dari `.env`

Perintah lain: `npm test` · `npm run lint` · `npm run benih` · `npm run benih:ulang`.

## 📝 Data yang sering diubah (semuanya terpusat)

| Yang ingin diubah | Edit file |
|---|---|
| **Soal tes** (pertanyaan, pilihan) | `backend/src/basisdata/benih/dataSoal.js` |
| **Nama jurusan** + detailnya | `backend/src/basisdata/benih/dataJurusan.js` |
| **Nama sekolah SMK** (alamat, koordinat, link IG/TikTok/SPMB) & SMP asal | `backend/src/basisdata/benih/dataSekolah.js` |
| Siswa & guru contoh | `backend/src/basisdata/benih/dataPengguna.js` |
| Ikon/nama tipe RIASEC, "langkah selanjutnya", pilihan radius, lokasi bawaan | `backend/src/konfigurasi/kontenAplikasi.js` |
| Kolom tabel & form panel admin | `frontend/src/js/halaman/admin/definisiSumber.js` |
| Warna & tema | `frontend/src/css/dasar/variabel.css` |

Setelah mengedit file di folder `benih/`, jalankan **`npm run benih:ulang`** (menimpa jurusan, soal, dan sekolah;
hasil tes yang sudah tersimpan ikut terhapus). Alternatif tanpa menyentuh kode: ubah lewat panel **Admin**.

> Data sekolah di repo hanyalah **contoh fiktif**. Ganti dengan data asli sebelum dipakai.

## Alur singkat

`Frontend (src/js/halaman/*)` → `layanan/apiKlien.js` → `Rute` → `Middleware (auth, validasi)` → `Kontroler` → `Layanan (logika bisnis)` → `Model (SQL)` → SQLite

## Keamanan yang sudah diterapkan
Kata sandi admin di-hash (bcrypt) · token JWT per peran · otorisasi peran · validasi skema di server ·
SQL berparameter · escaping HTML di frontend · batas laju (rate limit) · validasi & batas ukuran unggahan ·
guru hanya bisa melihat siswa sekolahnya · jawaban tes divalidasi terhadap soal di server.

**Catatan:** login siswa (nama + NISN) dan guru (email) sengaja tanpa kata sandi mengikuti rancangan UI.
Bila data nyata siswa dipakai, pertimbangkan kode verifikasi dari sekolah/guru.

Dokumentasi lengkap: `dokumen/api.md`, `dokumen/database.md`, `dokumen/panduan-deploy.md`.
