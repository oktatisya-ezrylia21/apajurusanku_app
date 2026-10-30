// Model guru (pengguna yang memantau hasil tes siswa satu sekolah).
import { db } from '../konfigurasi/database.js';
import { buatModel } from './modelDasar.js';

const dasar = buatModel({
  tabel: 'guru',
  kolom: ['nama', 'email', 'sekolah_asal'],
  kolomCari: ['nama', 'email', 'sekolah_asal'],
});

export const modelGuru = {
  ...dasar,
  cariByEmail: (email) => db.prepare('SELECT * FROM guru WHERE email = ?').get(email) ?? null,
};
