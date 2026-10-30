// Model hasil tes. skor_tipe & ranking_jurusan disimpan sebagai JSON, dibaca kembali sebagai objek.
import { db } from '../konfigurasi/database.js';

/** Mengubah baris database menjadi objek yang kolom JSON-nya sudah di-parse. */
function olahBaris(baris) {
  if (!baris) return null;
  return { ...baris, skor_tipe: JSON.parse(baris.skor_tipe), ranking_jurusan: JSON.parse(baris.ranking_jurusan) };
}

export const modelHasilTes = {
  simpan({ siswaId, skorTipe, rankingJurusan }) {
    const info = db
      .prepare('INSERT INTO hasil_tes (siswa_id, skor_tipe, ranking_jurusan) VALUES (?, ?, ?)')
      .run(siswaId, JSON.stringify(skorTipe), JSON.stringify(rankingJurusan));
    return Number(info.lastInsertRowid);
  },
  terakhirBySiswa: (siswaId) =>
    olahBaris(db.prepare('SELECT * FROM hasil_tes WHERE siswa_id = ? ORDER BY id DESC LIMIT 1').get(siswaId)),
  olahBaris,
};
