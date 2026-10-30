// Kontroler khusus siswa: hasil tes terakhir dan rekomendasi sekolah.
import { PILIHAN_RADIUS } from '../konfigurasi/kontenAplikasi.js';
import { cariSekolahRekomendasi } from '../layanan/rekomendasiSekolah.js';
import * as tesLayanan from '../layanan/tesLayanan.js';
import { GalatAplikasi, kirimSukses } from '../utilitas/responsStandar.js';

/** GET /api/siswa/hasil-terakhir — null bila belum pernah tes. */
export const ambilHasilTerakhir = (req, res) => kirimSukses(res, tesLayanan.ambilHasilTerakhir(req.pengguna.id));

/** GET /api/siswa/sekolah?kode=RPL&radius=25&lat=-6.9&lng=107.6  (radius kosong/'provinsi' = tanpa batas) */
export function ambilSekolahRekomendasi(req, res) {
  const kodeJurusan = String(req.query.kode ?? '').trim();
  if (!kodeJurusan) throw new GalatAplikasi('Kode jurusan wajib diisi', 422);

  const radiusDiminta = Number(req.query.radius);
  const radiusKm = PILIHAN_RADIUS.some((p) => p.nilai === radiusDiminta) ? radiusDiminta : null;

  const hasil = cariSekolahRekomendasi({
    kodeJurusan,
    latitude: req.query.lat !== undefined ? Number(req.query.lat) : undefined,
    longitude: req.query.lng !== undefined ? Number(req.query.lng) : undefined,
    radiusKm,
  });
  return kirimSukses(res, hasil);
}
