// Langkah "instruksi pengerjaan" sebelum tes dimulai.
import { pindah } from '../../inti/router.js';
import { tampilkanToast } from '../../komponen/toast.js';
import { ambilSoal } from '../../layanan/tesLayanan.js';
import { stateSiswa } from './stateSiswa.js';

export async function langkahInstruksi() {
  stateSiswa.soal = await ambilSoal();
  const total = stateSiswa.soal.length;
  const sudah = stateSiswa.jawaban.filter(Boolean).length;
  return `<div class="panel panel-sempit">
    <h3>Instruksi pengerjaan</h3>
    <div class="item-daftar">✓ Terdiri dari ${total} soal, pilih jawaban yang paling sesuai dengan dirimu</div>
    <div class="item-daftar">♥ Tidak ada jawaban benar atau salah</div>
    <div class="item-daftar">✎ Progres tersimpan, bisa kembali ke soal sebelumnya</div>
    <button class="tombol tombol-kuning tombol-penuh" data-aksi="mulaiTes">${sudah > 0 && sudah < total ? `Lanjutkan soal ${sudah + 1}` : 'Ayo mulai'}</button>
  </div>`;
}

export const aksiInstruksi = {
  /** Mulai dari soal pertama yang belum dijawab (atau dari awal bila sudah lengkap). */
  mulaiTes() {
    if (stateSiswa.soal.length === 0) return tampilkanToast('Soal belum tersedia. Hubungi admin.');
    const belumDijawab = stateSiswa.soal.findIndex((_, i) => !stateSiswa.jawaban[i]);
    stateSiswa.indeksSoal = belumDijawab === -1 ? 0 : belumDijawab;
    pindah('soal');
  },
};
