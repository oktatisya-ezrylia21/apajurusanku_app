// Penanganan galat terpusat: semua galat berakhir di sini dan dijawab dengan format standar.
import multer from 'multer';
import { logger } from '../utilitas/logger.js';
import { kirimGagal } from '../utilitas/responsStandar.js';

/** Dipanggil bila tidak ada rute yang cocok. */
export function rutaTidakDitemukan(req, res) {
  return kirimGagal(res, `Rute ${req.method} ${req.originalUrl} tidak ditemukan`, 404);
}

/** Penangan galat akhir (Express mengenalinya dari 4 parameter). */
// eslint-disable-next-line no-unused-vars
export function penangananError(galat, _req, res, _lanjut) {
  // Galat buatan sendiri (GalatAplikasi) membawa status & rincian.
  if (galat.statusHttp) return kirimGagal(res, galat.message, galat.statusHttp, galat.rincian);

  // Galat unggah file (ukuran terlalu besar, dll).
  if (galat instanceof multer.MulterError) {
    const pesan = galat.code === 'LIMIT_FILE_SIZE' ? 'Ukuran gambar maksimal 1 MB' : 'Unggahan gagal';
    return kirimGagal(res, pesan, 400);
  }

  // Data kembar (kolom UNIQUE, contoh NISN atau email sudah terdaftar).
  if (galat.code === 'SQLITE_CONSTRAINT_UNIQUE') return kirimGagal(res, 'Data tersebut sudah terdaftar', 409);
  if (galat.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') return kirimGagal(res, 'Data masih dipakai oleh data lain', 409);

  // Galat tak terduga: catat detailnya di log, tapi jangan bocorkan ke pengguna.
  logger.galat(galat);
  return kirimGagal(res, 'Terjadi kesalahan pada server', 500);
}
