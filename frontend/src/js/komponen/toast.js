// Notifikasi singkat di bawah layar (hilang sendiri setelah 2,5 detik).
import { $ } from '../inti/util.js';

let pewaktu;

export function tampilkanToast(pesan) {
  const elemen = $('toast');
  elemen.textContent = pesan;
  elemen.classList.add('tampil');
  clearTimeout(pewaktu);
  pewaktu = setTimeout(() => elemen.classList.remove('tampil'), 2500);
}
