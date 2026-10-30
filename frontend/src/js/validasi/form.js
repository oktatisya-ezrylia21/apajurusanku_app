// Validasi form per halaman. Setiap fungsi mengembalikan pesan galat, atau '' bila semua benar.
import { emailValid } from './email.js';
import { nisnValid } from './nisn.js';

export function validasiLoginSiswa({ nama, nisn }) {
  if (!nama.trim()) return 'Nama wajib diisi';
  if (!nisnValid(nisn)) return 'NISN harus 10 digit angka';
  return '';
}

export function validasiFormGuru({ nama, email, sekolah }) {
  if (!nama.trim()) return 'Nama wajib diisi';
  if (!emailValid(email)) return 'Format email salah';
  if (!sekolah.trim()) return 'Nama sekolah wajib diisi';
  return '';
}

export function validasiLoginAdmin({ username, kataSandi }) {
  if (!username.trim() || !kataSandi) return 'Username dan kata sandi wajib diisi';
  return '';
}

/** Memeriksa kolom pertama (wajib) pada form CRUD admin. */
export function validasiKolomWajib(isian, daftarKolomWajib) {
  const kosong = daftarKolomWajib.find(([kolom]) => !String(isian[kolom] ?? '').trim());
  return kosong ? `${kosong[1]} wajib diisi` : '';
}
