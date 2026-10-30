// ============================================================================
// DEFINISI TABEL & FORM PANEL ADMIN
// Mau menambah/mengubah kolom yang tampil di tabel atau form? Edit di sini saja.
//   kolomTabel : [namaKolom, judul]
//   kolomForm  : [namaKolom, label, jenisInput?]  jenisInput: teks (bawaan) | angka | tipe | gambar | centang
//   kunci      : kolom kunci utama yang dipakai untuk Edit/Hapus
//   kolomWajib : kolom yang harus diisi (pemeriksaan cepat di browser)
// ============================================================================
export const DEFINISI_SUMBER = {
  jurusan: {
    judul: 'Jurusan', kunci: 'kode',
    kolomTabel: [['kode', 'Kode'], ['nama', 'Jurusan'], ['kode_riasec', 'RIASEC']],
    kolomForm: [['kode', 'Kode (contoh: RPL)'], ['nama', 'Nama jurusan'], ['kode_riasec', 'RIASEC (contoh: I, R)'],
      ['deskripsi', 'Deskripsi singkat'], ['pembelajaran', 'Pembelajaran'], ['prospek_kerja', 'Prospek kerja'], ['lanjut_kuliah', 'Lanjut kuliah']],
    kolomWajib: [['kode', 'Kode'], ['nama', 'Nama jurusan'], ['kode_riasec', 'RIASEC']],
  },
  siswa: {
    judul: 'Siswa', kunci: 'id',
    kolomTabel: [['nisn', 'NISN'], ['nama', 'Nama'], ['sekolah_asal', 'Sekolah']],
    kolomForm: [['nisn', 'NISN (10 digit)'], ['nama', 'Nama lengkap'], ['sekolah_asal', 'Sekolah asal']],
    kolomWajib: [['nisn', 'NISN'], ['nama', 'Nama']],
  },
  'soal': {
    judul: 'Soal Tes', kunci: 'id',
    kolomTabel: [['urutan', 'No'], ['pertanyaan', 'Pertanyaan'], ['tipe_a', 'Tipe A'], ['tipe_b', 'Tipe B']],
    kolomForm: [['urutan', 'Nomor urut (kosongkan = paling akhir)', 'angka'], ['pertanyaan', 'Teks pertanyaan'],
      ['teks_a', 'Pilihan A (kartu)'], ['tipe_a', 'Tipe RIASEC pilihan A', 'tipe'], ['gambar_a', 'Gambar maskot kartu A', 'gambar'],
      ['teks_b', 'Pilihan B (kartu)'], ['tipe_b', 'Tipe RIASEC pilihan B', 'tipe'], ['gambar_b', 'Gambar maskot kartu B', 'gambar']],
    kolomWajib: [['pertanyaan', 'Teks pertanyaan'], ['teks_a', 'Pilihan A'], ['teks_b', 'Pilihan B']],
  },
  sekolah: {
    judul: 'Data Sekolah', kunci: 'id',
    kolomTabel: [['npsn', 'NPSN'], ['nama', 'Nama'], ['kota', 'Kota'], ['kode_jurusan', 'Jurusan']],
    kolomForm: [['npsn', 'NPSN'], ['nama', 'Nama sekolah'], ['kota', 'Kota'], ['alamat', 'Alamat'],
      ['latitude', 'Latitude (contoh: -6.9175)', 'angka'], ['longitude', 'Longitude (contoh: 107.6191)', 'angka'],
      ['akreditasi', 'Akreditasi (contoh: Akreditasi A · Negeri)'], ['keterangan', 'Keterangan (contoh: ★ 4,8 · Juara LKS)'],
      ['kode_jurusan', 'Kode jurusan dibuka, pisahkan koma (contoh: RPL,TKJ)'], ['favorit', 'Tampilkan sebagai sekolah favorit', 'centang'],
      ['url_instagram', 'URL Instagram'], ['url_tiktok', 'URL TikTok'], ['url_spmb', 'URL SPMB']],
    kolomWajib: [['npsn', 'NPSN'], ['nama', 'Nama sekolah'], ['kota', 'Kota'], ['latitude', 'Latitude'], ['longitude', 'Longitude'], ['kode_jurusan', 'Kode jurusan']],
  },
  guru: {
    judul: 'User Guru', kunci: 'id',
    kolomTabel: [['nama', 'Nama'], ['email', 'Email'], ['sekolah_asal', 'Sekolah']],
    kolomForm: [['nama', 'Nama lengkap'], ['email', 'Email'], ['sekolah_asal', 'Sekolah asal']],
    kolomWajib: [['nama', 'Nama'], ['email', 'Email'], ['sekolah_asal', 'Sekolah asal']],
  },
  'sekolah-asal': {
    judul: 'Sekolah Asal (SMP)', kunci: 'id',
    kolomTabel: [['nama', 'Nama'], ['kota', 'Kota']],
    kolomForm: [['nama', 'Nama sekolah'], ['kota', 'Kota']],
    kolomWajib: [['nama', 'Nama sekolah']],
  },
};
