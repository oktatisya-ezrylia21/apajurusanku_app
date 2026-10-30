// Langkah login admin.
import { pindah } from '../../inti/router.js';
import { nilaiInput } from '../../inti/util.js';
import { tampilkanToast } from '../../komponen/toast.js';
import * as authLayanan from '../../layanan/authLayanan.js';
import { validasiLoginAdmin } from '../../validasi/form.js';

export const langkahLogin = () => `<div class="panel panel-sempit">
  <h3>Masuk Admin</h3>
  <label for="username">Username</label><input id="username" autocomplete="username">
  <label for="kata-sandi">Kata sandi</label><input id="kata-sandi" type="password" autocomplete="current-password">
  <button class="tombol tombol-teal tombol-penuh" data-aksi="masukAdmin">Masuk</button>
</div>`;

export const aksiLogin = {
  async masukAdmin() {
    const isian = { username: nilaiInput('username'), kataSandi: nilaiInput('kata-sandi') };
    const galat = validasiLoginAdmin(isian);
    if (galat) return tampilkanToast(galat);
    try {
      await authLayanan.masukAdmin({ username: isian.username.trim(), kata_sandi: isian.kataSandi });
      return pindah('dash');
    } catch (g) { return tampilkanToast(g.message); }
  },
};
