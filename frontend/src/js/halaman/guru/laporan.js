// Langkah laporan cetak guru: ringkasan semua siswa, atau hasil satu siswa.
import { pindah } from '../../inti/router.js';
import { htmlLaporan } from '../../komponen/laporanCetak.js';
import { ambilDashboard, ambilDetailSiswa } from '../../layanan/guruLayanan.js';
import { stateGuru } from './stateGuru.js';

export async function langkahLaporan() {
  // Laporan satu siswa: daftar ranking jurusannya.
  if (stateGuru.idSiswa) {
    const d = await ambilDetailSiswa(stateGuru.idSiswa);
    return htmlLaporan({
      nama: d.siswa.nama,
      baris: d.ranking_jurusan.map((j) => ({ label: j.nama, persen: j.persen })),
      aksiKembali: 'kembaliKeDetail',
    });
  }
  // Ringkasan semua siswa: satu baris per siswa → jurusan teratasnya.
  const r = await ambilDashboard('');
  return htmlLaporan({
    nama: `Semua siswa · ${r.guru.sekolah_asal}`,
    baris: r.daftar_siswa.map((s) => ({ label: `${s.nama} → ${s.jurusan_teratas}`, persen: s.persen_teratas })),
    aksiKembali: 'kembaliKeDashboard',
  });

  
}

export const aksiLaporan = {
  kembaliKeDetail() { pindah('sd'); },
  kembaliKeDashboard() { pindah('dash'); },
};
