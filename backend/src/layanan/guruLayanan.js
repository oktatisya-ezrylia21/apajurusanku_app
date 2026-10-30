// Logika bisnis untuk guru: melihat hasil tes siswa pada SEKOLAH GURU ITU SENDIRI saja.
import { db } from '../konfigurasi/database.js';
import { modelGuru } from '../model/guru.js';
import { modelHasilTes } from '../model/hasilTes.js';
import { GalatAplikasi } from '../utilitas/responsStandar.js';

/** Mengambil data guru dari token; galat bila akun sudah tidak ada. */
function ambilGuru(idGuru) {
  const guru = modelGuru.cariByKunci(idGuru);
  if (!guru) throw new GalatAplikasi('Akun guru tidak ditemukan', 404);
  return guru;
}

/** Daftar siswa yang SUDAH tes di sekolah guru, beserta jurusan teratasnya. Mendukung pencarian nama. */
export function ambilDaftarSiswaSudahTes(idGuru, cari = '') {
  const guru = ambilGuru(idGuru);
  // Subquery memilih hanya hasil tes TERBARU tiap siswa.
  const baris = db.prepare(`
    SELECT s.id, s.nama, s.nisn, h.ranking_jurusan, h.dibuat_pada
    FROM siswa s
    JOIN hasil_tes h ON h.id = (SELECT MAX(id) FROM hasil_tes WHERE siswa_id = s.id)
    WHERE s.sekolah_asal = @sekolah AND s.nama LIKE @cari
    ORDER BY s.nama ASC
  `).all({ sekolah: guru.sekolah_asal, cari: `%${cari.trim()}%` });

  return baris.map((b) => {
    const ranking = JSON.parse(b.ranking_jurusan);
    return { id: b.id, nama: b.nama, nisn: b.nisn, jurusan_teratas: ranking[0]?.nama ?? '-', persen_teratas: ranking[0]?.persen ?? 0, dibuat_pada: b.dibuat_pada };
  });
}

/** Ringkasan dashboard: nama sekolah, jumlah siswa terdaftar, dan jumlah yang sudah tes. */
export function ambilRingkasanDashboard(idGuru, cari = '') {
  const guru = ambilGuru(idGuru);
  const totalTerdaftar = db.prepare('SELECT COUNT(*) AS total FROM siswa WHERE sekolah_asal = ?').get(guru.sekolah_asal).total;
  const daftarSiswa = ambilDaftarSiswaSudahTes(idGuru, cari);
  const totalSudahTes = ambilDaftarSiswaSudahTes(idGuru).length;
  return { guru: { nama: guru.nama, sekolah_asal: guru.sekolah_asal }, total_terdaftar: totalTerdaftar, total_sudah_tes: totalSudahTes, daftar_siswa: daftarSiswa };
}

/** Detail hasil satu siswa. Ditolak bila siswa bukan dari sekolah guru tersebut. */
export function ambilDetailHasilSiswa(idGuru, idSiswa) {
  const guru = ambilGuru(idGuru);
  const siswa = db.prepare('SELECT id, nama, nisn, sekolah_asal FROM siswa WHERE id = ?').get(idSiswa);
  if (!siswa || siswa.sekolah_asal !== guru.sekolah_asal) throw new GalatAplikasi('Siswa tidak ditemukan di sekolah Anda', 404);

  const hasil = modelHasilTes.terakhirBySiswa(siswa.id);
  if (!hasil) throw new GalatAplikasi('Siswa ini belum mengerjakan tes', 404);
  return { siswa, ranking_jurusan: hasil.ranking_jurusan, dibuat_pada: hasil.dibuat_pada };
}
