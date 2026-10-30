// Layanan autentikasi: masuk, keluar, dan membaca pengguna yang sedang login.
import { ambilSesi, hapusSesi, simpanSesi } from '../inti/state.js';
import { panggilApi } from './apiKlien.js';

/** Menyimpan token + data pengguna dari respons login. */
function simpanSesiLogin({ token, pengguna }) {
  simpanSesi('token', token);
  simpanSesi('pengguna', pengguna);
  return pengguna;
}

export const masukSiswa = async (data) => simpanSesiLogin(await panggilApi('/auth/siswa', { metode: 'POST', body: data }));
export const masukGuru = async (data) => simpanSesiLogin(await panggilApi('/auth/guru', { metode: 'POST', body: data }));
export const masukAdmin = async (data) => simpanSesiLogin(await panggilApi('/auth/admin', { metode: 'POST', body: data }));

/** Fitur "Lupa NISN": cari NISN dari nama lengkap. */
export const cekNisn = (nama) => panggilApi('/auth/cek-nisn', { parameter: { nama } });

export function keluar() {
  hapusSesi('token');
  hapusSesi('pengguna');
  hapusSesi('jawaban');
}

export const penggunaSaatIni = () => ambilSesi('pengguna');

/** true bila ada token dan perannya sesuai (siswa/guru/admin). */
export const sudahMasukSebagai = (peran) => Boolean(ambilSesi('token')) && penggunaSaatIni()?.peran === peran;
