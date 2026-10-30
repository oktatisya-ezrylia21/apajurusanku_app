// Pabrik model CRUD generik. Setiap tabel yang butuh tambah/ubah/hapus/daftar cukup memanggil
// buatModel() dengan konfigurasi, sehingga tidak perlu menulis SQL yang sama berulang-ulang.
//
// Catatan keamanan: nama tabel & kolom hanya berasal dari kode (bukan input pengguna);
// seluruh NILAI selalu dikirim lewat parameter bernama (@nama) → aman dari SQL injection.
import { db } from '../konfigurasi/database.js';

/**
 * @param {object} konfigurasi
 * @param {string}   konfigurasi.tabel       nama tabel
 * @param {string[]} konfigurasi.kolom       kolom yang boleh ditulis (termasuk kolom kunci bila bukan auto-increment)
 * @param {string[]} [konfigurasi.kolomCari] kolom yang dicari saat ada kata kunci pencarian
 * @param {string}   [konfigurasi.urutan]    klausa ORDER BY bawaan
 * @param {string}   [konfigurasi.kunci]     nama kolom kunci utama (bawaan: id)
 */
export function buatModel({ tabel, kolom, kolomCari = [], urutan = 'id ASC', kunci = 'id' }) {
  /** Mengambil satu baris berdasarkan kunci utama. */
  function cariByKunci(nilaiKunci) {
    return db.prepare(`SELECT * FROM ${tabel} WHERE ${kunci} = ?`).get(nilaiKunci) ?? null;
  }

  /** Daftar data dengan pencarian dan halaman (pagination). */
  function daftar({ cari = '', halaman = 1, batas = 5 } = {}) {
    const adaCari = cari.trim() !== '' && kolomCari.length > 0;
    const where = adaCari ? `WHERE ${kolomCari.map((k) => `${k} LIKE @cari`).join(' OR ')}` : '';
    const parameterCari = adaCari ? { cari: `%${cari.trim()}%` } : {};

    const total = db.prepare(`SELECT COUNT(*) AS total FROM ${tabel} ${where}`).get(parameterCari).total;
    const baris = db
      .prepare(`SELECT * FROM ${tabel} ${where} ORDER BY ${urutan} LIMIT @batas OFFSET @lewati`)
      .all({ ...parameterCari, batas, lewati: (halaman - 1) * batas });

    return { baris, total, halaman, batas, totalHalaman: Math.max(1, Math.ceil(total / batas)) };
  }

  /** Semua baris tanpa pagination. */
  function semua() {
    return db.prepare(`SELECT * FROM ${tabel} ORDER BY ${urutan}`).all();
  }

  /** Menambah baris baru; mengembalikan baris yang baru tersimpan. */
  function tambah(data) {
    const nilai = Object.fromEntries(kolom.map((k) => [k, data[k] ?? null]));
    const info = db
      .prepare(`INSERT INTO ${tabel} (${kolom.join(', ')}) VALUES (${kolom.map((k) => `@${k}`).join(', ')})`)
      .run(nilai);
    return cariByKunci(kunci === 'id' ? info.lastInsertRowid : data[kunci]);
  }

  /** Mengubah baris; mengembalikan null bila kuncinya tidak ditemukan. */
  function ubah(nilaiKunci, data) {
    const nilai = Object.fromEntries(kolom.map((k) => [k, data[k] ?? null]));
    const info = db
      .prepare(`UPDATE ${tabel} SET ${kolom.map((k) => `${k} = @${k}`).join(', ')} WHERE ${kunci} = @nilaiKunci`)
      .run({ ...nilai, nilaiKunci });
    if (info.changes === 0) return null;
    return cariByKunci(kunci === 'id' ? nilaiKunci : data[kunci]);
  }

  /** Menghapus baris; mengembalikan true bila ada yang terhapus. */
  function hapus(nilaiKunci) {
    return db.prepare(`DELETE FROM ${tabel} WHERE ${kunci} = ?`).run(nilaiKunci).changes > 0;
  }

  return { cariByKunci, daftar, semua, tambah, ubah, hapus };
}
