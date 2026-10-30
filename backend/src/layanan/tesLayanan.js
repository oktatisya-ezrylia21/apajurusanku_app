// Logika bisnis tes: mengambil soal, memvalidasi jawaban, menghitung & menyimpan hasil.
import { db } from '../konfigurasi/database.js';
import { modelHasilTes } from '../model/hasilTes.js';
import { modelJawaban } from '../model/jawaban.js';
import { modelJurusan } from '../model/jurusan.js';
import { modelSoal } from '../model/soal.js';
import { GalatAplikasi } from '../utilitas/responsStandar.js';
import { buatUlasan, hitungRekomendasiJurusan, hitungSkorPerTipe } from './hitungHasilTes.js';

/** Semua soal terurut (dikirim ke siswa untuk dikerjakan). */
export const ambilSemuaSoal = () => modelSoal.semua();

/**
 * Memeriksa jawaban siswa: harus menjawab SEMUA soal, tiap soal sekali, dan tipe yang dipilih
 * harus salah satu dari dua pilihan soal tersebut (mencegah data jawaban dipalsukan).
 * @returns {{soal_id: number, tipe: string}[]} jawaban yang sudah bersih
 */
export function validasiJawaban(jawaban, daftarSoal) {
  if (!Array.isArray(jawaban)) throw new GalatAplikasi('Format jawaban tidak valid', 422);
  if (jawaban.length !== daftarSoal.length) {
    throw new GalatAplikasi(`Semua ${daftarSoal.length} soal harus dijawab`, 422);
  }

  const soalByIdSoal = new Map(daftarSoal.map((s) => [s.id, s]));
  const sudahDijawab = new Set();

  return jawaban.map((item) => {
    const soal = soalByIdSoal.get(Number(item?.soal_id));
    if (!soal) throw new GalatAplikasi('Ada soal yang tidak dikenali', 422);
    if (sudahDijawab.has(soal.id)) throw new GalatAplikasi('Ada soal yang dijawab ganda', 422);
    if (item.tipe !== soal.tipe_a && item.tipe !== soal.tipe_b) throw new GalatAplikasi('Pilihan jawaban tidak sesuai soal', 422);
    sudahDijawab.add(soal.id);
    return { soal_id: soal.id, tipe: item.tipe };
  });
}

/**
 * Alur utama saat siswa menyelesaikan tes:
 * validasi → hitung ranking → simpan hasil & jawaban (satu transaksi) → kembalikan hasil.
 */
export function prosesDanSimpanHasil(siswaId, jawabanMentah) {
  const jawaban = validasiJawaban(jawabanMentah, modelSoal.semua());
  const daftarTipe = jawaban.map((j) => j.tipe);

  const skorTipe = hitungSkorPerTipe(daftarTipe);
  const rankingJurusan = hitungRekomendasiJurusan(daftarTipe, modelJurusan.semua());

  // Transaksi: hasil dan jawaban tersimpan bersama, atau tidak sama sekali.
  const simpan = db.transaction(() => {
    const hasilTesId = modelHasilTes.simpan({ siswaId, skorTipe, rankingJurusan });
    modelJawaban.simpanBanyak(hasilTesId, jawaban);
    return hasilTesId;
  });

  return { id: simpan(), skor_tipe: skorTipe, ranking_jurusan: rankingJurusan, ulasan: buatUlasan(rankingJurusan[0]) };
}

/** Hasil tes terbaru milik siswa (null bila belum pernah tes). */
export function ambilHasilTerakhir(siswaId) {
  const hasil = modelHasilTes.terakhirBySiswa(siswaId);
  return hasil ? { ...hasil, ulasan: buatUlasan(hasil.ranking_jurusan[0]) } : null;
}

/** Detail satu jurusan untuk halaman detail. */
export function ambilDetailJurusan(kode) {
  const jurusan = modelJurusan.cariByKunci(kode.toUpperCase());
  if (!jurusan) throw new GalatAplikasi('Jurusan tidak ditemukan', 404);
  return jurusan;
}
