// Menyiapkan kerangka yang sama di semua halaman: navbar + penutupan modal.
import { tutupModal } from '../komponen/modal.js';
import { $ } from './util.js';

const MENU = [
  { peran: 'beranda', href: '/', label: 'Beranda' },
  { peran: 'siswa', href: '/siswa.html', label: 'Siswa' },
  { peran: 'guru', href: '/guru.html', label: 'Guru' },
  { peran: 'admin', href: '/admin.html', label: 'Admin' },
];

/** Menggambar navbar; peran aktif diambil dari atribut <body data-peran="..."> */
export function siapkanKerangka() {
  const peranAktif = document.body.dataset.peran;
  $('navigasi').innerHTML = `
    <a class="merek" href="/"><img class="logo-merek" src="/aset/gambar/landing/maskot-merek.png" alt="" width="79" height="96"> apajurusanku</a>
    <div class="menu-nav">${MENU.map((m) => `<a href="${m.href}" class="${m.peran === peranAktif ? 'aktif' : ''}">${m.label}</a>`).join('')}</div>
    <a class="tombol tombol-kuning" href="/">Pilih peran</a>`;

  // Klik latar gelap modal atau tekan Esc untuk menutup.
  $('modal').addEventListener('click', (k) => { if (k.target === $('modal')) tutupModal(); });
  document.addEventListener('keydown', (k) => { if (k.key === 'Escape') tutupModal(); });
}
