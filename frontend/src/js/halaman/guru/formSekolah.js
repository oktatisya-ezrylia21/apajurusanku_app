// Langkah "form data sekolah": guru mengisi nama, sekolah, dan email lalu masuk ke dashboard.
import { pindah } from '../../inti/router.js';
import { $, esc, nilaiInput } from '../../inti/util.js';
import { tampilkanToast } from '../../komponen/toast.js';
import * as authLayanan from '../../layanan/authLayanan.js';
import { ambilKonten } from '../../layanan/tesLayanan.js';
import { validasiFormGuru } from '../../validasi/form.js';
import { stateGuru } from './stateGuru.js';

export async function langkahForm() {
  const konten = await ambilKonten();
  const { nama, email, sekolah } = stateGuru.isian;
  return `<div class="panel panel-sempit">
    <h3>Data Sekolah</h3>
    <label for="nama">Nama lengkap</label><input id="nama" value="${esc(nama)}" placeholder="Rina Wulandari, S.Pd">
    <label for="sekolah">Nama sekolah</label>
    <input id="sekolah" list="daftar-sekolah" value="${esc(sekolah)}" data-input="cekSekolah" placeholder="Ketik untuk mencari sekolah">
    <datalist id="daftar-sekolah">${konten.sekolah_asal.map((s) => `<option value="${esc(s)}">`).join('')}</datalist>
    <label for="email">Email</label><input id="email" type="email" value="${esc(email)}" placeholder="nama@sekolah.sch.id">
    <div class="item-daftar blok" id="info-sekolah" style="margin-top:14px">Ketik nama sekolah</div>
    <button class="tombol tombol-kuning tombol-penuh" data-aksi="masukGuru">Lanjut ke dashboard</button>
  </div>`;
}

export const aksiForm = {
  /** Memberi tahu guru apakah sekolah yang diketik sudah terdaftar. */
  async cekSekolah(teks) {
    const konten = await ambilKonten();
    const cocok = konten.sekolah_asal.find((s) => s.toLowerCase() === teks.trim().toLowerCase());
    $('info-sekolah').textContent = cocok ? `Sekolah ditemukan: ${cocok}` : (teks.trim() ? 'Sekolah belum terdaftar' : 'Ketik nama sekolah');
  },

  async masukGuru() {
    const isian = { nama: nilaiInput('nama').trim(), email: nilaiInput('email').trim(), sekolah: nilaiInput('sekolah').trim() };
    stateGuru.isian = isian;
    const galat = validasiFormGuru(isian);
    if (galat) return tampilkanToast(galat);
    try {
      await authLayanan.masukGuru({ nama: isian.nama, email: isian.email, sekolah_asal: isian.sekolah });
      return pindah('dash');
    } catch (g) { return tampilkanToast(g.message); }
  },
};
