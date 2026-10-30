// Landing page: pilih peran (siswa / guru / admin).
import { siapkanKerangka } from '../../inti/init.js';
import { $ } from '../../inti/util.js';

siapkanKerangka();

/** HTML satu kartu peran. */
const kartuPeran = ({ gambar, alt, nama, deskripsi, href, latar }) => `
  <a class="kartu-peran" href="${href}">
    <div class="ilustrasi" style="background:${latar}"><img src="${gambar}" alt="${alt}" width="253" height="320" loading="lazy" decoding="async"></div>
    <div class="teks-kartu"><b>${nama}</b><span>${deskripsi}</span></div>
  </a>`;

const DAFTAR_PERAN = [
  { gambar: '/aset/gambar/landing/maskot-siswa.png', alt: 'Maskot Gardaratama sedang membaca buku untuk peran siswa', nama: 'Siswa', deskripsi: 'Kerjakan tes minat dan lihat rekomendasi jurusan.', href: '/siswa.html', latar: 'linear-gradient(#a8dcf5,#d9f0b8)' },
  { gambar: '/aset/gambar/landing/maskot-guru.png', alt: 'Maskot Gardaratama menunjukkan buku pelajaran untuk peran guru', nama: 'Guru', deskripsi: 'Pantau hasil tes siswa dan cetak laporan.', href: '/guru.html', latar: 'linear-gradient(#ffe9a8,#ffd170)' },
  { gambar: '/aset/gambar/landing/maskot-admin.png', alt: 'Maskot Gardaratama bekerja di meja untuk peran admin', nama: 'Admin', deskripsi: 'Kelola siswa, soal, jurusan, sekolah, dan guru.', href: '/admin.html', latar: 'linear-gradient(#b7e8dc,#7fcdbf)' },
];

$('app').innerHTML = `
  <section class="hero">
    <small>apajurusanku</small>
    <h1>Jurusan SMK<br>yang pas</h1>
    <p>Temukan jurusan SMK yang cocok, lengkap dengan sekolah terdekat dan favorit lintas kota. Pilih perannya untuk mulai.</p>
    <div class="baris-tombol">
      <a class="tombol tombol-kuning" href="/siswa.html">Mulai sebagai siswa</a>
      <a class="tombol tombol-garis" href="#peran">▶ Lihat peran</a>
    </div>
  </section>
  <h2 id="peran">Pilih peran</h2>
  <div class="grid-peran">${DAFTAR_PERAN.map(kartuPeran).join('')}</div>
  <h2>Cara kerja</h2>
  <div class="grid-langkah">
    <div class="langkah-cara"><b>1. Masuk</b><br>Isi nama dan NISN.</div>
    <div class="langkah-cara"><b>2. Jawab soal</b><br>Pilih kegiatan yang paling kamu suka.</div>
    <div class="langkah-cara"><b>3. Lihat hasil</b><br>Dapatkan jurusan dan sekolah terdekat.</div>
  </div>`;
