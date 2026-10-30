# AI Logbook — Proyek "ApaJurusanku"

## Tahap 1: Eksplorasi Ide & Perancangan Solusi
* **Referensi & Diskusi Awal:** [Gemini Share - Konsep Awal](https://share.gemini.google/kj4ZiIRnmru6)

### A. Perumusan Konsep Aplikasi
> **Latar Belakang:**  
> Kami (usia 16 tahun) ingin membuat platform web untuk perlombaan setelah mengikuti kegiatan Latika 2026. Target pengguna kami adalah siswa SMP kelas 9 yang akan melanjutkan ke jenjang SMK, namun merasa bingung dalam memilih jurusan yang sesuai dengan minat dan bakat mereka.
> 
> Sebagai langkah awal, kami melakukan pencarian di Google mengenai *"Tes untuk mengetahui minat dan bakat"*.

#### 🛠️ Validasi & Modifikasi Mandiri
Sebelum mengimplementasikannya, kami mencoba dan menguji beberapa platform tes RIASEC yang ada secara mandiri untuk memahami alur pertanyaan dan sistem penilaiannya. 

Dari hasil uji coba tersebut, kami mendapati bahwa format pertanyaan tes yang ada di luar sana terkadang terlalu panjang dan menggunakan bahasa psikologi yang kaku untuk anak usia 15 tahun. Oleh karena itu, kami memodifikasi dan menyaring ulang rangkaian soal tersebut menjadi format pertanyaan yang:
- Lebih ringkas
- Ramah remaja
- Disesuaikan secara khusus dengan rumpun jurusan yang tersedia di SMK (seperti teknik, teknologi informasi, bisnis, dan seni)

Langkah ini dilakukan agar hasil rekomendasi pada web **ApaJurusanku** menjadi jauh lebih akurat dan mudah dipahami oleh siswa SMP.

---

### B. Pembuatan Aset Visual (Maskot Gardaratama)
* **Referensi Diskusi Maskot:**
  - [Gemini Share - Perancangan Maskot Part 1](https://share.gemini.google/BBg8atpQDlW4)
  - [Gemini Share - Perancangan Maskot Part 2](https://share.gemini.google/6kAKRLRh4JP9)

Untuk membuat pengalaman pengguna saat mengikuti tes menjadi lebih menarik dan tidak membosankan, kami merancang sebuah maskot yang akan menemani siswa di setiap pertanyaan tes.

1. **Penamaan:** Maskot diberi nama **Gardaratama**.
2. **Perancangan Karakter:** Kami mendefinisikan deskripsi karakteristik, penampilan visual, dan kemampuan fungsional dari Gardaratama.
3. **Pemanfaatan AI:** Kami meminta AI untuk membuatkan contoh gambaran visual serta *Product Requirement Document* (PRD) mengenai maskot tersebut.
4. **Penyesuaian:** Kami mengarahkan AI untuk menyelaraskan karakter Gardaratama dengan konteks soal tes bakat dan minat RIASEC yang telah disesuaikan dari referensi (seperti Aku Pintar).

---

### C. Pembuatan Mockup dan Wireframe UI/UX
* **Referensi Sesi Diskusi Multi-Role:** [Claude Share - Logika & UI/UX Multi-Role](https://claude.ai/share/404860b2-e9e0-4785-8fef-dcf64c8fd25d)

Awalnya kami hanya merancang tampilan antarmuka dan fitur khusus untuk *role* Siswa yang ingin melakukan tes minat bakat. Namun, agar proyek web ini jauh lebih komprehensif dan fungsional, kami menambahkan dua *role* tambahan:
- **Guru:** Berfungsi untuk memantau dan mencetak rekap hasil tes siswa di sekolahnya.
- **Admin:** Berfungsi untuk manajemen data CRUD database via `store.js` tanpa *hard-code*.

Kami menggunakan AI untuk membantu merancangkan alur logika login dan struktur halaman untuk ketiga *role* tersebut.

#### 🛠️ Validasi & Modifikasi Mandiri
Meskipun AI memberikan kerangka dasar sistem *multi-role*, kami melakukan modifikasi dan pengujian ketat secara mandiri:
- Menerapkan sistem validasi **NISN** dan **email terdaftar** untuk mencegah duplikasi data serta menjaga keamanan akses login.
- Menyelaraskan penyimpanan data berbasis JSON (`store.js`) agar hak akses CRUD admin dapat berjalan lancar tanpa memerlukan database eksternal yang rumit.

---

## Tahap 2: Penyusunan Kerangka Kode (Scaffolding)
* **Referensi Sesi Scaffolding:** [Claude Share - Scaffolding](https://claude.ai/share/c97f860c-d346-4ac2-a15c-c11439e25d7d)

Pada tahap ini, kerangka kode dasar dan struktur komponen web dibangun secara terstruktur sesuai arsitektur *multi-role* dan modul tes yang direncanakan.

---

## Tahap 3: Pemecahan Masalah & Penanganan Galat (Debugging)
* **Referensi Sesi Debugging:** [Gemini Share - Debugging](https://share.gemini.google/vgOf36tVZdwo)

Penanganan *bugs*, penyesuaian logika sistem, dan perbaikan galat pada fitur-fitur utama dilakukan melalui pengujian intensif dan bantuan iterasi analisis bersama AI.

---

## Tahap 4: Refleksi & Penjelasan Kode

Kami berdua sangat memahami setiap baris kode yang ada dalam proyek ini:
1. **Peran AI:** AI sangat mempercepat pekerjaan kami dalam memberikan kerangka awal dan membangkitkan data JSON massal (seperti bank soal dan kerangka mockup).
2. **Eksekusi Mandiri:** Perakitan akhir, pembuatan komponen UI/UX yang responsif, dan penyesuaian fungsi CRUD sepenuhnya adalah hasil pemikiran dan ketikan tangan kami sendiri.
3. **Akurasi Data:** Kami selalu memverifikasi ulang data SMK dan SMP dari sumber resmi (Situs Kemdikbud/Dindik Jatim), tidak sekadar menerima data dari AI.
4. **Prinsip Pengodingan:** Kami tidak pernah menggunakan metode *copy-paste* buta. Setiap blok kode dari AI kami pelajari logikanya, kami beri komentar (*inline comments*), dan kami modifikasi sintaksnya agar seragam dengan gaya koding tim kami.
