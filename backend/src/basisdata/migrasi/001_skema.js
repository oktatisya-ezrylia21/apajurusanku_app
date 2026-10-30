// Skema tabel SQLite. Semua perintah memakai IF NOT EXISTS sehingga aman dijalankan berulang.
// Penamaan kolom memakai snake_case Indonesia dan dipakai apa adanya di JSON API.
export const SKEMA_SQL = `
  -- Daftar jurusan SMK. "kode_riasec" berisi tipe RIASEC; huruf pertama = tipe utama (bobot 2).
  CREATE TABLE IF NOT EXISTS jurusan (
    kode          TEXT PRIMARY KEY,
    nama          TEXT NOT NULL,
    kode_riasec   TEXT NOT NULL,
    deskripsi     TEXT,
    pembelajaran  TEXT,
    prospek_kerja TEXT,
    lanjut_kuliah TEXT
  );

  -- SMP/MTs asal siswa (dipakai guru saat mengisi data sekolah).
  CREATE TABLE IF NOT EXISTS sekolah_asal (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nama  TEXT NOT NULL UNIQUE,
    kota  TEXT
  );

  CREATE TABLE IF NOT EXISTS siswa (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    nisn          TEXT NOT NULL UNIQUE,
    nama          TEXT NOT NULL,
    sekolah_asal  TEXT,
    dibuat_pada   TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS guru (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    nama          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    sekolah_asal  TEXT NOT NULL,
    dibuat_pada   TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS admin (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    username         TEXT NOT NULL UNIQUE,
    kata_sandi_hash  TEXT NOT NULL
  );

  -- Soal berbentuk dua pilihan (A/B). Tiap pilihan mewakili satu tipe RIASEC.
  CREATE TABLE IF NOT EXISTS soal (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    urutan      INTEGER NOT NULL,
    pertanyaan  TEXT NOT NULL,
    teks_a      TEXT NOT NULL,
    tipe_a      TEXT NOT NULL CHECK (tipe_a IN ('R','I','A','S','E','C')),
    gambar_a    TEXT,
    teks_b      TEXT NOT NULL,
    tipe_b      TEXT NOT NULL CHECK (tipe_b IN ('R','I','A','S','E','C')),
    gambar_b    TEXT
  );

  -- SMK tujuan. "kode_jurusan" berisi kode jurusan dipisah koma, contoh: 'RPL,TKJ'.
  CREATE TABLE IF NOT EXISTS sekolah (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    npsn           TEXT NOT NULL UNIQUE,
    nama           TEXT NOT NULL,
    kota           TEXT NOT NULL,
    alamat         TEXT,
    latitude       REAL NOT NULL,
    longitude      REAL NOT NULL,
    akreditasi     TEXT,
    keterangan     TEXT,
    favorit        INTEGER NOT NULL DEFAULT 0,
    kode_jurusan   TEXT NOT NULL DEFAULT '',
    url_instagram  TEXT,
    url_tiktok     TEXT,
    url_spmb       TEXT
  );

  -- Satu baris = satu kali siswa menyelesaikan tes. Ranking disimpan sebagai JSON.
  CREATE TABLE IF NOT EXISTS hasil_tes (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    siswa_id         INTEGER NOT NULL REFERENCES siswa(id) ON DELETE CASCADE,
    skor_tipe        TEXT NOT NULL,
    ranking_jurusan  TEXT NOT NULL,
    dibuat_pada      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Jawaban per soal untuk setiap hasil tes.
  CREATE TABLE IF NOT EXISTS jawaban (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    hasil_tes_id  INTEGER NOT NULL REFERENCES hasil_tes(id) ON DELETE CASCADE,
    soal_id       INTEGER NOT NULL,
    tipe_dipilih  TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_hasil_siswa ON hasil_tes(siswa_id);
  CREATE INDEX IF NOT EXISTS idx_jawaban_hasil ON jawaban(hasil_tes_id);
`;
