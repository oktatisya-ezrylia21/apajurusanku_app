// Model SMK tujuan. Kolom kode_jurusan berisi daftar kode dipisah koma (contoh: 'RPL,TKJ').
import { db } from '../konfigurasi/database.js';
import { buatModel } from './modelDasar.js';

const dasar = buatModel({
  tabel: 'sekolah',
  kolom: ['npsn', 'nama', 'kota', 'alamat', 'latitude', 'longitude', 'akreditasi', 'keterangan',
    'favorit', 'kode_jurusan', 'url_instagram', 'url_tiktok', 'url_spmb'],
  kolomCari: ['npsn', 'nama', 'kota'],
  urutan: 'nama ASC',
});

/** Merapikan 'rpl, tkj ' menjadi 'RPL,TKJ' agar pencarian per jurusan konsisten. */
const rapikanKodeJurusan = (teks) => String(teks ?? '').split(',').map((k) => k.trim().toUpperCase()).filter(Boolean).join(',');

export const modelSekolah = {
  ...dasar,
  tambah: (data) => dasar.tambah({ ...data, kode_jurusan: rapikanKodeJurusan(data.kode_jurusan) }),
  ubah: (id, data) => dasar.ubah(id, { ...data, kode_jurusan: rapikanKodeJurusan(data.kode_jurusan) }),

  /** Semua sekolah yang membuka jurusan tertentu (pencocokan kode utuh, bukan sebagian). */
  cariByJurusan: (kodeJurusan) =>
    db.prepare(`SELECT * FROM sekolah WHERE ',' || kode_jurusan || ',' LIKE '%,' || @kode || ',%'`).all({ kode: kodeJurusan.toUpperCase() }),
};
