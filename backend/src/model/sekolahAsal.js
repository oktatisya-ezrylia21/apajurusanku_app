// Model daftar SMP/MTs asal siswa.
import { buatModel } from './modelDasar.js';
import { db } from '../konfigurasi/database.js';

const dasar = buatModel({
  tabel: 'sekolah_asal',
  kolom: ['nama', 'kota'],
  kolomCari: ['nama', 'kota'],
  urutan: 'nama ASC',
});

export const modelSekolahAsal = {
  ...dasar,
  /** Mencari sekolah asal berdasarkan nama persis (tanpa membedakan huruf besar/kecil). */
  cariByNama: (nama) => db.prepare('SELECT * FROM sekolah_asal WHERE nama = ? COLLATE NOCASE').get(nama) ?? null,
};
