// Kontroler admin: CRUD generik untuk semua sumber data + unggah gambar.
// Menambah sumber baru cukup: buat model, tambahkan skema di validasi/skemaAdmin.js, daftarkan di SUMBER_ADMIN.
import { modelGuru } from '../model/guru.js';
import { modelJurusan } from '../model/jurusan.js';
import { modelSekolah } from '../model/sekolah.js';
import { modelSekolahAsal } from '../model/sekolahAsal.js';
import { modelSiswa } from '../model/siswa.js';
import { modelSoal } from '../model/soal.js';
import { GalatAplikasi, kirimSukses } from '../utilitas/responsStandar.js';

/** Pemetaan nama sumber di URL → model-nya. */
export const SUMBER_ADMIN = {
  jurusan: modelJurusan,
  siswa: modelSiswa,
  soal: modelSoal,
  sekolah: modelSekolah,
  guru: modelGuru,
  'sekolah-asal': modelSekolahAsal,
};

/** Middleware: menolak nama sumber yang tidak dikenal (404). */
export function pastikanSumberValid(req, _res, lanjut) {
  if (!Object.hasOwn(SUMBER_ADMIN, req.params.sumber)) return lanjut(new GalatAplikasi('Sumber data tidak dikenal', 404));
  return lanjut();
}

const modelDari = (req) => SUMBER_ADMIN[req.params.sumber];

/** Kode jurusan selalu huruf besar agar konsisten dengan pencarian sekolah. */
const rapikanData = (sumber, data) => (sumber === 'jurusan' ? { ...data, kode: data.kode.toUpperCase() } : data);

/** GET /api/admin/:sumber?cari=&halaman=1&batas=5 */
export function daftar(req, res) {
  const halaman = Math.max(1, parseInt(req.query.halaman, 10) || 1);
  const batas = Math.min(100, Math.max(1, parseInt(req.query.batas, 10) || 5));
  return kirimSukses(res, modelDari(req).daftar({ cari: String(req.query.cari ?? ''), halaman, batas }));
}

/** POST /api/admin/:sumber */
export function tambah(req, res) {
  const baru = modelDari(req).tambah(rapikanData(req.params.sumber, req.dataValid));
  return kirimSukses(res, baru, 'Data tersimpan', 201);
}

/** PUT /api/admin/:sumber/:kunci */
export function ubah(req, res) {
  const diubah = modelDari(req).ubah(req.params.kunci, rapikanData(req.params.sumber, req.dataValid));
  if (!diubah) throw new GalatAplikasi('Data tidak ditemukan', 404);
  return kirimSukses(res, diubah, 'Data tersimpan');
}

/** DELETE /api/admin/:sumber/:kunci */
export function hapus(req, res) {
  if (!modelDari(req).hapus(req.params.kunci)) throw new GalatAplikasi('Data tidak ditemukan', 404);
  return kirimSukses(res, null, 'Data dihapus');
}

/** POST /api/admin/unggah (multipart, field "gambar") → mengembalikan jalur gambar. */
export function unggah(req, res) {
  if (!req.file) throw new GalatAplikasi('Pilih gambar terlebih dahulu', 422);
  return kirimSukses(res, { jalur: `/unggahan/${req.file.filename}` }, 'Gambar terunggah', 201);
}
