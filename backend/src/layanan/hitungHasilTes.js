// Logika bisnis inti: mengubah jawaban tes menjadi ranking jurusan.
// Fungsi di file ini MURNI (tidak menyentuh database) sehingga mudah diuji.
import { JUMLAH_JURUSAN_REKOMENDASI, TIPE_RIASEC } from '../konfigurasi/kontenAplikasi.js';

/** Tipe pertama pada kode_riasec jurusan bernilai lebih besar (tipe utama). */
export const BOBOT_TIPE_UTAMA = 2;
export const BOBOT_TIPE_PENDUKUNG = 1;
/** Jurusan teratas diberi persen 95% (bukan 100%) agar tidak terkesan "pasti cocok". */
export const PERSEN_TERTINGGI = 95;

/**
 * Menghitung berapa kali tiap tipe RIASEC dipilih.
 * @param {string[]} daftarTipe contoh: ['R','I','R','A', ...]
 * @returns {Record<string, number>} contoh: { R: 8, I: 6, A: 4, S: 3, E: 2, C: 1 }
 */
export function hitungSkorPerTipe(daftarTipe) {
  const skor = Object.fromEntries(Object.keys(TIPE_RIASEC).map((tipe) => [tipe, 0]));
  daftarTipe.forEach((tipe) => {
    if (tipe in skor) skor[tipe] += 1;
  });
  return skor;
}

/**
 * Menghitung skor tiap jurusan dari skor tipe, lalu mengurutkannya dari yang paling cocok.
 * Rumus: skor jurusan = Σ (skor tipe × bobot), bobot 2 untuk tipe utama dan 1 untuk tipe pendukung.
 * @returns {{kode: string, nama: string, persen: number}[]} ranking (maksimal `jumlah` jurusan)
 */
export function hitungRekomendasiJurusan(daftarTipe, daftarJurusan, jumlah = JUMLAH_JURUSAN_REKOMENDASI) {
  const skorTipe = hitungSkorPerTipe(daftarTipe);

  const jurusanBerskor = daftarJurusan.map((jurusan) => {
    // "I, R" → ['I', 'R']
    const tipeJurusan = jurusan.kode_riasec.split(',').map((t) => t.trim()[0]);
    const skor = tipeJurusan.reduce((total, tipe, urutan) => {
      const bobot = urutan === 0 ? BOBOT_TIPE_UTAMA : BOBOT_TIPE_PENDUKUNG;
      return total + (skorTipe[tipe] ?? 0) * bobot;
    }, 0);
    return { kode: jurusan.kode, nama: jurusan.nama, skor };
  });

  jurusanBerskor.sort((a, b) => b.skor - a.skor);

  // Skor tertinggi dijadikan patokan 95%; Math.max(1, …) mencegah pembagian dengan nol.
  const skorTertinggi = Math.max(1, jurusanBerskor[0]?.skor ?? 1);
  return jurusanBerskor.slice(0, jumlah).map(({ kode, nama, skor }) => ({
    kode, nama, persen: Math.round((PERSEN_TERTINGGI * skor) / skorTertinggi),
  }));
}

/** Membuat kalimat ulasan singkat untuk jurusan teratas. */
export function buatUlasan(jurusanTeratas) {
  if (!jurusanTeratas) return 'Belum ada hasil untuk ditampilkan.';
  return `Kamu cenderung menyukai kegiatan yang sejalan dengan jurusan ${jurusanTeratas.nama}. `
    + 'Pilih salah satu jurusan di bawah untuk melihat detail.';
}
