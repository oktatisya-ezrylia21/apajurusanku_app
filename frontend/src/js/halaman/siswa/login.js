// Langkah "login" untuk siswa.
import { pindah } from '../../inti/router.js';
import { esc, nilaiInput } from '../../inti/util.js';
import { tampilkanToast } from '../../komponen/toast.js';
import * as authLayanan from '../../layanan/authLayanan.js';
import { ambilKonten } from '../../layanan/tesLayanan.js';
import { validasiLoginSiswa } from '../../validasi/form.js';
import { stateSiswa } from './stateSiswa.js';

/** Form masuk: nama + NISN (+ sekolah asal opsional dengan saran dari daftar sekolah). */
export async function langkahLogin() {
  const konten = await ambilKonten();
  const { nama, nisn, sekolah } = stateSiswa.isianLogin;
  return `<div class="panel panel-sempit">
    <h3>Masuk dulu, yuk</h3>
    <label for="nama">Nama lengkap</label>
    <input id="nama" value="${esc(nama)}" placeholder="Budi Santoso" autocomplete="name">
    <label for="nisn">NISN (10 digit)</label>
    <input id="nisn" value="${esc(nisn)}" placeholder="0012345678" inputmode="numeric" maxlength="10">
    <label for="sekolah">Sekolah asal (opsional)</label>
    <input id="sekolah" list="daftar-sekolah" value="${esc(sekolah)}" placeholder="Ketik untuk mencari sekolahmu">
    <datalist id="daftar-sekolah">${konten.sekolah_asal.map((s) => `<option value="${esc(s)}">`).join('')}</datalist>
    <button class="tombol tombol-teal tombol-penuh" data-aksi="masuk">Masuk</button>
    <p class="petunjuk">Lupa NISN? <a href="https://nisn.data.kemendikdasmen.go.id/" target="_blank" rel="noopener noreferrer">Cek NISN di situs resmi</a> (butuh nama lengkap dan tempat lahir).</p>
  </div>`;
}

export const aksiLogin = {
  /** Validasi → panggil API login → lanjut ke instruksi. */
  async masuk() {
    const isian = {
      nama: nilaiInput('nama').trim(),
      nisn: nilaiInput('nisn').replace(/\D/g, ''),
      sekolah: nilaiInput('sekolah').trim(),
    };
    stateSiswa.isianLogin = isian;
    const galat = validasiLoginSiswa(isian);
    if (galat) return tampilkanToast(galat);

    try {
      await authLayanan.masukSiswa({ nama: isian.nama, nisn: isian.nisn, sekolah_asal: isian.sekolah || undefined });
      pindah('ins');
    } catch (g) { tampilkanToast(g.message); }
  },
};
