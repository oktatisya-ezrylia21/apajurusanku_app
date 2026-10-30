// Langkah dashboard guru (daftar siswa yang sudah tes) dan detail hasil satu siswa.
import { pindah } from '../../inti/router.js';
import { $, esc, tundaKetik } from '../../inti/util.js';
import { tampilkanToast } from '../../komponen/toast.js';
import { ambilDashboard, ambilDetailSiswa } from '../../layanan/guruLayanan.js';
import { stateGuru } from './stateGuru.js';

/** Daftar siswa (bagian yang diperbarui saat mengetik di kolom cari). */
const htmlDaftarSiswa = (daftar) => daftar.map((s) => `
  <button class="item-daftar" data-aksi="lihatSiswa" data-id="${esc(s.id)}">${esc(s.nama)}
    <span class="lencana">${esc(s.jurusan_teratas)}</span></button>`).join('') || '<p>Siswa tidak ditemukan.</p>';

export async function langkahDashboard() {
  stateGuru.idSiswa = null;
  const r = await ambilDashboard(stateGuru.cari);
  stateGuru.ringkasan = r;
  return `<div class="panel panel-sempit">
    <div class="baris-atas"><h3 style="margin:0">Halo, ${esc(r.guru.nama.split(',')[0])} 👋</h3>
      <button class="tombol-mini kuning" data-aksi="keluar">Keluar</button></div>
    <p style="margin:4px 0 12px">${esc(r.guru.sekolah_asal)}</p>
    <div class="kotak-statistik">
      <div class="statistik"><b>${r.total_sudah_tes}</b>Sudah tes</div>
      <div class="statistik"><b>${r.total_terdaftar}</b>Terdaftar</div>
    </div>
    <input id="cari-siswa" placeholder="Cari siswa" value="${esc(stateGuru.cari)}" data-input="cariSiswa" style="margin-top:12px">
    <div id="daftar-siswa">${htmlDaftarSiswa(r.daftar_siswa)}</div>
    <button class="tombol tombol-kuning tombol-penuh" data-aksi="laporanSemua">Cetak hasil siswa</button>
  </div>`;
}

export async function langkahDetailSiswa() {
  if (!stateGuru.idSiswa) { pindah('dash'); return ''; }
  const d = await ambilDetailSiswa(stateGuru.idSiswa);
  stateGuru.detail = d;
  return `<div class="panel panel-sempit">
    <a class="tombol-kembali" href="#dash">← Kembali</a>
    <h3>${esc(d.siswa.nama)}</h3><p>Rekomendasi jurusan:</p>
    ${d.ranking_jurusan.map((j, i) => `<div class="item-daftar"><span>${i + 1}. ${esc(j.nama)}</span><span class="lencana">${esc(j.persen)}%</span></div>`).join('')}
    <button class="tombol tombol-kuning tombol-penuh" data-aksi="laporanSiswa">Cetak hasil siswa</button>
  </div>`;
}

// Pencarian dengan jeda 300 ms: hanya bagian daftar yang digambar ulang (kolom cari tetap fokus).
const cariSambilMengetik = tundaKetik(async (kataKunci) => {
  try {
    stateGuru.cari = kataKunci;
    const r = await ambilDashboard(kataKunci);
    $('daftar-siswa').innerHTML = htmlDaftarSiswa(r.daftar_siswa);
  } catch (g) { tampilkanToast(g.message); }
});

export const aksiDashboard = {
  cariSiswa: (teks) => cariSambilMengetik(teks),
  lihatSiswa({ id }) { stateGuru.idSiswa = Number(id); pindah('sd'); },
  laporanSemua() { stateGuru.idSiswa = null; pindah('lap'); },
  laporanSiswa() { pindah('lap'); },
};
