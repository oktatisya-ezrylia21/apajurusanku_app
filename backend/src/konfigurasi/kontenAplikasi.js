// ============================================================================
// KONTEN APLIKASI YANG SERING DIUBAH (selain soal, jurusan, dan sekolah)
// Soal / jurusan / sekolah ada di folder: src/basisdata/benih/
// File ini dikirim ke frontend lewat GET /api/tes/konten, jadi cukup ubah di sini.
// ============================================================================

// Tipe kepribadian RIASEC beserta nama (kartu soal memakai gambar maskot, tanpa emoji).
export const TIPE_RIASEC = {
  R: { nama: 'Teknik' },
  I: { nama: 'Teknologi' },
  A: { nama: 'Seni' },
  S: { nama: 'Sosial' },
  E: { nama: 'Bisnis' },
  C: { nama: 'Administrasi' },
};

// Daftar "Langkah selanjutnya" pada halaman detail jurusan.
export const LANGKAH_SELANJUTNYA = [
  'Gali informasi jurusan',
  'Pelajari prospek kerja dan kuliah',
  'Tinjau fasilitas sekolah',
  'Hitung perkiraan biaya praktik',
  'Diskusikan dengan orang tua dan guru',
];

// Pilihan radius pencarian sekolah (km). null = tanpa batas (satu provinsi).
export const PILIHAN_RADIUS = [
  { label: '10 km', nilai: 10 },
  { label: '25 km', nilai: 25 },
  { label: '50 km', nilai: 50 },
  { label: 'Provinsi', nilai: null },
];

// Titik pusat pencarian bila siswa tidak mengizinkan akses lokasi (contoh: pusat Kota Bandung).
export const LOKASI_BAWAAN = { latitude: -6.9175, longitude: 107.6191, keterangan: 'Pusat Kota Bandung' };

// Berapa jurusan teratas yang ditampilkan pada hasil tes.
export const JUMLAH_JURUSAN_REKOMENDASI = 6;
