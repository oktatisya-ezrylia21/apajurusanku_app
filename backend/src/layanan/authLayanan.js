// Logika bisnis autentikasi untuk tiga peran: siswa, guru, dan admin.
import { modelAdmin } from '../model/admin.js';
import { modelGuru } from '../model/guru.js';
import { modelSekolahAsal } from '../model/sekolahAsal.js';
import { modelSiswa } from '../model/siswa.js';
import { buatToken, cocokkanKataSandi } from '../utilitas/enkripsi.js';
import { GalatAplikasi } from '../utilitas/responsStandar.js';

/**
 * Siswa masuk dengan nama + NISN. NISN yang belum ada otomatis didaftarkan.
 * Bila NISN sudah terdaftar, data yang tersimpan di database yang dipakai (nama dari admin tidak ditimpa).
 */
export function masukSebagaiSiswa({ nama, nisn, sekolah_asal: sekolahAsal }) {
  let siswa = modelSiswa.cariByNisn(nisn);
  if (!siswa) {
    siswa = modelSiswa.tambah({ nisn, nama, sekolah_asal: sekolahAsal });
  } else if (siswa.nama.trim().toLowerCase() !== nama.trim().toLowerCase()) {
    throw new GalatAplikasi('NISN sudah terdaftar atas nama lain', 409);
}
  const token = buatToken({ id: siswa.id, peran: 'siswa', nama: siswa.nama });
  return { token, pengguna: { id: siswa.id, nama: siswa.nama, nisn: siswa.nisn, peran: 'siswa' } };
}

/** Fitur "Lupa NISN": mencari NISN dari nama lengkap (harus sama persis). */
export function cekNisn(nama) {
  return modelSiswa.cariByNamaPersis(nama.trim());
}

/**
 * Guru masuk dengan nama, email, dan sekolah. Sekolah harus ada di daftar sekolah asal
 * (admin yang mengelola). Guru baru otomatis didaftarkan berdasarkan email.
 */
export function masukSebagaiGuru({ nama, email, sekolah_asal: sekolahAsal }) {
  const sekolah = modelSekolahAsal.cariByNama(sekolahAsal);
  if (!sekolah) throw new GalatAplikasi('Sekolah belum terdaftar', 404);

  let guru = modelGuru.cariByEmail(email);
  if (!guru) guru = modelGuru.tambah({ nama, email, sekolah_asal: sekolah.nama });

  const token = buatToken({ id: guru.id, peran: 'guru', nama: guru.nama });
  return { token, pengguna: { id: guru.id, nama: guru.nama, email: guru.email, sekolah_asal: guru.sekolah_asal, peran: 'guru' } };
}

/** Admin masuk dengan username + kata sandi (dicocokkan dengan hash bcrypt). */
export function masukSebagaiAdmin({ username, kata_sandi: kataSandi }) {
  const admin = modelAdmin.cariByUsername(username);
  // Pesan sengaja sama untuk "username salah" dan "kata sandi salah" agar tidak membocorkan akun mana yang ada.
  if (!admin || !cocokkanKataSandi(kataSandi, admin.kata_sandi_hash)) {
    throw new GalatAplikasi('Username atau kata sandi salah', 401);
  }
  const token = buatToken({ id: admin.id, peran: 'admin', nama: admin.username });
  return { token, pengguna: { id: admin.id, nama: admin.username, peran: 'admin' } };
}
