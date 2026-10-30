// Model siswa. Selain CRUD, ada pencarian berdasarkan NISN dan nama persis.
import { db } from '../konfigurasi/database.js';
import { buatModel } from './modelDasar.js';

const dasar = buatModel({
  tabel: 'siswa',
  kolom: ['nisn', 'nama', 'sekolah_asal'],
  kolomCari: ['nisn', 'nama', 'sekolah_asal'],
  urutan: 'id ASC',
});

export const modelSiswa = {
  ...dasar,
  cariByNisn: (nisn) => db.prepare('SELECT * FROM siswa WHERE nisn = ?').get(nisn) ?? null,
  /** Dipakai fitur "Cek NISN": nama harus sama persis (bukan LIKE) agar NISN orang lain tidak mudah terjaring. */
  cariByNamaPersis: (nama) => db.prepare('SELECT id, nama, nisn, sekolah_asal FROM siswa WHERE nama = ? COLLATE NOCASE LIMIT 5').all(nama),
};
