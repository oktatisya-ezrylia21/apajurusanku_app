// Menyamakan jalur gambar maskot soal di database dengan folder pict-maskot-jawaban.
// Aman dijalankan berulang kali (idempoten) dan TIDAK menghapus data apa pun:
//   - kolom gambar yang masih kosong, atau memakai jalur lama yang salah, diisi jalur yang benar;
//   - gambar yang diunggah admin lewat panel (/unggahan/...) tidak pernah ditimpa.
import fs from 'node:fs';
import path from 'node:path';
import { db } from '../../konfigurasi/database.js';
import { env } from '../../konfigurasi/env.js';
import { logger } from '../../utilitas/logger.js';
import { DAFTAR_SOAL, FOLDER_GAMBAR_SOAL, jalurGambarSoal, namaFileGambarSoal } from './dataSoal.js';

// Jalur lama yang pernah dipakai dan salah (tanpa "Maskot " / tanpa spasi ter-encode / ekstensi lain).
const POLA_JALUR_LAMA = /^\/aset\/gambar\/pict-maskot-jawaban\/(?:Maskot )?Q\d+[AB]\.(?:jpe?g|png)$/i;

const perluDiperbaiki = (jalur) => !jalur || POLA_JALUR_LAMA.test(jalur);

/** @returns {{diperbarui: number, hilang: string[]}} jumlah soal yang diperbaiki dan nama file yang tidak ada di folder. */
export function sinkronGambarSoal() {
  const soal = db.prepare('SELECT id, urutan, gambar_a, gambar_b FROM soal').all();
  const ubah = db.prepare('UPDATE soal SET gambar_a = ?, gambar_b = ? WHERE id = ?');
  let diperbarui = 0;

  db.transaction(() => {
    soal.forEach((s) => {
      if (s.urutan < 1 || s.urutan > DAFTAR_SOAL.length) return;
      const a = perluDiperbaiki(s.gambar_a) ? jalurGambarSoal(s.urutan, 'A') : s.gambar_a;
      const b = perluDiperbaiki(s.gambar_b) ? jalurGambarSoal(s.urutan, 'B') : s.gambar_b;
      if (a !== s.gambar_a || b !== s.gambar_b) { ubah.run(a, b, s.id); diperbarui += 1; }
    });
  })();

  // Peringatan bila file gambarnya tidak ada di folder (hanya diperiksa bila folder frontend ada di server ini).
  const folder = path.join(env.folderFrontend, 'public', FOLDER_GAMBAR_SOAL);
  const hilang = [];
  if (fs.existsSync(folder)) {
    DAFTAR_SOAL.forEach((_, i) => ['A', 'B'].forEach((sisi) => {
      const nama = namaFileGambarSoal(i + 1, sisi);
      if (!fs.existsSync(path.join(folder, nama))) hilang.push(nama);
    }));
  }
  if (diperbarui > 0) logger.info(`Jalur gambar soal diperbaiki: ${diperbarui} soal.`);
  if (hilang.length > 0) logger.peringatan(`File gambar soal tidak ditemukan di ${folder}: ${hilang.join(', ')}`);
  return { diperbarui, hilang };
}
