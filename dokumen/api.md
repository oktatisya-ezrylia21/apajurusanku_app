# Dokumentasi API

Basis URL: `/api`. Semua respons berformat JSON:

```json
{ "sukses": true,  "pesan": "Berhasil", "data": { } }
{ "sukses": false, "pesan": "NISN harus 10 digit angka", "rincian": ["..."] }
```

Endpoint bertanda 🔒 butuh header `Authorization: Bearer <token>` (token didapat dari login).
Nama field memakai `snake_case`, sama dengan nama kolom database.

## Autentikasi — `/api/auth` (dibatasi 30 percobaan / 15 menit / IP)

| Metode | Rute | Body / Query | Keterangan |
|---|---|---|---|
| POST | `/auth/siswa` | `{ nama, nisn, sekolah_asal? }` | Masuk siswa. NISN baru otomatis didaftarkan. |
| GET | `/auth/cek-nisn?nama=` | — | Cari NISN dari nama lengkap (harus persis sama). |
| POST | `/auth/guru` | `{ nama, email, sekolah_asal }` | Masuk guru. Sekolah harus ada di daftar sekolah asal. |
| POST | `/auth/admin` | `{ username, kata_sandi }` | Masuk admin. |

Respons login: `{ token, pengguna: { id, nama, peran, ... } }`.

## Tes — `/api/tes`

| Metode | Rute | Peran | Keterangan |
|---|---|---|---|
| GET | `/tes/konten` | publik | Tipe RIASEC, langkah selanjutnya, pilihan radius, daftar jurusan & sekolah asal. |
| GET | `/tes/soal` 🔒 | siswa | Semua soal terurut. |
| POST | `/tes/hasil` 🔒 | siswa | Body `{ jawaban: [{ soal_id, tipe }] }`. Semua soal wajib dijawab. Mengembalikan ranking jurusan. |
| GET | `/tes/jurusan/:kode` 🔒 | semua | Detail jurusan. |

## Siswa — `/api/siswa` 🔒 (peran siswa)

| Metode | Rute | Keterangan |
|---|---|---|
| GET | `/siswa/hasil-terakhir` | Hasil tes terbaru, `null` bila belum tes. |
| GET | `/siswa/sekolah?kode=RPL&radius=25&lat=&lng=` | Sekolah `terdekat` & `favorit`. `radius` kosong = tanpa batas. Tanpa `lat/lng` dipakai lokasi bawaan. (Tidak lagi dipakai frontend: tombol sekolah terdekat kini membuka Google Maps; endpoint dipertahankan untuk keperluan lain.) |

## Guru — `/api/guru` 🔒 (peran guru)

| Metode | Rute | Keterangan |
|---|---|---|
| GET | `/guru/dashboard?cari=` | Ringkasan + daftar siswa sekolahnya yang sudah tes. |
| GET | `/guru/siswa/:id` | Detail ranking satu siswa (hanya siswa dari sekolah guru tsb). |

## Admin — `/api/admin` 🔒 (peran admin)

`:sumber` ∈ `jurusan`, `siswa`, `soal`, `sekolah`, `guru`, `sekolah-asal`.

| Metode | Rute | Keterangan |
|---|---|---|
| GET | `/admin/:sumber?cari=&halaman=1&batas=5` | Daftar + pencarian + halaman. |
| POST | `/admin/:sumber` | Tambah data (divalidasi sesuai `src/validasi/skemaAdmin.js`). |
| PUT | `/admin/:sumber/:kunci` | Ubah data. Kunci = `kode` untuk jurusan, `id` untuk lainnya. |
| DELETE | `/admin/:sumber/:kunci` | Hapus data. |
| POST | `/admin/unggah` | `multipart/form-data`, field `gambar` (PNG/JPG/WEBP/SVG, maks 1 MB) → `{ jalur }`. |

## Kode status

`200/201` sukses · `401` belum/kedaluwarsa login · `403` peran tidak berhak · `404` tidak ditemukan ·
`409` data kembar (mis. NISN sudah ada) · `422` validasi gagal · `429` terlalu banyak permintaan.
