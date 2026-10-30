// Skema validasi untuk endpoint login/masuk.
export const SKEMA_MASUK_SISWA = {
  nama: { label: 'Nama', wajib: true, maks: 100 },
  nisn: { label: 'NISN', wajib: true, tipe: 'nisn' },
  sekolah_asal: { label: 'Sekolah asal', maks: 150 },
};

export const SKEMA_MASUK_GURU = {
  nama: { label: 'Nama', wajib: true, maks: 100 },
  email: { label: 'Email', wajib: true, tipe: 'email' },
  sekolah_asal: { label: 'Sekolah', wajib: true, maks: 150 },
};

export const SKEMA_MASUK_ADMIN = {
  username: { label: 'Username', wajib: true, maks: 50 },
  kata_sandi: { label: 'Kata sandi', wajib: true, maks: 100 },
};
