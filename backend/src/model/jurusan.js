// Model tabel jurusan (kunci utama: kode, contoh 'RPL').
import { buatModel } from './modelDasar.js';

export const modelJurusan = buatModel({
  tabel: 'jurusan',
  kunci: 'kode',
  kolom: ['kode', 'nama', 'kode_riasec', 'deskripsi', 'pembelajaran', 'prospek_kerja', 'lanjut_kuliah'],
  kolomCari: ['kode', 'nama'],
  urutan: 'nama ASC',
});
