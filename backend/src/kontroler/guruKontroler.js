// Kontroler khusus guru: dashboard dan detail hasil siswa.
import * as guruLayanan from '../layanan/guruLayanan.js';
import { kirimSukses } from '../utilitas/responsStandar.js';

/** GET /api/guru/dashboard?cari=budi */
export const ambilDashboard = (req, res) =>
  kirimSukses(res, guruLayanan.ambilRingkasanDashboard(req.pengguna.id, String(req.query.cari ?? '')));

/** GET /api/guru/siswa/:id */
export const ambilDetailSiswa = (req, res) =>
  kirimSukses(res, guruLayanan.ambilDetailHasilSiswa(req.pengguna.id, Number(req.params.id)));
