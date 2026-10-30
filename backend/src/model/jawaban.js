// Model jawaban per soal untuk setiap hasil tes.
import { db } from '../konfigurasi/database.js';

export const modelJawaban = {
  /** Menyimpan banyak jawaban sekaligus (dipanggil di dalam transaksi layanan). */
  simpanBanyak(hasilTesId, daftarJawaban) {
    const sisip = db.prepare('INSERT INTO jawaban (hasil_tes_id, soal_id, tipe_dipilih) VALUES (?, ?, ?)');
    daftarJawaban.forEach((j) => sisip.run(hasilTesId, j.soal_id, j.tipe));
  },
  byHasilTes: (hasilTesId) => db.prepare('SELECT soal_id, tipe_dipilih FROM jawaban WHERE hasil_tes_id = ?').all(hasilTesId),
};
