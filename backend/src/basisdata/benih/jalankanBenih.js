// Mengisi data awal dari file data*.js di folder ini.
//   npm run benih         -> hanya mengisi tabel yang MASIH KOSONG (aman, tidak menimpa)
//   npm run benih:ulang   -> MENGHAPUS data jurusan/soal/sekolah lalu mengisi ulang dari file
import { pathToFileURL } from 'node:url';
import { db } from '../../konfigurasi/database.js';
import { env } from '../../konfigurasi/env.js';
import { hashKataSandi } from '../../utilitas/enkripsi.js';
import { logger } from '../../utilitas/logger.js';
import { jalankanMigrasi } from '../migrasi/jalankanMigrasi.js';
import { DAFTAR_JURUSAN } from './dataJurusan.js';
import { DAFTAR_SOAL } from './dataSoal.js';
import { sinkronGambarSoal } from './sinkronGambarSoal.js';
import { DAFTAR_SEKOLAH_SMK, DAFTAR_SEKOLAH_ASAL } from './dataSekolah.js';
import { DAFTAR_SISWA_CONTOH, DAFTAR_GURU_CONTOH } from './dataPengguna.js';

/** Menghitung jumlah baris pada sebuah tabel (nama tabel berasal dari kode ini, bukan input pengguna). */
const hitungBaris = (tabel) => db.prepare(`SELECT COUNT(*) AS total FROM ${tabel}`).get().total;

/**
 * Mengisi seluruh data awal di dalam SATU transaksi: bila ada yang gagal, semuanya dibatalkan.
 * @param {{ulang?: boolean}} opsi  ulang=true menghapus data konten lama sebelum mengisi.
 */
export function isiBenih({ ulang = false } = {}) {
  jalankanMigrasi();

  const prosesBenih = db.transaction(() => {
    // Mode ulang: hapus data konten (hasil tes siswa ikut terhapus karena relasi CASCADE).
    if (ulang) {
      ['jawaban', 'hasil_tes', 'soal', 'sekolah', 'sekolah_asal', 'jurusan'].forEach((t) => db.exec(`DELETE FROM ${t}`));
    }

    if (hitungBaris('jurusan') === 0) {
      const sisip = db.prepare(`INSERT INTO jurusan (kode, nama, kode_riasec, deskripsi, pembelajaran, prospek_kerja, lanjut_kuliah)
        VALUES (@kode, @nama, @kodeRiasec, @deskripsi, @pembelajaran, @prospekKerja, @lanjutKuliah)`);
      DAFTAR_JURUSAN.forEach((j) => sisip.run(j));
    }

    if (hitungBaris('soal') === 0) {
      const sisip = db.prepare(`INSERT INTO soal (urutan, pertanyaan, teks_a, tipe_a, gambar_a, teks_b, tipe_b, gambar_b)
VALUES (@urutan, @pertanyaan, @teks_a, @tipe_a, @gambar_a, @teks_b, @tipe_b, @gambar_b)`);
      // Nomor urut soal mengikuti posisi di array (mulai dari 1).
      DAFTAR_SOAL.forEach((s, indeks) => sisip.run({ ...s, urutan: indeks + 1 }));
    }

    if (hitungBaris('sekolah_asal') === 0) {
      const sisip = db.prepare('INSERT INTO sekolah_asal (nama, kota) VALUES (@nama, @kota)');
      DAFTAR_SEKOLAH_ASAL.forEach((s) => sisip.run(s));
    }

    if (hitungBaris('sekolah') === 0) {
      const sisip = db.prepare(`INSERT INTO sekolah
        (npsn, nama, kota, alamat, latitude, longitude, akreditasi, keterangan, favorit, kode_jurusan, url_instagram, url_tiktok, url_spmb)
        VALUES (@npsn, @nama, @kota, @alamat, @latitude, @longitude, @akreditasi, @keterangan, @favorit, @kodeJurusan, @urlInstagram, @urlTiktok, @urlSpmb)`);
      DAFTAR_SEKOLAH_SMK.forEach((s) => sisip.run({ ...s, favorit: s.favorit ? 1 : 0 }));
    }

    // Data contoh siswa & guru hanya diisi bila tabelnya kosong dan bukan produksi.
    if (env.lingkungan !== 'production') {
      if (hitungBaris('siswa') === 0) {
        const sisip = db.prepare('INSERT INTO siswa (nisn, nama, sekolah_asal) VALUES (@nisn, @nama, @sekolahAsal)');
        DAFTAR_SISWA_CONTOH.forEach((s) => sisip.run(s));
      }
      if (hitungBaris('guru') === 0) {
        const sisip = db.prepare('INSERT INTO guru (nama, email, sekolah_asal) VALUES (@nama, @email, @sekolahAsal)');
        DAFTAR_GURU_CONTOH.forEach((g) => sisip.run(g));
      }
    }

    // Akun admin pertama (kata sandi disimpan dalam bentuk hash, tidak pernah plain text).
    if (hitungBaris('admin') === 0) {
      db.prepare('INSERT INTO admin (username, kata_sandi_hash) VALUES (?, ?)')
        .run(env.adminAwal.username, hashKataSandi(env.adminAwal.kataSandi));
    }
  });

  prosesBenih();
  sinkronGambarSoal();
  logger.info('Data awal (benih) selesai diisi.');
}

// Dijalankan langsung dari terminal (npm run benih / benih:ulang).
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  isiBenih({ ulang: process.argv.includes('--ulang') });
}
