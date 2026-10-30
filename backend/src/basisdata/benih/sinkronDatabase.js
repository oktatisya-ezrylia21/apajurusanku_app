// Sinkronisasi konten dari file sumber ke SQLite tanpa menghapus data pengguna.
import { pathToFileURL } from 'node:url';
import { db } from '../../konfigurasi/database.js';
import { jalankanMigrasi } from '../migrasi/jalankanMigrasi.js';
import { DAFTAR_JURUSAN } from './dataJurusan.js';
import { DAFTAR_SEKOLAH_SMK, DAFTAR_SEKOLAH_ASAL } from './dataSekolah.js';
import { DAFTAR_SOAL } from './dataSoal.js';
import { sinkronGambarSoal } from './sinkronGambarSoal.js';

const slug = (teks) => teks.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 36);

// Kode pertama mempertahankan kode lama agar relasi sekolah yang sudah ada tetap valid.
// Entri berikutnya dengan kode sama mendapat kode stabil berbasis nama jurusan.
function siapkanJurusan() {
  const terpakai = new Set();
  const jumlahKode = new Map();
  return DAFTAR_JURUSAN.map((item) => {
    const dasar = String(item.kode).trim().toUpperCase();
    const urutan = (jumlahKode.get(dasar) ?? 0) + 1;
    jumlahKode.set(dasar, urutan);
    let kode = dasar;
    if (terpakai.has(kode)) {
      const kandidat = `${dasar}_${slug(item.nama) || urutan}`;
      kode = kandidat;
      let tambahan = 2;
      while (terpakai.has(kode)) kode = `${kandidat}_${tambahan++}`;
    }
    terpakai.add(kode);
    return { ...item, kode };
  });
}

export function sinkronDatabase() {
  jalankanMigrasi();
  const jurusan = siapkanJurusan();
  const ringkasan = { jurusan: 0, sekolahSMK: 0, sekolahAsal: 0, soal: 0 };

  const transaksi = db.transaction(() => {
    const upsertJurusan = db.prepare(`INSERT INTO jurusan
      (kode, nama, kode_riasec, deskripsi, pembelajaran, prospek_kerja, lanjut_kuliah)
      VALUES (@kode, @nama, @kodeRiasec, @deskripsi, @pembelajaran, @prospekKerja, @lanjutKuliah)
      ON CONFLICT(kode) DO UPDATE SET nama=excluded.nama, kode_riasec=excluded.kode_riasec,
      deskripsi=excluded.deskripsi, pembelajaran=excluded.pembelajaran,
      prospek_kerja=excluded.prospek_kerja, lanjut_kuliah=excluded.lanjut_kuliah`);
    jurusan.forEach((j) => { upsertJurusan.run(j); ringkasan.jurusan++; });

    const upsertAsal = db.prepare(`INSERT INTO sekolah_asal (nama, kota) VALUES (@nama, @kota)
      ON CONFLICT(nama) DO UPDATE SET kota=excluded.kota`);
    DAFTAR_SEKOLAH_ASAL.forEach((s) => { upsertAsal.run(s); ringkasan.sekolahAsal++; });

    const upsertSMK = db.prepare(`INSERT INTO sekolah
      (npsn, nama, kota, alamat, latitude, longitude, akreditasi, keterangan, favorit, kode_jurusan, url_instagram, url_tiktok, url_spmb)
      VALUES (@npsn, @nama, @kota, @alamat, @latitude, @longitude, @akreditasi, @keterangan, @favorit, @kodeJurusan, @urlInstagram, @urlTiktok, @urlSpmb)
      ON CONFLICT(npsn) DO UPDATE SET nama=excluded.nama, kota=excluded.kota, alamat=excluded.alamat,
      latitude=excluded.latitude, longitude=excluded.longitude, akreditasi=excluded.akreditasi,
      keterangan=excluded.keterangan, favorit=excluded.favorit, kode_jurusan=excluded.kode_jurusan,
      url_instagram=excluded.url_instagram, url_tiktok=excluded.url_tiktok, url_spmb=excluded.url_spmb`);
    DAFTAR_SEKOLAH_SMK.forEach((s) => {
      upsertSMK.run({ ...s, favorit: s.favorit ? 1 : 0 });
      ringkasan.sekolahSMK++;
    });

    // Update berdasarkan urutan agar ID soal lama tetap dipertahankan untuk riwayat jawaban.
    const cariSoal = db.prepare('SELECT id FROM soal WHERE urutan = ? ORDER BY id LIMIT 1');
    const ubahSoal = db.prepare(`UPDATE soal SET pertanyaan=@pertanyaan, teks_a=@teks_a, tipe_a=@tipe_a,
      gambar_a=COALESCE(gambar_a, @gambar_a), teks_b=@teks_b, tipe_b=@tipe_b,
      gambar_b=COALESCE(gambar_b, @gambar_b) WHERE id=@id`);
    const tambahSoal = db.prepare(`INSERT INTO soal
      (urutan, pertanyaan, teks_a, tipe_a, gambar_a, teks_b, tipe_b, gambar_b)
      VALUES (@urutan, @pertanyaan, @teks_a, @tipe_a, @gambar_a, @teks_b, @tipe_b, @gambar_b)`);
    DAFTAR_SOAL.forEach((s, i) => {
      const urutan = i + 1;
      const lama = cariSoal.get(urutan);
      if (lama) ubahSoal.run({ ...s, urutan, id: lama.id });
      else tambahSoal.run({ ...s, urutan });
      ringkasan.soal++;
    });
  });

  transaksi();
  const gambar = sinkronGambarSoal();
  return { ...ringkasan, gambarDiperbarui: gambar.diperbarui, gambarHilang: gambar.hilang.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const hasil = sinkronDatabase();
    console.log('Sinkronisasi SQLite berhasil:', hasil);
  } catch (error) {
    console.error('Sinkronisasi gagal; transaksi konten dibatalkan:', error);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}
