// Langkah pengerjaan soal: satu soal per layar dengan dua kartu pilihan.
import { pindah, renderUlang } from '../../inti/router.js';
import { simpanSesi, hapusSesi } from '../../inti/state.js';
import { esc } from '../../inti/util.js';
import { tampilkanToast } from '../../komponen/toast.js';
import { ambilKonten, ambilSoal, kirimJawaban } from '../../layanan/tesLayanan.js';
import { stateSiswa } from './stateSiswa.js';

/** HTML satu kartu pilihan: gambar maskot; bila gambar kosong/gagal dimuat, tampil nama tipe (teks, tanpa emoji). */
function kartuPilihan({ tipe, teks, gambar }, tipeRiasec) {
  const namaTipe = tipeRiasec[tipe]?.nama ?? tipe;
  const isiMaskot = gambar
    ? `<img src="${esc(gambar)}" alt="" width="240" height="240" decoding="async" data-maskot="${esc(namaTipe)}">`
    : `<span class="maskot-teks">${esc(namaTipe)}</span>`;
  return `<button class="kartu-pilihan" data-aksi="pilihJawaban" data-tipe="${esc(tipe)}">
    <span class="maskot" style="display:grid">${isiMaskot}</span>${esc(teks)}</button>`;
}

// Gambar gagal dimuat (file hilang / koneksi putus) → ganti dengan teks nama tipe agar kartu tetap bisa dipilih.
document.addEventListener('error', (k) => {
  const gambar = k.target;
  if (!(gambar instanceof HTMLImageElement) || !gambar.dataset.maskot) return;
  console.warn('Gambar maskot gagal dimuat:', gambar.getAttribute('src'));
  const teks = document.createElement('span');
  teks.className = 'maskot-teks';
  teks.textContent = gambar.dataset.maskot;
  gambar.replaceWith(teks);
}, true);

/** Memuat gambar soal berikutnya di latar belakang agar perpindahan soal terasa instan. */
function muatDuluGambar(soal) {
  [soal?.gambar_a, soal?.gambar_b].filter(Boolean).forEach((jalur) => { new Image().src = jalur; });
}

export async function langkahSoal() {
  const konten = await ambilKonten();
  if (stateSiswa.soal.length === 0) stateSiswa.soal = await ambilSoal();

  const total = stateSiswa.soal.length;
  const soal = stateSiswa.soal[stateSiswa.indeksSoal];
  if (!soal) { pindah('ins'); return ''; }

  muatDuluGambar(stateSiswa.soal[stateSiswa.indeksSoal + 1]);
  const persen = ((stateSiswa.indeksSoal + 1) / total) * 100;
  return `<div class="panel panel-soal">
    <div class="baris-atas">
      <b>Soal ${stateSiswa.indeksSoal + 1} dari ${total}</b>
      <button class="tombol-mini kuning" data-aksi="soalSebelumnya">Kembali</button>
    </div>
    <div class="progres"><i style="width:${persen}%"></i></div>
    <div class="kotak-soal">${esc(soal.pertanyaan)}</div>
    <div class="pilihan-soal">
      ${kartuPilihan({ tipe: soal.tipe_a, teks: soal.teks_a, gambar: soal.gambar_a }, konten.tipe_riasec)}
      ${kartuPilihan({ tipe: soal.tipe_b, teks: soal.teks_b, gambar: soal.gambar_b }, konten.tipe_riasec)}
    </div></div>`;
}

export const aksiSoal = {
  /** Menyimpan jawaban; lanjut ke soal berikutnya, atau kirim ke server bila sudah soal terakhir. */
  async pilihJawaban({ tipe }) {
    const total = stateSiswa.soal.length;
    stateSiswa.jawaban[stateSiswa.indeksSoal] = tipe;
    simpanSesi('jawaban', stateSiswa.jawaban); // progres tersimpan

    if (stateSiswa.indeksSoal < total - 1) {
      stateSiswa.indeksSoal += 1;
      return renderUlang();
    }

    // Soal terakhir: kirim semua jawaban beserta id soalnya.
    try {
      const jawaban = stateSiswa.soal.map((s, i) => ({ soal_id: s.id, tipe: stateSiswa.jawaban[i] }));
      stateSiswa.hasil = await kirimJawaban(jawaban);
      stateSiswa.jawaban = [];
      hapusSesi('jawaban');
      return pindah('hasil');
    } catch (g) {
      return tampilkanToast(g.message);
    }
  },

  soalSebelumnya() {
    if (stateSiswa.indeksSoal > 0) { stateSiswa.indeksSoal -= 1; renderUlang(); } else pindah('ins');
  },
};
