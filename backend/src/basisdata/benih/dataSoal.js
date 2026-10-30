// ============================================================================
// DATA SOAL TES MINAT — edit file ini untuk mengganti pertanyaan & pilihan.
//
// Cara kerja: tiap baris PASANGAN_KEGIATAN berisi dua kegiatan yang saling dibandingkan:
//   [tipeA, 'teks pilihan A', tipeB, 'teks pilihan B']
// Setiap pasangan dipakai DUA kali dengan kalimat pengantar berbeda (urutan A/B ditukar),
// sehingga 12 pasangan menghasilkan 24 soal.
//
// Ingin soal manual satu per satu? Ganti DAFTAR_SOAL di bawah dengan array objek:
//   { pertanyaan, tipe_a, teks_a, tipe_b, teks_b }
// Gambar maskot kartu diunggah lewat panel Admin (menu Soal Tes).
// ============================================================================

export const KALIMAT_PENGANTAR = [
  'Kalau kamu lagi bebas tugas di rumah, kegiatan apa yang paling asyik?',
  'Tontonan YouTube/TikTok seperti apa yang bikin kamu betah berjam-jam?',
  'Kalau sekolah ngadain bazar kelas, peran apa yang kamu ambil?',
  'Saat melihat sesuatu yang baru, kamu lebih suka...',
  'Dalam tugas kelompok presentasi, bagian mana yang kamu pilih?',
  'Ketika ada teman yang ketinggalan pelajaran, apa yang kamu lakukan?',
  'Gaya belajar mana yang menurutmu paling efektif?',
  'Kalau kamu ikut ekstrakurikuler Jurnalistik/Mading, tugasmu adalah...',
  'Kalau gadget/laptop-mu tiba-tiba lemot, apa reaksi pertamamu?',
  'Jika panitia pensi (pentas seni) sekolah kehabisan dana, solusimu?',
  'Kalau ada masalah rumit di organisasi, pendekatanmu...',
  'Ketika merawat barang kesayanganmu di rumah...',
  'Tipe pelajaran yang paling bikin kamu bersemangat?',
  'Kamu lebih bangga jika orang lain memujimu karena...',
  'Suasana belajar/kerja impianmu di masa depan adalah...',
  'Di waktu senggang yang panjang, kamu lebih suka mencoba...',
  'Jika disuruh magang (PKL), tempat mana yang kamu incar?',
  'Bekerja ideal menurutmu melibatkan...',
  'Kamu merasa berguna ketika...',
  'Alat utama yang ingin kamu kuasai untuk bekerja nanti?',
  'Bayangkan kamu lulus SMK. Apa target pertamamu?',
  'Impian terbesarmu suatu saat nanti adalah...',
  'Profesi yang menurutmu "mulia" dan ingin kamu tekuni?',
  'Project impian yang ingin kamu ciptakan suatu hari nanti?'
];

