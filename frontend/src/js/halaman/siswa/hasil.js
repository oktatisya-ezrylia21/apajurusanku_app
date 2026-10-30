// Langkah hasil tes, detail jurusan, dan laporan cetak.
import { pindah, renderUlang } from '../../inti/router.js';
import { hapusSesi } from '../../inti/state.js';
import { esc } from '../../inti/util.js';
import { urlCariSekolahTerdekat } from '../../komponen/googleMaps.js';
import { htmlLaporan } from '../../komponen/laporanCetak.js';
import { tampilkanToast } from '../../komponen/toast.js';
import { penggunaSaatIni } from '../../layanan/authLayanan.js';
import { ambilDetailJurusan, ambilHasilTerakhir, ambilKonten } from '../../layanan/tesLayanan.js';
import { stateSiswa } from './stateSiswa.js';

/** Memastikan hasil tes tersedia (dari memori atau dari server bila halaman dimuat ulang). */
async function pastikanHasil() {
  if (!stateSiswa.hasil) stateSiswa.hasil = await ambilHasilTerakhir();
  if (!stateSiswa.hasil) {
    tampilkanToast('Kamu belum mengerjakan tes');
    pindah('ins');
    return null;
  }
  return stateSiswa.hasil;
}

/** Lingkaran persentase memakai conic-gradient. */
const cincinPersen = (persen) =>
  `<div class="cincin" style="background:conic-gradient(var(--matahari) ${persen}%,rgba(255,255,255,.3) 0)"><b>${persen}%</b></div>`;

export async function langkahHasil() {
  const hasil = await pastikanHasil();
  if (!hasil) return '';
  const [teratas] = hasil.ranking_jurusan;

  return `<div class="panel panel-sempit panel-lebar">
    <p>Hai ${esc(penggunaSaatIni()?.nama)}, ini hasilmu</p>
    <div class="kotak-hasil">${cincinPersen(teratas.persen)}
      <div><small>Rank 1 untukmu</small><br><b style="font-size:22px">${esc(teratas.nama)}</b></div></div>
    <b>Ulasan singkat</b><p>${esc(hasil.ulasan)}</p>
    <b>Top ${hasil.ranking_jurusan.length} Jurusan untukmu</b>
    <div class="grid-chip" style="margin-top:10px">
      ${hasil.ranking_jurusan.map((j, i) => `<button class="chip" data-aksi="lihatDetail" data-kode="${esc(j.kode)}"><span class="nomor">${i + 1}</span>${esc(j.nama)}</button>`).join('')}
    </div>
    <div class="baris-tombol">
      <a class="tombol tombol-kuning tombol-penuh" href="${esc(urlCariSekolahTerdekat(teratas.nama))}" target="_blank" rel="noopener noreferrer">⚲ Lihat sekolah terdekat</a>
      <button class="tombol tombol-garis tombol-penuh" data-aksi="menujuLaporan">Cetak hasil</button>
    </div>
    <button class="tombol-kembali" style="margin-top:12px" data-aksi="ulangiTes">Ulangi tes</button>
  </div>`;
}

export async function langkahDetail() {
  const kode = stateSiswa.kodeJurusan;
  if (!kode) { pindah('hasil'); return ''; }
  const konten = await ambilKonten();
  if (!stateSiswa.detailJurusan[kode]) stateSiswa.detailJurusan[kode] = await ambilDetailJurusan(kode);
  const j = stateSiswa.detailJurusan[kode];

  const ceklis = konten.langkah_selanjutnya.map((teks, i) => `
    <button class="item-daftar ${stateSiswa.ceklis[i] ? 'selesai' : ''}" data-aksi="centangLangkah" data-indeks="${i}">
      <span>${esc(teks)}</span><span>${stateSiswa.ceklis[i] ? '✓' : '○'}</span></button>`).join('');

  return `<div class="panel panel-sempit panel-lebar">
    <a class="tombol-kembali" href="#hasil">← Kembali ke hasil</a>
    <h3>${esc(j.nama)}</h3><p>${esc(j.deskripsi)}</p>
    <div class="item-daftar blok"><b>Pembelajaran</b><br>${esc(j.pembelajaran)}</div>
    <div class="item-daftar blok"><b>Prospek kerja</b><br>${esc(j.prospek_kerja)}</div>
    <div class="item-daftar blok"><b>Lanjut kuliah</b><br>${esc(j.lanjut_kuliah)}</div>
    <a class="tombol tombol-kuning tombol-penuh" href="${esc(urlCariSekolahTerdekat(j.nama))}" target="_blank" rel="noopener noreferrer">⚲ Lihat sekolah terdekat</a>
    <h2 style="font-size:20px">Langkah selanjutnya</h2>${ceklis}
    <button class="tombol tombol-garis tombol-penuh" data-aksi="menujuLaporan">Cetak hasil</button>
  </div>`;
}

export async function langkahLaporan() {
  const hasil = await pastikanHasil();
  if (!hasil) return '';
  return htmlLaporan({
    nama: penggunaSaatIni()?.nama ?? '',
    baris: hasil.ranking_jurusan.map((j) => ({ label: j.nama, persen: j.persen })),
    aksiKembali: 'kembaliKeHasil',
  });
}

export const aksiHasil = {
  lihatDetail({ kode }) { stateSiswa.kodeJurusan = kode; pindah('detail'); },
  centangLangkah({ indeks }) { stateSiswa.ceklis[indeks] = !stateSiswa.ceklis[indeks]; renderUlang(); },
  menujuLaporan() { pindah('lap'); },
  kembaliKeHasil() { pindah('hasil'); },
  /** Mengosongkan jawaban lama lalu mengulang dari instruksi. */
  ulangiTes() {
    stateSiswa.jawaban = [];
    stateSiswa.indeksSoal = 0;
    hapusSesi('jawaban');
    pindah('ins');
  },
};
