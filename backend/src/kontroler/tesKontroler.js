// Kontroler tes: konten umum, soal, pengiriman jawaban, dan detail jurusan.
import { JUMLAH_JURUSAN_REKOMENDASI, LANGKAH_SELANJUTNYA, PILIHAN_RADIUS, TIPE_RIASEC } from '../konfigurasi/kontenAplikasi.js';
import { modelJurusan } from '../model/jurusan.js';
import { modelSekolahAsal } from '../model/sekolahAsal.js';
import * as tesLayanan from '../layanan/tesLayanan.js';
import { kirimSukses } from '../utilitas/responsStandar.js';

/** GET /api/tes/konten — data umum untuk semua halaman (tanpa login). */
export function ambilKonten(_req, res) {
  return kirimSukses(res, {
    tipe_riasec: TIPE_RIASEC,
    langkah_selanjutnya: LANGKAH_SELANJUTNYA,
    pilihan_radius: PILIHAN_RADIUS,
    jumlah_jurusan_rekomendasi: JUMLAH_JURUSAN_REKOMENDASI,
    sekolah_asal: modelSekolahAsal.semua().map((s) => s.nama),
    jurusan: modelJurusan.semua().map(({ kode, nama }) => ({ kode, nama })),
  });
}

/** GET /api/tes/soal — daftar soal untuk dikerjakan siswa. */
export const ambilSoal = (_req, res) => kirimSukses(res, tesLayanan.ambilSemuaSoal());

/** POST /api/tes/hasil — body: { jawaban: [{ soal_id, tipe }, ...] } */
export function kirimJawaban(req, res) {
  const hasil = tesLayanan.prosesDanSimpanHasil(req.pengguna.id, req.body?.jawaban);
  return kirimSukses(res, hasil, 'Hasil tes tersimpan', 201);
}

/** GET /api/tes/jurusan/:kode */
export const ambilDetailJurusan = (req, res) => kirimSukses(res, tesLayanan.ambilDetailJurusan(req.params.kode));