// [tipeA, teksA, tipeB, teksB]
export const PASANGAN_KEGIATAN = [
  ['R', 'Membongkar alat elektronik rusak, ngoprek motor/sepeda, atau bikin kerajinan.', 'A', 'Menggambar, mendesain poster, atau mengedit foto/video estetis.'],
  ['I', 'Video eksperimen sains, membongkar misteri, atau tutorial teknologi.', 'S', 'Video vlog interaksi sosial, tips psikologi, atau konten berbagi kebaikan.'],
  ['E', 'Jadi seksi promosi, nawarin barang ke pembeli, dan cari strategi biar laris.', 'C', 'Jadi bendahara yang pegang uang kas dan nyatet semua pemasukan-pengeluaran.'],
  ['R', 'Langsung menyentuh, merakit, atau mencoba alatnya dengan tangan sendiri.', 'I', 'Membaca manualnya, menganalisis cara kerjanya, dan mencari tahu logikanya.'],
  ['A', 'Mendesain slide presentasi biar animasinya keren dan enak dilihat.', 'E', 'Jadi pembicara utama (MC) yang mempresentasikan di depan kelas.'],
  ['S', 'Menemaninya dan mengajarinya pelan-pelan sampai dia paham.', 'C', 'Meminjamkan buku catatanmu yang super rapi dan terstruktur untuk dia salin.'],
  ['R', 'Praktik langsung di bengkel, lapangan, atau dapur sekolah.', 'S', 'Belajar kelompok, diskusi, dan tanya jawab bareng teman-teman.'],
  ['A', 'Menulis puisi, cerita pendek, atau melukis komik strip.', 'I', 'Mencari fakta, mewawancarai sumber, dan menganalisis isu sekolah.'],
  ['R', 'Buka casing-nya, bersihin debunya, atau cek kabel dan perangkat kerasnya.', 'I', 'Buka sistem pengaturannya, cari kode error-nya, dan googling solusi teknisnya.'],
  ['E', 'Cari sponsor ke perusahaan atau jualan merchandise dengan target besar.', 'C', 'Evaluasi ulang proposal, potong anggaran yang gak perlu, dan hitung ulang agar pas.'],
  ['S', 'Mengajak semua pihak ngobrol dari hati ke hati untuk mencari jalan tengah.', 'A', 'Membuat kampanye visual/poster kreatif agar pesannya tersampaikan tanpa harus marah-marah.'],
  ['S', 'Memandikan hewan peliharaan atau merawat tanaman dengan penuh kasih sayang.', 'C', 'Menata barang-barang di rak secara berurutan sesuai warna, ukuran, atau abjad.'],
  ['I', 'Matematika, IPA, atau Pemrograman (Coding) yang penuh logika dan rumus pasti.', 'A', 'Seni Budaya, Sastra, atau Bahasa yang membebaskanmu berimajinasi tanpa batas pasti.'],
  ['R', 'Hasil karya fisik yang kamu buat (misal: barang rakitan, jahitan, atau masakan).', 'E', 'Kemampuanmu membujuk orang, bernegosiasi, atau memimpin tim.'],
  ['C', 'Jadwalnya jelas, teratur, ada aturannya (SOP), dan di dalam ruangan yang nyaman.', 'S', 'Dinamis, banyak bertemu orang baru, dan fokus pada pelayanan masyarakat.'],
  ['I', 'Membaca artikel misteri, sejarah, atau teori konspirasi yang bikin mikir keras.', 'E', 'Cari ide bisnis kecil-kecilan (seperti jastip atau jualan makanan) buat nambah uang jajan.'],
  ['R', 'Pabrik otomotif, perkebunan modern, atau lokasi konstruksi bangunan.', 'A', 'Studio animasi, agensi periklanan (DKV), atau brand fashion.'],
  ['I', 'Data penelitian, alat lab (kesehatan/farmasi), dan software komputer.', 'C', 'Berkas administrasi, mesin kasir, atau data laporan keuangan perusahaan (Akuntansi).'],
  ['S', 'Berhasil membantu orang yang sedang sakit atau kesulitan (Keperawatan/Pariwisata).', 'E', 'Berhasil mencapai target penjualan atau menang perlombaan bisnis.'],
  ['R', 'Mesin las, alat potong kayu, mesin mobil, atau alat masak profesional.', 'C', 'Microsoft Excel, Word, aplikasi perkantoran, dan sistem arsip.'],
  ['I', 'Ikut sertifikasi ahli IT, spesialis coding, atau analis kimia/farmasi.', 'A', 'Bikin portfolio karya seni, channel YouTube sendiri, atau rilis produk desain.'],
  ['R', 'Punya bengkel kendaraan sendiri atau restoran pribadi yang laris.', 'E', 'Jadi CEO, pengusaha sukses, atau pimpinan perusahaan besar.'],
  ['S', 'Guru, Perawat, atau Resepsionis Hotel yang bikin pengunjung tersenyum.', 'C', 'Staff Bank, Akuntan, atau Admin Logistik yang mengatur segala hal jadi lancar.'],
  ['A', 'Merek pakaian lokal (distro) sendiri atau komik/game buatan sendiri.', 'E', 'Mendirikan start-up jual beli dan membuka banyak lapangan kerja.']
];

// ---- Gambar maskot kartu soal ----
// Folder: frontend/public/aset/gambar/pict-maskot-jawaban/ berisi "Maskot Q{nomor}{A|B}.jpeg".
// Nama file memuat spasi, jadi jalurnya WAJIB di-encode ("Maskot%20Q1A.jpeg").
export const FOLDER_GAMBAR_SOAL = 'aset/gambar/pict-maskot-jawaban';
export const namaFileGambarSoal = (nomor, sisi) => `Maskot Q${nomor}${sisi}.jpeg`;
export const jalurGambarSoal = (nomor, sisi) => `/${FOLDER_GAMBAR_SOAL}/${encodeURIComponent(namaFileGambarSoal(nomor, sisi))}`;

export const DAFTAR_SOAL = PASANGAN_KEGIATAN.map(([tipeA, teksA, tipeB, teksB], index) => ({
  pertanyaan: KALIMAT_PENGANTAR[index],
  tipe_a: tipeA,
  teks_a: teksA,
  tipe_b: tipeB,
  teks_b: teksB,
  gambar_a: jalurGambarSoal(index + 1, 'A'),
  gambar_b: jalurGambarSoal(index + 1, 'B'),
}));
